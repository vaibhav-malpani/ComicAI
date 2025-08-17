from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import os
import json
import time
from pathlib import Path
import logging
from datetime import datetime
import uvicorn

# Import our comic generation logic
from app.comic_generator import ComicGenerationEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Comics Generator API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize comic generation engine
comic_engine = ComicGenerationEngine()

# Pydantic models
class ComicRequest(BaseModel):
    topic: str
    tone: str = "humorous"
    target_audience: str = "general"
    visual_style: str = "modern digital comic"

class BatchComicRequest(BaseModel):
    topics: List[str]
    tone: str = "humorous"
    visual_style: str = "modern digital comic"

class ComicResponse(BaseModel):
    comic_id: str
    title: str
    theme: str
    generated_at: str
    panel_count: int
    files: Dict[str, str]
    generation_params: Dict[str, Any]

# In-memory storage for generation status
generation_tasks: Dict[str, Dict] = {}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/comics/generate", response_model=ComicResponse)
async def generate_comic(request: ComicRequest, background_tasks: BackgroundTasks):
    """Generate a single comic"""
    try:
        logger.info(f"Generating comic for topic: {request.topic}")

        comic_metadata = await comic_engine.generate_comic(
            topic=request.topic,
            tone=request.tone,
            target_audience=request.target_audience,
            visual_style=request.visual_style
        )

        # Convert ComicMetadata to dict for response
        comic_dict = comic_metadata.to_dict()

        logger.info(f"Comic generated successfully: {comic_dict['comic_id']}")
        return ComicResponse(**comic_dict)

    except Exception as e:
        logger.error(f"Failed to generate comic: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate comic: {str(e)}")

@app.post("/api/comics/generate/batch")
async def generate_batch_comics(request: BatchComicRequest, background_tasks: BackgroundTasks):
    """Generate multiple comics (async)"""
    task_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    generation_tasks[task_id] = {
        "status": "started",
        "total": len(request.topics),
        "completed": 0,
        "comics": [],
        "started_at": datetime.now().isoformat(),
        "errors": []
    }

    async def generate_batch():
        try:
            comics_metadata = await comic_engine.generate_batch_comics(
                topics=request.topics,
                tone=request.tone,
                visual_style=request.visual_style
            )

            # Convert ComicMetadata objects to dicts
            comics_dicts = [comic.to_dict() for comic in comics_metadata]

            generation_tasks[task_id]["status"] = "completed"
            generation_tasks[task_id]["completed"] = len(comics_dicts)
            generation_tasks[task_id]["comics"] = comics_dicts
            generation_tasks[task_id]["completed_at"] = datetime.now().isoformat()

        except Exception as e:
            logger.error(f"Batch generation failed: {str(e)}")
            generation_tasks[task_id]["status"] = "failed"
            generation_tasks[task_id]["error"] = str(e)

    background_tasks.add_task(generate_batch)

    return {"task_id": task_id, "status": "started", "message": "Batch generation started"}

@app.get("/api/comics/batch/{task_id}")
async def get_batch_status(task_id: str):
    """Get status of batch generation"""
    if task_id not in generation_tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    return generation_tasks[task_id]

@app.get("/api/comics")
async def list_comics():
    """List all generated comics"""
    try:
        comics_metadata = comic_engine.list_generated_comics()
        comics_dicts = [comic.to_dict() for comic in comics_metadata]
        return {"comics": comics_dicts}
    except Exception as e:
        logger.error(f"Failed to list comics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list comics")

@app.get("/api/comics/{comic_id}")
async def get_comic(comic_id: str):
    """Get specific comic details"""
    try:
        comics_metadata = comic_engine.list_generated_comics()
        comic = next((c for c in comics_metadata if c.comic_id == comic_id), None)

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        return comic.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get comic {comic_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get comic")

@app.get("/api/comics/{comic_id}/image")
async def get_comic_image(comic_id: str):
    """Serve comic image"""
    try:
        comics_metadata = comic_engine.list_generated_comics()
        comic = next((c for c in comics_metadata if c.comic_id == comic_id), None)

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        image_path = Path(comic.files["image"])
        if not image_path.exists():
            raise HTTPException(status_code=404, detail="Image file not found")

        return FileResponse(
            image_path, 
            media_type="image/png",
            filename=f"{comic_id}.png"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to serve comic image {comic_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to serve image")

@app.get("/api/comics/{comic_id}/video")
async def get_comic_video(comic_id: str):
    """Serve comic video"""
    try:
        comics_metadata = comic_engine.list_generated_comics()
        comic = next((c for c in comics_metadata if c.comic_id == comic_id), None)

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        # Check if video exists and is completed
        if not comic.video_url or comic.video_status != "completed":
            raise HTTPException(status_code=404, detail="Video not available")

        video_path = Path(comic.video_url)
        if not video_path.exists():
            # Try alternative path in files dict
            if "video" in comic.files:
                video_path = Path(comic.files["video"])

            if not video_path.exists():
                logger.error(f"Video file not found for comic {comic_id}: {video_path}")
                raise HTTPException(status_code=404, detail="Video file not found")

        logger.info(f"Serving video file: {video_path}")

        return FileResponse(
            video_path, 
            media_type="video/mp4",
            filename=f"{comic_id}_video.mp4",
            headers={
                "Accept-Ranges": "bytes",
                "Content-Type": "video/mp4"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to serve comic video {comic_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to serve video")

@app.get("/api/comics/{comic_id}/script")
async def get_comic_script(comic_id: str):
    """Get comic script"""
    try:
        comics_metadata = comic_engine.list_generated_comics()
        comic = next((c for c in comics_metadata if c.comic_id == comic_id), None)

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        script_path = Path(comic.files["script"])
        if not script_path.exists():
            raise HTTPException(status_code=404, detail="Script file not found")

        with open(script_path, 'r', encoding='utf-8') as f:
            script = json.load(f)

        return script

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get comic script {comic_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get script")

@app.post("/api/comics/{comic_id}/generate-video")
async def generate_comic_video(comic_id: str):
    """Generate video from comic script using Veo 3 - synchronous operation"""
    try:
        # Import video service here to avoid circular imports
        from app.services.video_service import VideoGenerationService

        # Get comic metadata and script
        comics_metadata = comic_engine.list_generated_comics()
        comic = next((c for c in comics_metadata if c.comic_id == comic_id), None)

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        # Check if video already exists
        if comic.video_status == "completed" and comic.video_url:
            return {
                "message": "Video already exists", 
                "status": "completed",
                "video_url": comic.video_url,
                "generated_at": comic.video_generated_at,
                "processing_time_seconds": comic.video_processing_time_seconds
            }

        # Get comic script
        script_path = Path(comic.files["script"])
        if not script_path.exists():
            raise HTTPException(status_code=404, detail="Script file not found")

        with open(script_path, 'r', encoding='utf-8') as f:
            script = json.load(f)

        # Update status to generating
        comic.video_status = "generating"
        comic_engine.update_comic_metadata(comic)

        try:
            # Generate video synchronously
            video_service = VideoGenerationService()
            start_time = time.time()
            logger.info(f"Starting synchronous video generation for comic {comic_id}")

            video_result = await video_service.generate_video_from_script(script, comic.title, comic_id)

            processing_time = time.time() - start_time

            if video_result and isinstance(video_result, dict):
                final_video_path = video_result.get('final_video_path')
                panel_video_uris = video_result.get('panel_video_uris', [])

                if final_video_path:
                    # Video is already in the comic directory, no need to move
                    # Update comic metadata with video information
                    comic.video_url = final_video_path
                    comic.video_status = "completed"
                    comic.video_generated_at = datetime.now().isoformat()
                    comic.video_processing_time_seconds = processing_time

                    # Store panel video URIs in metadata (new field)
                    comic.panel_video_uris = panel_video_uris

                    # Update files dict to include video
                    comic.files["video"] = final_video_path

                    comic_engine.update_comic_metadata(comic)

                    logger.info(f"Video generated successfully for comic {comic_id} in {processing_time:.2f}s")

                    return {
                        "message": "Video generated successfully", 
                        "status": "completed",
                        "video_url": final_video_path,
                        "panel_video_uris": panel_video_uris,
                        "generated_at": comic.video_generated_at,
                        "processing_time_seconds": processing_time
                    }
                else:
                    comic.video_status = "failed"
                    comic_engine.update_comic_metadata(comic)
                    raise HTTPException(status_code=500, detail="Video generation failed - no final video path")
            else:
                comic.video_status = "failed"
                comic_engine.update_comic_metadata(comic)
                raise HTTPException(status_code=500, detail="Video generation failed - no video result returned")

        except Exception as e:
            logger.error(f"Video generation failed for comic {comic_id}: {str(e)}")
            comic.video_status = "failed"
            comic_engine.update_comic_metadata(comic)
            raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate video for {comic_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate video")

# Mount static files for frontend
static_path = Path(__file__).parent / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=static_path), name="static")

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
