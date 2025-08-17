"""
Application configuration management
"""

import os
from dataclasses import dataclass
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


@dataclass
class GeminiConfig:
    """Configuration for Gemini API script generation"""
    api_key: str
    model_name: str = "gemini-2.5-flash"
    temperature: float = 0.7
    max_tokens: int = 10000


@dataclass
class ImagenConfig:
    """Configuration for Imagen 4 artwork generation"""
    project_id: str
    location: str = "us-central1"
    model_name: str = "imagen-4.0-generate-preview-06-06"  # Primary Imagen 4 model
    fallback_model: str = "imagen-3.0-generate-002"  # Stable fallback
    image_size: str = "1024x1024"
    aspect_ratio: str = "1:1"  # Square panels work best for comics
    guidance_scale: int = 100  # Imagen 4 guidance scale (0-100)


@dataclass
class ComicConfig:
    """Configuration for comic generation settings"""
    panels_per_comic: int = 4
    comic_style: str = "modern digital comic art"
    font_family: str = "Comic Sans MS"
    font_size: int = 12
    speech_bubble_style: str = "rounded"
    output_format: str = "PNG"

    # Character consistency settings
    maintain_consistent_cast: bool = True
    character_consistency_prompt: str = "Keep the same character appearances, facial features, clothing, and visual style throughout all panels."

    # Example character definitions for consistent casting
    example_characters: Dict[str, str] = None

    def __post_init__(self):
        """Initialize example characters if not provided"""
        if self.example_characters is None:
            self.example_characters = {
                "Hero": "Named Lukas, A young adventurer with short brown hair, green eyes, wearing a blue tunic and brown leather boots. Always has a determined expression and carries a wooden staff.",
                "Mentor": "Named Merlin, An elderly wizard with long white beard, wise eyes, purple robes with star patterns, and a tall pointed hat. Walks with a gnarled wooden staff.",
                "companion": "Named pip, A small, fluffy golden-brown hamster with bright black eyes, chubby cheeks often stuffed with food, and tiny pink paws. Wears a tiny blue vest with silver buttons and often perches on the hero's shoulder or rides in their shirt pocket.",
                "Villan": "Named Crimsonscythe, A tall figure in dark crimson armor with burning yellow eyes visible through the helmet visor. Black cape and carries a massive curved scythe wreathed in hellfire.",
                "Shopkeeper": "Named Martha, A plump, cheerful merchant with curly gray hair, rosy cheeks, wearing a green apron over brown clothes. Always smiling and welcoming."
            }


class AppConfig:
    """Main application configuration"""

    def __init__(self):
        self.gemini = GeminiConfig(
            api_key=os.getenv("GEMINI_API_KEY", ""),
        )

        self.imagen = ImagenConfig(
            project_id=os.getenv("GOOGLE_CLOUD_PROJECT", ""),
        )

        self.comic = ComicConfig()

        # Validate required environment variables
        self._validate_config()

    def _validate_config(self):
        """Validate that required configuration is present"""
        if not self.gemini.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        if not self.imagen.project_id:
            raise ValueError("GOOGLE_CLOUD_PROJECT environment variable is required")


# Global configuration instance
config = AppConfig()
