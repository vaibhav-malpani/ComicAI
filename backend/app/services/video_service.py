"""
Video generation service using Google Veo 3
"""

import os
import time
import asyncio
import logging
from typing import Optional, Dict, Any

from google import genai
from google.genai.types import GenerateVideosConfig, Image
from ..core.config import config

logger = logging.getLogger(__name__)


class VideoGenerationService:
    """Service for generating videos using Google Veo 3"""

    def __init__(self):
        """Initialize the video generation service"""
        self.client = genai.Client(vertexai=True,
                                   project=config.video.project_id,
                                   location=config.video.location)
        self.model_name = config.video.model_name

        # Get GCS bucket from environment variable
        self.gcs_bucket = os.getenv("GCS_BUCKET", "")
        if self.gcs_bucket.startswith("gs://"):
            self.gcs_bucket = self.gcs_bucket.replace("gs://", "").rstrip("/")

        logger.info(f"Using GCS bucket: {self.gcs_bucket}")

    async def generate_video_from_script(self, comic_script: Dict[str, Any], comic_title: str, comic_id: str) -> Optional[str]:
        """
        Generate a video from comic script using Veo 3 - creates 8-second video per panel and joins them

        Args:
            comic_script: The comic script data
            comic_title: Title of the comic
            comic_id: The comic ID for directory organization

        Returns:
            URL of the final joined video or None if generation failed
        """
        try:
            start_time = time.time()
            logger.info(f"Starting panel-based video generation for comic: {comic_title}")

            # Extract panels from script
            panels = comic_script.get('panels', [])
            if not panels:
                logger.error("No panels found in comic script")
                return None

            logger.info(f"Generating videos for {len(panels)} panels")

            # Extract consistent character descriptions from all panels
            character_descriptions = self._extract_character_descriptions(comic_script, panels)

            # Generate video for each panel with consistent character descriptions
            panel_video_uris = []
            panel_video_files = []

            for i, panel in enumerate(panels):
                panel_prompt = self._create_consistent_panel_video_prompt(
                    panel, i + 1, comic_title, character_descriptions
                )
                logger.info(f"Generating video for panel {i + 1}/{len(panels)}")

                panel_video_uri = self._generate_single_panel_video(panel_prompt, i + 1, comic_id)
                if panel_video_uri:
                    panel_video_uris.append(panel_video_uri)

                    # Download the video file directly to comic directory (parallel to script.json)
                    video_file_path = self._download_video_to_comic_dir(panel_video_uri, i + 1, comic_id)
                    if video_file_path:
                        panel_video_files.append(video_file_path)
                    else:
                        logger.warning(f"Failed to download video file for panel {i + 1}")
                else:
                    logger.warning(f"Failed to generate video for panel {i + 1}")

            if not panel_video_uris:
                logger.error("No panel videos were generated successfully")
                return None

            # Join all downloaded panel videos together
            logger.info(f"Joining {len(panel_video_files)} panel videos")
            final_video_path = self._join_downloaded_videos(panel_video_files, comic_id)

            if final_video_path:
                processing_time = time.time() - start_time
                logger.info(f"Complete video generation finished in {processing_time:.2f}s")

                # Return both the final video path and the panel URIs for metadata
                return {
                    'final_video_path': final_video_path,
                    'panel_video_uris': panel_video_uris,
                    'processing_time': processing_time
                }
            else:
                logger.error("Failed to join panel videos")
                return None

        except Exception as e:
            import traceback
            traceback.print_exc()
            logger.error(f"Error generating panel-based video: {str(e)}")
            return None

    def _extract_character_descriptions(self, comic_script: Dict[str, Any], panels: list) -> Dict[str, str]:
        """
        Extract and create consistent character descriptions from the comic script

        Args:
            comic_script: The complete comic script
            panels: List of panels

        Returns:
            Dictionary mapping character names to their descriptions
        """
        character_descriptions = {}

        # Get all unique characters from all panels
        all_characters = set()
        for panel in panels:
            if 'characters' in panel and panel['characters']:
                all_characters.update(panel['characters'])

        # Create consistent descriptions for each character
        for character in all_characters:
            # You can customize these descriptions based on comic theme/tone
            if character.lower() in ['hero', 'protagonist', 'main character']:
                character_descriptions[character] = "a brave heroic character with distinctive clothing and consistent facial features, medium build, confident posture"
            elif character.lower() in ['villain', 'antagonist', 'enemy']:
                character_descriptions[character] = "a menacing villain character with dark clothing and consistent evil facial features, intimidating presence"
            elif character.lower() in ['narrator', 'storyteller']:
                character_descriptions[character] = "an wise narrator figure with consistent appearance and authoritative presence"
            else:
                # Generic character description
                character_descriptions[character] = f"a consistent {character.lower()} character with distinctive features and clothing that remains the same throughout all scenes"

        # Add overall style consistency instruction
        style_instruction = "animated comic book style with consistent character designs, same facial features, clothing, and proportions across all scenes"
        character_descriptions['_STYLE_'] = style_instruction

        logger.info(f"Created character descriptions for: {list(character_descriptions.keys())}")
        return character_descriptions

    def _generate_single_panel_video(self, prompt: str, panel_number: int, comic_id: str) -> Optional[str]:
        """
        Generate a single 8-second video for one panel

        Args:
            prompt: The video generation prompt for this panel
            panel_number: Panel number for logging
            comic_id: Comic ID for locating the panel image

        Returns:
            URL of the generated panel video or None if failed
        """
        try:
            logger.info(f"Generating 8-second video for panel {panel_number}")
            logger.info(f"Prompt for panel {panel_number}: {prompt}")

            # Generate video operation
            operation = self.client.models.generate_videos(
                model=self.model_name,
                image=Image.from_file(location=f"output/comics/{comic_id}/panel_{panel_number}_image.png", mime_type="image/png"),
                prompt=prompt,
                config=GenerateVideosConfig(
                    aspect_ratio=config.video.aspect_ratio,
                    output_gcs_uri=f"gs://{self.gcs_bucket}/videos/{comic_id}/panel_{panel_number}",
                )
            )

            # Wait for this panel's video to complete using recommended pattern
            logger.info(f"Waiting for panel {panel_number} video generation to complete...")

            while not operation.done:
                time.sleep(15)
                operation = self.client.operations.get(operation)
                print(operation)

            # Operation is complete, check response and get the result
            if operation.response:
                try:
                    video_uri = operation.result.generated_videos[0].video.uri
                    logger.info(f"Panel {panel_number} video completed with URI: {video_uri}")
                    return video_uri
                except Exception as e:
                    logger.error(f"Error getting video URI for panel {panel_number}: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    return None
            else:
                logger.error(f"Panel {panel_number} operation completed but no response")
                return None

        except Exception as e:
            logger.error(f"Error generating video for panel {panel_number}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

    def _download_video_to_comic_dir(self, video_uri: str, panel_number: int, comic_id: str) -> Optional[str]:
        """
        Download video file from GCS URI and save directly to comic directory (parallel to script.json)

        Args:
            video_uri: GCS URI of the video
            panel_number: Panel number for naming
            comic_id: Comic ID for directory location

        Returns:
            Local file path of downloaded video or None if failed
        """
        try:
            from pathlib import Path
            import os

            # Create path to comic directory (same directory as script.json)
            # Use os.path.join to avoid path duplication issues
            comic_dir = Path("output") / "comics" / comic_id

            # Ensure we don't have nested paths by resolving the path
            comic_dir = comic_dir.resolve()
            comic_dir.mkdir(parents=True, exist_ok=True)

            # Create video filename
            video_filename = f"panel_{panel_number}_video.mp4"
            video_path = comic_dir / video_filename

            logger.info(f"Downloading video from {video_uri} to {video_path}")
            logger.info(f"Comic directory: {comic_dir}")

            # Convert GCS URI to downloadable URL if needed
            if video_uri.startswith('gs://'):
                # For GCS URIs, we need to use Google Cloud Storage client
                from google.cloud import storage

                # Parse the GCS URI
                uri_parts = video_uri.replace('gs://', '').split('/', 1)
                bucket_name = uri_parts[0]
                blob_name = uri_parts[1] if len(uri_parts) > 1 else ''

                # Download using GCS client
                storage_client = storage.Client()
                bucket = storage_client.bucket(bucket_name)
                blob = bucket.blob(blob_name)

                # Download to local file in comic directory
                blob.download_to_filename(str(video_path))
                logger.info(f"Successfully downloaded video to: {video_path}")
                return str(video_path)
            else:
                # Direct HTTP download
                import requests
                response = requests.get(video_uri, stream=True, timeout=60)
                response.raise_for_status()

                with open(video_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)

                logger.info(f"Successfully downloaded video to: {video_path}")
                return str(video_path)

        except Exception as e:
            logger.error(f"Failed to download video for panel {panel_number}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

    def _join_downloaded_videos(self, video_files: list, comic_id: str) -> Optional[str]:
        """
        Join multiple downloaded panel video files into one final video

        Args:
            video_files: List of local video file paths
            comic_id: Comic ID for output directory

        Returns:
            Path to the final joined video file
        """
        try:
            import subprocess
            from pathlib import Path

            logger.info(f"Joining {len(video_files)} downloaded video files")

            # Get comic directory (same as where script.json is located)
            comic_dir = Path("output") / "comics" / comic_id
            comic_dir = comic_dir.resolve()

            # Create temporary concat file in comic directory
            concat_file = comic_dir / "video_concat_list.txt"
            with open(concat_file, 'w') as f:
                for video_file in video_files:
                    f.write(f"file '{video_file}'\n")

            # Join videos using ffmpeg and save final video in comic directory
            output_file = comic_dir / "final_video.mp4"
            ffmpeg_cmd = [
                "ffmpeg", "-f", "concat", "-safe", "0", 
                "-i", str(concat_file), "-c", "copy", str(output_file), "-y"
            ]

            logger.info(f"Running ffmpeg to join downloaded videos to {output_file}")
            result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)

            if result.returncode == 0:
                # Clean up temporary concat file
                concat_file.unlink(missing_ok=True)
                logger.info(f"Successfully joined all panel videos to {output_file}")
                return str(output_file)
            else:
                logger.error(f"FFmpeg failed: {result.stderr}")
                return None

        except Exception as e:
            logger.error(f"Error joining downloaded videos: {str(e)}")
            return None

    def _join_videos(self, video_urls: list, comic_title: str) -> Optional[str]:
        """
        Join multiple panel videos into one final video

        Args:
            video_urls: List of video URLs to join
            comic_title: Title of the comic for output naming

        Returns:
            URL of the final joined video
        """
        try:
            import tempfile
            import subprocess
            from pathlib import Path

            logger.info(f"Joining {len(video_urls)} videos")

            # Download all videos to temporary files
            temp_files = []
            for i, video_url in enumerate(video_urls):
                # In a real implementation, you would download the video files
                # For now, we'll simulate this process
                temp_file = f"/tmp/panel_{i+1}.mp4"
                temp_files.append(temp_file)
                # TODO: Download video from video_url to temp_file
                logger.info(f"Downloaded panel {i+1} video")

            # Create ffmpeg concat file
            concat_file = "/tmp/concat_list.txt"
            with open(concat_file, 'w') as f:
                for temp_file in temp_files:
                    f.write(f"file '{temp_file}'\n")

            # Join videos using ffmpeg
            output_file = f"/tmp/final_comic_video_{comic_title.replace(' ', '_')}.mp4"
            ffmpeg_cmd = [
                "ffmpeg", "-f", "concat", "-safe", "0", 
                "-i", concat_file, "-c", "copy", output_file, "-y"
            ]

            logger.info("Running ffmpeg to join videos")
            result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)

            if result.returncode == 0:
                # Upload final video to storage and return URL
                # For now, return a placeholder URL
                final_url = f"{self.gcs_bucket}final/{comic_title.replace(' ', '_')}_complete.mp4"
                logger.info("Successfully joined all panel videos")
                return final_url
            else:
                logger.error(f"FFmpeg failed: {result.stderr}")
                return None

        except Exception as e:
            logger.error(f"Error joining videos: {str(e)}")
            return None

    def _create_consistent_panel_video_prompt(self, panel: Dict[str, Any], panel_number: int, comic_title: str, character_descriptions: Dict[str, str]) -> str:
        """
        Create a video generation prompt for a single panel with consistent character descriptions

        Args:
            panel: The panel data
            panel_number: Panel number
            comic_title: Title of the comic
            character_descriptions: Dictionary of character descriptions for consistency

        Returns:
            Formatted prompt for video generation of this panel with consistent characters
        """
        try:
            prompt_parts = []

            # Add panel context
            prompt_parts.append(f"Panel {panel_number} from comic series '{comic_title}' - MAINTAIN CHARACTER CONSISTENCY")

            # Add detailed character descriptions for consistency
            if 'characters' in panel and panel['characters']:
                character_details = []
                for character in panel['characters']:
                    if character in character_descriptions:
                        character_details.append(f"{character}: {character_descriptions[character]}")
                    else:
                        character_details.append(f"{character}: consistent character design matching previous appearances")

                if character_details:
                    prompt_parts.append("Characters (MUST maintain exact same appearance as in previous panels): " + "; ".join(character_details))

            # Add scene description
            if 'scene_description' in panel:
                prompt_parts.append(f"Scene: {panel['scene_description']}")

            # Add dialogue with explicit character-to-speech mapping
            if 'dialogue' in panel and panel['dialogue']:
                dialogue_parts = []
                speaking_instructions = []
                for dialogue in panel['dialogue']:
                    if isinstance(dialogue, dict) and 'text' in dialogue:
                        character = dialogue.get('character', 'Character')
                        text = dialogue['text']
                        dialogue_parts.append(f"{character}: '{text}'")
                        # Add explicit instruction for who should be speaking
                        speaking_instructions.append(f"CRITICAL: The character {character} must be clearly shown speaking the words '{text}' - show {character} with mouth movements, gestures, and body language indicating they are the active speaker for this specific dialogue")

                if dialogue_parts:
                    prompt_parts.append("Dialogue with CHARACTER-TO-SPEECH MAPPING: " + "; ".join(dialogue_parts))
                    prompt_parts.append("SPEAKING INSTRUCTIONS: " + ". ".join(speaking_instructions))

            # Add visual focus if available
            if 'visual_focus' in panel:
                prompt_parts.append(f"Focus on: {panel['visual_focus']}")

            # Create the final prompt with strong emphasis on character consistency
            panel_context = ". ".join(prompt_parts)

            style_instruction = character_descriptions.get('_STYLE_', 'animated comic book style')

            prompt = f"""Create an engaging 8-second animated video for this comic panel: {panel_context}. 

CRITICAL: All characters MUST have the exact same appearance, facial features, clothing, and proportions as they would have in the previous panels of this comic series. Character consistency is absolutely essential.

DIALOGUE REQUIREMENT: If dialogue is present, the EXACT character specified in the dialogue mapping above MUST be shown speaking their assigned lines. Show clear visual indicators of who is speaking:
- Speaking character should have mouth movements matching their dialogue
- Speaking character should have appropriate gestures and body language
- Non-speaking characters should have listening poses/expressions
- Camera should focus appropriately to show the speaker clearly

Style: {style_instruction} with dynamic camera movements and smooth transitions. 
Include vibrant colors, dramatic lighting, expressive character animations, and comic book visual effects.
The video should feel cinematic and capture the specific mood and action of this single panel.
Make it visually stunning with professional animation quality while maintaining perfect character consistency throughout the series.

FINAL REMINDER: Ensure characters look identical to how they appeared in previous panels AND that the correct character speaks the correct dialogue as specified above."""

            return prompt

        except Exception as e:
            logger.error(f"Error creating consistent panel video prompt: {str(e)}")
            return f"Create an 8-second animated comic panel video with consistent character designs and dynamic action."

    def _create_panel_video_prompt(self, panel: Dict[str, Any], panel_number: int, comic_title: str) -> str:
        """
        Legacy method - kept for compatibility but not used in main flow
        """
        return self._create_consistent_panel_video_prompt(panel, panel_number, comic_title, {})

