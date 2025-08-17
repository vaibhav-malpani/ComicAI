"""
Comic artwork generation service using Imagen AI
"""

from google import genai
import os
from typing import List, Dict, Optional
import io
from PIL import Image, ImageDraw, ImageFont
import logging

from pympler import panels

from ..core.config import config
import base64

logger = logging.getLogger(__name__)


class ArtworkGeneratorService:
    """Service for generating comic artwork using Imagen AI"""

    def __init__(self):
        try:
            # Initialize the client for image generation
            self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

            # Use the specific Imagen 4 model from config
            self.image_model = config.imagen.model_name
            self.use_imagen = True

            logger.info(f"🎯 Artwork generator initialized with model: {self.image_model}")

        except Exception as e:
            logger.error(f"Failed to initialize artwork generator: {e}")
            self.use_imagen = False
            self.image_model = None

    async def generate_panel_artwork(self, panel: Dict, style_prompt: str = "") -> bytes:
        """
        Generate artwork for a single comic panel

        Args:
            panel: Panel dictionary with scene description and art direction
            style_prompt: Additional style specifications

        Returns:
            Image bytes for the generated panel
        """
        try:
            logger.info(f"🎨 Generating artwork for panel {panel.get('panel_number', '?')}")

            prompt = self._build_image_prompt(panel, style_prompt)

            if self.use_imagen:
                return await self._generate_with_imagen(prompt)
            else:
                return self._create_visual_comic_panel(panel, prompt)

        except Exception as e:
            logger.error(f"❌ Failed to generate panel artwork: {e}")
            logger.error(f"   Panel type: {type(panel)}")
            logger.error(f"   Panel data: {str(panel)[:200] if panel else 'None'}")

            # Create safe fallback panel
            safe_panel = {
                "panel_number": 1,
                "scene_description": "Comic panel",
                "characters": ["Character"],
                "dialogue": [],
                "visual_focus": "Scene"
            }
            return self._create_visual_comic_panel(safe_panel, "fallback comic panel")

    async def generate_complete_comic(self, panels: List[Dict],
                                    style_theme: str = "modern digital comic",
                                    comic_id: str = None) -> bytes:
        """
        Generate complete comic with all panels

        Args:
            panels: List of panel dictionaries
            style_theme: Overall visual style theme
            comic_id: Comic ID for saving individual panel images

        Returns:
            Complete comic image as bytes
        """
        panel_images = []

        for i, panel in enumerate(panels):
            try:
                # Validate panel is a dictionary
                if not isinstance(panel, dict):
                    logger.error(f"Panel {i+1} is not a dictionary: {type(panel)} - {panel}")
                    # Create a basic panel structure
                    panel = {
                        "panel_number": i+1,
                        "scene_description": f"Panel {i+1} content",
                        "characters": ["Character"],
                        "dialogue": [{"character": "Character", "text": "Panel content"}],
                        "visual_focus": "Main scene"
                    }

                logger.info(f"🎨 Processing panel {i+1}: {panel.get('scene_description', 'No description')[:50]}")

                panel_bytes = await self.generate_panel_artwork(panel, style_theme)
                panel_image = Image.open(io.BytesIO(panel_bytes))
                panel_images.append(panel_image)

                # Save individual panel image if comic_id is provided
                if comic_id:
                    self._save_panel_image(panel_bytes, i+1, comic_id)
                    logger.info(f"Attempting to save panel {i+1} image with comic_id: {comic_id}")

                logger.info(f"✅ Panel {i+1}/{len(panels)} completed")
            except Exception as e:
                logger.error(f"❌ Failed to generate panel {i+1}: {e}")
                # Create fallback panel with safe data
                safe_panel = {
                    "panel_number": i+1,
                    "scene_description": f"Panel {i+1}",
                    "characters": ["Character"],
                    "dialogue": [],
                    "visual_focus": "Scene"
                }
                try:
                    fallback_bytes = self._create_visual_comic_panel(safe_panel, "fallback")
                    fallback_image = Image.open(io.BytesIO(fallback_bytes))
                    panel_images.append(fallback_image)
                except Exception as e2:
                    logger.error(f"❌ Even fallback failed for panel {i+1}: {e2}")
                    # Create minimal placeholder
                    placeholder_image = self._create_minimal_placeholder(i+1)
                    panel_images.append(placeholder_image)

        # Combine panels into final comic
        comic_image = self._combine_panels(panel_images)

        output = io.BytesIO()
        comic_image.save(output, format=config.comic.output_format, quality=95)
        output.seek(0)

        logger.info(f"Complete comic generated with {len(panels)} panels")
        return output.getvalue()

    async def _generate_with_imagen(self, prompt: str) -> bytes:
        """Generate image using Imagen 4 model"""
        if not self.image_model:
            raise ValueError("No image model configured")

        try:
            logger.info(f"🎨 Generating image with {self.image_model}")
            logger.info(f"   Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")

            # Use Imagen 4 API pattern
            response = self.client.models.generate_images(
                model=self.image_model,
                prompt=prompt,
                config={
                    "number_of_images": 1,
                    "aspect_ratio": "1:1"
                }
            )

            logger.info(f"   📥 Response received from {self.image_model}")

            # Process response
            img = None

            if hasattr(response, 'images') and response.images:
                img_data = response.images[0]

                if hasattr(img_data, '_pil_image'):
                    img = img_data._pil_image
                elif hasattr(img_data, 'data'):
                    try:
                        if isinstance(img_data.data, str):
                            img = Image.open(io.BytesIO(base64.b64decode(img_data.data)))
                        else:
                            img = Image.open(io.BytesIO(img_data.data))
                    except Exception as e:
                        logger.warning(f"Failed to process image data: {e}")

            if img:
                # Ensure RGB mode
                if img.mode != 'RGB':
                    img = img.convert('RGB')

                # Standardize size
                if img.size != (1024, 1024):
                    img = img.resize((1024, 1024), Image.Resampling.LANCZOS)

                # Convert to bytes
                img_bytes = io.BytesIO()
                img.save(img_bytes, format='PNG', quality=95)
                img_bytes.seek(0)

                logger.info(f"🎉 SUCCESS! Image generated with {self.image_model}")
                logger.info(f"   📐 Final image size: {img.size}")
                logger.info(f"   💾 Image bytes size: {len(img_bytes.getvalue())} bytes")
                return img_bytes.getvalue()

            raise ValueError(f"No usable image data from {self.image_model}")

        except Exception as e:
            logger.error(f"❌ Image generation failed with {self.image_model}: {e}")
            raise

    def _save_panel_image(self, panel_bytes: bytes, panel_number: int, comic_id: str) -> None:
        """
        Save individual panel image to comic directory

        Args:
            panel_bytes: Panel image bytes
            panel_number: Panel number for filename
            comic_id: Comic ID for directory location
        """
        try:
            from pathlib import Path

            logger.info(f"Saving panel {panel_number} image for comic_id: {comic_id}")
            logger.info(f"Panel bytes length: {len(panel_bytes) if panel_bytes else 0}")

            # Create path to comic directory (same directory as script.json)
            comic_dir = Path("output") / "comics" / comic_id
            comic_dir = comic_dir.resolve()
            comic_dir.mkdir(parents=True, exist_ok=True)

            logger.info(f"Comic directory: {comic_dir}")

            # Save panel image
            panel_filename = f"panel_{panel_number}_image.png"
            panel_path = comic_dir / panel_filename

            logger.info(f"Saving to path: {panel_path}")

            with open(panel_path, 'wb') as f:
                f.write(panel_bytes)

            logger.info(f"✅ Successfully saved panel {panel_number} image to: {panel_path}")

        except Exception as e:
            logger.error(f"❌ Failed to save panel {panel_number} image: {str(e)}")
            import traceback
            traceback.print_exc()

    def _create_visual_comic_panel(self, panel: Dict, prompt: str) -> bytes:
        """Create a visually appealing comic panel with text and graphics"""
        img = Image.new('RGB', (1024, 1024), '#f0f8ff')
        draw = ImageDraw.Draw(img)

        # Add comic border
        border_color = '#2c3e50'
        border_width = 12
        draw.rectangle([0, 0, 1024, 1024], outline=border_color, width=border_width)

        # Add inner content area
        inner_margin = 30
        content_area = [inner_margin, inner_margin, 1024-inner_margin, 1024-inner_margin]

        # Add gradient background
        self._add_gradient_background(img, draw, content_area)

        # Add comic elements
        self._add_comic_content(draw, panel, content_area)

        # Convert to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG', quality=95)
        img_bytes.seek(0)

        logger.info("Visual comic panel created")
        return img_bytes.getvalue()

    def _add_gradient_background(self, img: Image.Image, draw: ImageDraw.Draw, area: List[int]):
        """Add gradient background"""
        x1, y1, x2, y2 = area
        colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6']

        height = y2 - y1
        for i in range(height):
            color_idx = min(int(i / height * len(colors)), len(colors) - 1)
            y = y1 + i
            draw.line([(x1, y), (x2, y)], fill=colors[color_idx])

    def _add_comic_content(self, draw: ImageDraw.Draw, panel: Dict, area: List[int]):
        """Add comic content to the panel"""
        x1, y1, x2, y2 = area

        try:
            # Load fonts
            try:
                title_font = ImageFont.truetype("arial.ttf", 32)
                text_font = ImageFont.truetype("arial.ttf", 20)
            except:
                title_font = ImageFont.load_default()
                text_font = ImageFont.load_default()

            # Panel title
            panel_num = panel.get('panel_number', '?')
            title = f"Panel {panel_num}"
            draw.text((x1 + 20, y1 + 20), title, fill='#1a237e', font=title_font)

            # Scene description
            scene = panel.get('scene_description', 'Comic panel scene')
            if len(scene) > 80:
                scene = scene[:80] + "..."

            # Wrap and draw scene text
            words = scene.split()
            lines = []
            current_line = []

            for word in words:
                test_line = ' '.join(current_line + [word])
                if len(test_line) < 40:  # Simple character-based wrapping
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]

            if current_line:
                lines.append(' '.join(current_line))

            y_offset = y1 + 80
            for line in lines[:5]:  # Max 5 lines
                draw.text((x1 + 20, y_offset), line, fill='#37474f', font=text_font)
                y_offset += 25

            # Add speech bubble with dialogue
            dialogue = panel.get('dialogue', [])
            if dialogue:
                bubble_y = y_offset + 40
                bubble_area = [x1 + 50, bubble_y, x2 - 50, bubble_y + 120]

                # Draw speech bubble
                draw.ellipse(bubble_area, fill='white', outline='#455a64', width=3)

                # Add dialogue text
                if dialogue[0].get('text'):
                    dialogue_text = dialogue[0]['text'][:60]  # Limit length
                    char_name = dialogue[0].get('character', 'Character')

                    draw.text((x1 + 70, bubble_y + 20), char_name + ":", fill='#1565c0', font=text_font)
                    draw.text((x1 + 70, bubble_y + 45), dialogue_text, fill='#424242', font=text_font)

            # Visual focus at bottom
            focus = panel.get('visual_focus', '')
            if focus:
                focus_text = f"Focus: {focus[:50]}..."
                draw.text((x1 + 20, y2 - 40), focus_text, fill='#78909c', font=text_font)

        except Exception as e:
            logger.warning(f"Error adding comic content: {e}")
            # Add basic fallback text
            draw.text((x1 + 50, y1 + 100), "Comic Panel Content", fill='#333333', font=ImageFont.load_default())

    def _build_image_prompt(self, panel: Dict, style_prompt: str) -> str:
        """Build specific image prompt based on script content"""
        try:
            # Validate input
            if not isinstance(panel, dict):
                logger.error(f"❌ Panel is not a dict: {type(panel)} - {str(panel)[:100]}")
                return f"Comic book panel, {config.comic.comic_style}, professional illustration"

            scene = panel.get('scene_description', 'comic scene')
            characters = panel.get('characters', [])
            visual_focus = panel.get('visual_focus', 'main content')
            dialogue = panel.get('dialogue', [])
            art_direction = panel.get('art_direction', '')
            panel_num = panel.get('panel_number', 1)

            logger.info(f"🎨 Building prompt for panel {panel_num}")
            logger.info(f"   Scene: {scene[:50]}")
            logger.info(f"   Characters: {characters}")

            # Extract key content from dialogue safely
            dialogue_context = ""
            if dialogue and isinstance(dialogue, list):
                dialogue_texts = []
                for d in dialogue:
                    if isinstance(d, dict):
                        dialogue_texts.append(d.get('text', ''))
                    else:
                        logger.warning(f"Dialogue item is not dict: {type(d)}")
                if dialogue_texts:
                    dialogue_context = f"showing conversation about: {' '.join(dialogue_texts)[:100]}"

            # Build character consistency descriptions
            character_descriptions = []
            if config.comic.maintain_consistent_cast and characters:
                for character in characters:
                    # Look for character in example definitions (case-insensitive)
                    char_key = character.lower().strip()
                    for example_key, description in config.comic.example_characters.items():
                        if example_key.lower() in char_key or char_key in example_key.lower():
                            character_descriptions.append(f"{character}: {description}")
                            break

            # Build very specific prompt
            prompt_parts = [
                f"Comic book panel showing: {scene}",
                f"Characters: {', '.join(characters)}" if characters else "",
                dialogue_context,
                f"Main visual element: {visual_focus}" if visual_focus else "",
                art_direction if art_direction else "",
            ]

            # Add character consistency descriptions
            if character_descriptions:
                prompt_parts.append("Character details: " + " | ".join(character_descriptions))

            # Add character consistency prompt if enabled
            if config.comic.maintain_consistent_cast:
                prompt_parts.append(config.comic.character_consistency_prompt)

            prompt_parts.extend([
                f"{config.comic.comic_style}",
                "professional comic book illustration, clear and specific content"
            ])

            # Clean and combine
            prompt = '. '.join([part.strip() for part in prompt_parts if part.strip()])

            logger.info(f"🎨 Final prompt for panel {panel_num}: {prompt[:150]}...")
            return prompt[:1200]  # Increased limit to accommodate character descriptions

        except Exception as e:
            logger.error(f"❌ Error building image prompt: {e}")
            logger.error(f"   Panel data: {str(panel)[:200]}")
            # Return safe fallback prompt
            return f"Comic book panel, {config.comic.comic_style}, professional comic book illustration"

    def _combine_panels(self, panel_images: List[Image.Image]) -> Image.Image:
        """Combine panels into 2x2 comic layout"""
        if not panel_images:
            raise ValueError("No panels to combine")

        panel_size = 1024
        margin = 15

        # Create 2x2 grid
        comic_width = (panel_size * 2) + (margin * 3)
        comic_height = (panel_size * 2) + (margin * 3)

        comic = Image.new('RGB', (comic_width, comic_height), 'white')

        positions = [
            (margin, margin),                           # Top-left
            (margin + panel_size + margin, margin),     # Top-right
            (margin, margin + panel_size + margin),     # Bottom-left
            (margin + panel_size + margin, margin + panel_size + margin)  # Bottom-right
        ]

        for i, panel in enumerate(panel_images[:4]):
            if i < len(positions):
                comic.paste(panel, positions[i])

        return comic

    def _create_minimal_placeholder(self, panel_num: int) -> Image.Image:
        """Create minimal placeholder when everything else fails"""
        img = Image.new('RGB', (1024, 1024), '#f0f0f0')
        draw = ImageDraw.Draw(img)

        # Add simple border
        draw.rectangle([10, 10, 1014, 1014], outline='#333333', width=5)

        # Add panel number
        try:
            font = ImageFont.load_default()
            text = f"Panel {panel_num}"
            bbox = draw.textbbox((0, 0), text, font=font)
            x = (1024 - (bbox[2] - bbox[0])) // 2
            y = (1024 - (bbox[3] - bbox[1])) // 2
            draw.text((x, y), text, fill='#333333', font=font)
        except Exception:
            pass

        logger.info(f"Created minimal placeholder for panel {panel_num}")
        return img
