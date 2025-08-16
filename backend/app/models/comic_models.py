"""
Comic data models and schemas
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ComicDialogue:
    """Represents dialogue in a comic panel"""
    character: str
    text: str


@dataclass
class ComicPanel:
    """Represents a single comic panel"""
    panel_number: int
    scene_description: str
    characters: List[str]
    dialogue: List[ComicDialogue]
    visual_focus: str
    art_direction: Optional[str] = None


@dataclass
class ComicScript:
    """Represents a complete comic script"""
    title: str
    theme: str
    tone: str
    target_audience: str
    panels: List[ComicPanel]


@dataclass
class ComicMetadata:
    """Represents comic metadata and file information"""
    comic_id: str
    title: str
    theme: str
    generated_at: str
    panel_count: int
    generation_params: Dict[str, Any]
    files: Dict[str, str]  # Contains paths to script and image files
    processing_time_seconds: Optional[float] = None
    generation_started_at: Optional[str] = None
    generation_completed_at: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ComicMetadata':
        """Create ComicMetadata from dictionary"""
        return cls(
            comic_id=data['comic_id'],
            title=data['title'],
            theme=data['theme'],
            generated_at=data['generated_at'],
            panel_count=data['panel_count'],
            generation_params=data['generation_params'],
            files=data['files'],
            processing_time_seconds=data.get('processing_time_seconds'),
            generation_started_at=data.get('generation_started_at'),
            generation_completed_at=data.get('generation_completed_at')
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert ComicMetadata to dictionary"""
        return {
            'comic_id': self.comic_id,
            'title': self.title,
            'theme': self.theme,
            'generated_at': self.generated_at,
            'panel_count': self.panel_count,
            'generation_params': self.generation_params,
            'files': self.files,
            'processing_time_seconds': self.processing_time_seconds,
            'generation_started_at': self.generation_started_at,
            'generation_completed_at': self.generation_completed_at
        }
