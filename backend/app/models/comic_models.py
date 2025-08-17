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
    video_url: Optional[str] = None
    video_status: Optional[str] = None  # 'generating', 'completed', 'failed'
    video_generated_at: Optional[str] = None
    video_processing_time_seconds: Optional[float] = None
    panel_video_uris: Optional[List[str]] = None  # Array of panel video URIs
    panel_image_paths: Optional[List[str]] = None  # Array of individual panel image paths

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
            generation_completed_at=data.get('generation_completed_at'),
            video_url=data.get('video_url'),
            video_status=data.get('video_status'),
            video_generated_at=data.get('video_generated_at'),
            video_processing_time_seconds=data.get('video_processing_time_seconds'),
            panel_video_uris=data.get('panel_video_uris'),
            panel_image_paths=data.get('panel_image_paths')
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
            'generation_completed_at': self.generation_completed_at,
            'video_url': self.video_url,
            'video_status': self.video_status,
            'video_generated_at': self.video_generated_at,
            'video_processing_time_seconds': self.video_processing_time_seconds,
            'panel_video_uris': self.panel_video_uris,
            'panel_image_paths': self.panel_image_paths
        }
