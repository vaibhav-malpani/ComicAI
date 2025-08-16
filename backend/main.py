from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import os
import json
from pathlib import Path
import logging
from datetime import datetime
import uvicorn

# Import our comic generation logic
from app.comic_generator import ComicGenerationEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Daily Comics Generator API", version="1.0.0")

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

@app.get("/")
async def root():
    return {"message": "Daily Comics Generator API", "version": "1.0.0"}

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
