"""
Main comic generation orchestrator
"""

from typing import Dict, List, Optional
import asyncio
from datetime import datetime
import logging
import json
from pathlib import Path

from .services import ScriptGeneratorService, ArtworkGeneratorService
from .models import ComicMetadata
from .core.config import config

logger = logging.getLogger(__name__)


class ComicGenerationEngine:
    """Main engine for orchestrating comic generation"""

    def __init__(self):
        self.script_service = ScriptGeneratorService()
        self.artwork_service = ArtworkGeneratorService()
        self.output_dir = Path("output/comics")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        logger.info("🎨 Comic generation engine initialized")

    async def generate_comic(self, topic: str, 
                           tone: str = "humorous",
                           target_audience: str = "general",
                           visual_style: str = "modern digital comic") -> ComicMetadata:
        """
        Generate a complete comic from topic to final artwork

        Args:
            topic: The topic/story to visualize
            tone: Comic tone (humorous, educational, dramatic, etc.)
            target_audience: Target audience
            visual_style: Visual art style

        Returns:
            ComicMetadata with generation details and file paths
        """
        comic_id = self._generate_comic_id(topic=topic, tone=tone)
        logger.info("🚀 Starting comic generation for: %s (ID: %s)", topic, comic_id)

        try:
            # Step 1: Generate comic script using Gemini
            logger.info("📝 Generating comic script...")
            script = await self.script_service.generate_comic_script(
                topic=topic,
                tone=tone,
                target_audience=target_audience
            )

            # Step 2: Validate and prepare panels for artwork generation
            logger.info("🔍 Validating panels for artwork generation...")
            validated_panels = self._validate_panels(script.get('panels', []))
            logger.info(f"✅ Validated {len(validated_panels)} panels")

            # Step 3: Generate comic artwork using Imagen
            logger.info("🎨 Generating comic artwork...")
            comic_image_bytes = await self.artwork_service.generate_complete_comic(
                panels=validated_panels,
                style_theme=visual_style
            )

            # Step 4: Save outputs and create metadata
            comic_metadata = await self._save_comic_outputs(
                comic_id=comic_id,
                script=script,
                panels=validated_panels,
                image_bytes=comic_image_bytes,
                generation_params={
                    'topic': topic,
                    'tone': tone,
                    'target_audience': target_audience,
                    'visual_style': visual_style
                }
            )

            logger.info("🎉 Comic generation completed successfully: %s", comic_id)
            return comic_metadata

        except Exception as e:
            logger.error("❌ Comic generation failed for %s: %s", comic_id, str(e))
            raise

    async def generate_batch_comics(self, topics: List[str], 
                                  tone: str = "humorous",
                                  visual_style: str = "modern digital comic") -> List[ComicMetadata]:
        """
        Generate multiple comics for different topics

        Args:
            topics: List of topics to generate comics for
            tone: Comic tone
            visual_style: Visual art style

        Returns:
            List of ComicMetadata for successfully generated comics
        """
        comics = []
        total_topics = len(topics)

        logger.info("🔄 Starting batch generation for %d topics", total_topics)

        for i, topic in enumerate(topics):
            logger.info("📚 Generating comic %d/%d for topic: %s", i+1, total_topics, topic)
            try:
                comic = await self.generate_comic(
                    topic=topic,
                    tone=tone,
                    visual_style=visual_style
                )
                comics.append(comic)

                # Add delay to respect API rate limits
                if i < total_topics - 1:  # Don't wait after the last comic
                    await asyncio.sleep(2)

            except Exception as e:
                logger.error("❌ Failed to generate comic for topic '%s': %s", topic, str(e))
                continue

        success_rate = len(comics) / total_topics * 100
        logger.info("🏁 Batch generation completed: %d/%d comics (%.1f%% success rate)", 
                   len(comics), total_topics, success_rate)
        return comics

    def list_generated_comics(self) -> List[ComicMetadata]:
        """List all generated comics with their metadata"""
        comics = []

        for comic_dir in self.output_dir.iterdir():
            if comic_dir.is_dir():
                metadata_file = comic_dir / "metadata.json"
                if metadata_file.exists():
                    try:
                        with open(metadata_file, 'r', encoding='utf-8') as f:
                            metadata_dict = json.load(f)
                            comics.append(ComicMetadata.from_dict(metadata_dict))
                    except Exception as e:
                        logger.warning("Could not read metadata for %s: %s", comic_dir.name, str(e))

        # Sort by generation time (newest first)
        comics.sort(key=lambda x: x.generated_at, reverse=True)
        return comics

    def _validate_panels(self, panels: List[Dict]) -> List[Dict]:
        """Validate and fix panel data for artwork generation"""
        validated_panels = []

        for i, panel in enumerate(panels):
            if isinstance(panel, dict):
                validated_panels.append(panel)
                if i < 2:  # Log first 2 panels for debugging
                    scene_desc = panel.get('scene_description', '')
                    logger.info(f"   Panel {i+1}: {scene_desc[:80]}...")
            else:
                logger.warning(f"Panel {i+1} is invalid type: {type(panel)}")
                # Create a basic panel structure
                basic_panel = {
                    "panel_number": i+1,
                    "scene_description": f"Panel {i+1} scene",
                    "characters": ["Character"],
                    "dialogue": [{"character": "Character", "text": f"Panel {i+1}"}],
                    "visual_focus": "Main scene"
                }
                validated_panels.append(basic_panel)

        return validated_panels

    async def _save_comic_outputs(self, comic_id: str, script: Dict, 
                                panels: List[Dict], image_bytes: bytes,
                                generation_params: Dict) -> ComicMetadata:
        """Save comic outputs and return metadata"""

        # Create comic-specific directory
        comic_dir = self.output_dir / comic_id
        comic_dir.mkdir(exist_ok=True)

        # Save script as JSON
        script_path = comic_dir / "script.json"
        with open(script_path, 'w', encoding='utf-8') as f:
            json.dump(script, f, indent=2, ensure_ascii=False)

        # Save comic image
        image_path = comic_dir / f"comic.{config.comic.output_format.lower()}"
        with open(image_path, 'wb') as f:
            f.write(image_bytes)

        # Create and save metadata
        metadata = ComicMetadata(
            comic_id=comic_id,
            generated_at=datetime.now().isoformat(),
            title=script.get('title', 'Untitled Comic'),
            theme=script.get('theme', ''),
            panel_count=len(panels),
            generation_params=generation_params,
            files={
                'script': str(script_path),
                'image': str(image_path)
            }
        )

        metadata_path = comic_dir / "metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata.to_dict(), f, indent=2, ensure_ascii=False)

        return metadata

    def _generate_comic_id(self, topic: str = "", tone: str = "general") -> str:
        """Generate a unique ID for the comic based on input parameters"""
        import re

        # Sanitize topic for use in filename
        sanitized_topic = re.sub(r'[^\w\s-]', '', topic.lower())
        sanitized_topic = re.sub(r'[-\s]+', '_', sanitized_topic)
        sanitized_topic = sanitized_topic[:30]  # Limit length

        # Sanitize tone
        sanitized_tone = re.sub(r'[^\w]', '', tone.lower())[:15]

        # Generate timestamp for uniqueness
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Construct ID with meaningful components
        if sanitized_topic:
            if sanitized_tone and sanitized_tone != "general":
                return f"{sanitized_topic}_{sanitized_tone}_{timestamp}"
            else:
                return f"{sanitized_topic}_{timestamp}"
        else:
            return f"daily_comic_{timestamp}"
