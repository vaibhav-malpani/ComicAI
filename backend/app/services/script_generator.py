"""
Comic script generation service using Gemini AI
"""

from google import genai
import os
import json
import logging
from typing import Dict, List
from ..core.config import config

logger = logging.getLogger(__name__)


class ScriptGeneratorService:
    """Service for generating comic scripts using Gemini AI"""

    def __init__(self):
        try:
            self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
            self.model = config.gemini.model_name
            logger.info(f"🧠 Script generator initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize script generator: {e}")
            raise

    async def generate_comic_script(self, topic: str, tone: str = "humorous", 
                                  target_audience: str = "general") -> Dict:
        """
        Generate a comic script based on the topic and parameters

        Args:
            topic: The main topic/theme for the comic
            tone: Comic tone (humorous, educational, dramatic, etc.)
            target_audience: Target audience (general, kids, technical, etc.)

        Returns:
            Dictionary containing the complete comic script
        """
        try:
            logger.info(f"📝 Generating script for topic: {topic}")

            prompt = self._build_script_prompt(topic, tone, target_audience)

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": config.gemini.temperature,
                    "max_output_tokens":config.gemini.max_tokens,
                    "response_mime_type":"application/json"
                }
            )

            # Parse the JSON response
            script_data = json.loads(response.text)

            # Validate and enhance character consistency
            script_data = self._validate_character_consistency(script_data)

            logger.info(f"✅ Script generated successfully with {len(script_data.get('panels', []))} panels")
            return script_data

        except Exception as e:
            logger.error(f"❌ Script generation failed: {e}")
            # Return fallback script
            return self._create_fallback_script(topic, tone)

    def _build_script_prompt(self, topic: str, tone: str, target_audience: str) -> str:
        """Build the prompt for comic script generation"""

        examples_prompt = ""
        if config.comic.maintain_consistent_cast:
            char_examples = []
            for char, desc in config.comic.example_characters.items():
                char_examples.append(f"- {char}: {desc}")
            if char_examples:
                examples_prompt = f"""
Character Consistency Examples (use these as reference for consistent character designs):
{chr(10).join(char_examples)}

When creating new characters, provide similarly detailed descriptions for visual consistency.
"""

        consistency_instructions = f"""
CRITICAL CHARACTER CONSISTENCY REQUIREMENTS:
- Characters MUST maintain the exact same appearance across ALL panels
- Once a character is introduced, their physical features, clothing, hair color, facial features, body type, and accessories MUST remain identical in every subsequent panel
- Include detailed character descriptions in the first panel where each character appears
- Reference these descriptions consistently in all following panels
- The character's look should NEVER change between panels - no different clothing, hairstyles, or physical features
- {config.comic.character_consistency_prompt}
"""

        return f"""
Create a {config.comic.panels_per_comic}-panel comic script about: {topic}

Requirements:
- Tone: {tone}
- Target audience: {target_audience}  
- Style: {config.comic.comic_style}
- Each panel should have engaging visuals and clear storytelling

{consistency_instructions}

{examples_prompt}

Return ONLY a valid JSON object with this exact structure:
{{
  "title": "Engaging Comic Title",
  "theme": "Brief theme description",
  "tone": "{tone}",
  "target_audience": "{target_audience}",
  "character_descriptions": {{
    "Character1": "Detailed physical description including hair, eyes, clothing, accessories, body type, etc.",
    "Character2": "Detailed physical description including hair, eyes, clothing, accessories, body type, etc."
  }},
  "panels": [
    {{
      "panel_number": 1,
      "scene_description": "Detailed visual description of what's happening in this panel, ensuring characters match their descriptions",
      "characters": ["Character1", "Character2"],
      "character_appearances": {{
        "Character1": "Brief reminder of key visual features for this panel",
        "Character2": "Brief reminder of key visual features for this panel"
      }},
      "dialogue": [
        {{
          "character": "Character1",
          "text": "What they're saying"
        }}
      ],
      "visual_focus": "What should be the main visual element",
      "art_direction": "Specific visual style notes for this panel, ensuring character consistency"
    }}
  ]
}}

REMEMBER: Character appearances must be IDENTICAL across all panels. No changes in clothing, hair, facial features, or any physical characteristics between panels.
Make it creative, engaging, and appropriate for the {target_audience} audience with a {tone} tone.
"""

    def _create_fallback_script(self, topic: str, tone: str) -> Dict:
        """Create a basic fallback script when generation fails"""
        logger.info("📝 Creating fallback script")

        # Define consistent character appearance
        protagonist_description = "A friendly character with shoulder-length brown hair, bright blue eyes, wearing a casual green t-shirt and dark blue jeans, with white sneakers. Has an enthusiastic and curious expression."

        return {
            "title": f"Comic about {topic}",
            "theme": f"A {tone} story about {topic}",
            "tone": tone,
            "target_audience": "general",
            "character_descriptions": {
                "Protagonist": protagonist_description
            },
            "panels": [
                {
                    "panel_number": 1,
                    "scene_description": f"Introduction to {topic}",
                    "characters": ["Protagonist"],
                    "character_appearances": {
                        "Protagonist": protagonist_description
                    },
                    "dialogue": [{"character": "Protagonist", "text": f"Let me tell you about {topic}!"}],
                    "visual_focus": "Character introduction",
                    "art_direction": f"{config.comic.comic_style}, clear character introduction, {protagonist_description}"
                },
                {
                    "panel_number": 2,
                    "scene_description": f"Exploring the world of {topic}",
                    "characters": ["Protagonist"],
                    "character_appearances": {
                        "Protagonist": protagonist_description
                    },
                    "dialogue": [{"character": "Protagonist", "text": "This is fascinating!"}],
                    "visual_focus": "World building",
                    "art_direction": f"{config.comic.comic_style}, detailed background, {protagonist_description}"
                },
                {
                    "panel_number": 3,
                    "scene_description": f"Discovering something interesting about {topic}",
                    "characters": ["Protagonist"],
                    "character_appearances": {
                        "Protagonist": protagonist_description
                    },
                    "dialogue": [{"character": "Protagonist", "text": "I never knew this!"}],
                    "visual_focus": "Discovery moment",
                    "art_direction": f"{config.comic.comic_style}, moment of realization, {protagonist_description}"
                },
                {
                    "panel_number": 4,
                    "scene_description": f"Conclusion about {topic}",
                    "characters": ["Protagonist"],
                    "character_appearances": {
                        "Protagonist": protagonist_description
                    },
                    "dialogue": [{"character": "Protagonist", "text": "What an adventure!"}],
                    "visual_focus": "Happy conclusion",
                    "art_direction": f"{config.comic.comic_style}, satisfying ending, {protagonist_description}"
                }
            ]
        }

    def _validate_character_consistency(self, script_data: Dict) -> Dict:
        """
        Validate and enhance character consistency in the generated script

        Args:
            script_data: The generated script data

        Returns:
            Enhanced script with improved character consistency
        """
        try:
            # Ensure character_descriptions exist
            if 'character_descriptions' not in script_data:
                script_data['character_descriptions'] = {}

            # Extract all unique characters from panels
            all_characters = set()
            for panel in script_data.get('panels', []):
                all_characters.update(panel.get('characters', []))

            # Ensure each character has a description
            for character in all_characters:
                if character not in script_data['character_descriptions']:
                    # Generate a basic description if missing
                    script_data['character_descriptions'][character] = f"Character with consistent appearance throughout the comic"

            # Add character_appearances to each panel if missing
            for panel in script_data.get('panels', []):
                if 'character_appearances' not in panel:
                    panel['character_appearances'] = {}

                # Ensure each character in the panel has appearance notes
                for character in panel.get('characters', []):
                    if character not in panel['character_appearances']:
                        panel['character_appearances'][character] = script_data['character_descriptions'].get(
                            character, "Consistent character appearance"
                        )

                    # Enhance art_direction with character consistency reminders
                    if 'art_direction' in panel:
                        consistency_note = f", maintain exact character appearances: {character} - {script_data['character_descriptions'].get(character, 'consistent design')}"
                        if "maintain exact character appearances" not in panel['art_direction']:
                            panel['art_direction'] += consistency_note

            logger.info("✅ Character consistency validation completed")
            return script_data

        except Exception as e:
            logger.error(f"❌ Character consistency validation failed: {e}")
            return script_data
