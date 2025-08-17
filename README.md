# Comics Generator

A full-stack web application that automatically generates comic strips using Google's Gemini AI for storytelling and Imagen for visual creation. Transform any topic into engaging visual comics with customizable tones and styles through an intuitive web interface.

# Examples

Explore the incredible range of comics you can create with ComicsAI! From educational content to hilarious adventures, each example showcases different tones, audiences, and creative possibilities.

## 📚 Educational Comics

### "How Astronauts Live on the International Space Station"
**Tone:** Educational | **Audience:** General
![Astronaut Life Comic](backend/output/comics/how_astronauts_live_on_the_int_educational_20250816_120958/comic.png)

Transform complex space science into digestible visual learning! This educational comic breaks down life in zero gravity, showing daily routines, eating habits, and scientific work aboard the ISS. Perfect for classrooms or curious minds of all ages.

## 🌟 Inspirational Comics

### "Seasonal Migration Patterns of Birds"
**Tone:** Inspirational | **Audience:** General
![Bird Migration Comic](backend/output/comics/seasonal_migration_patterns_of_inspirational_20250816_130215/comic.png)

Nature's most incredible journey told through inspiring visuals! This comic transforms scientific facts about bird migration into an uplifting story about perseverance, navigation, and the wonders of the natural world.

## 🎬 Video Generation Comics

### "The Journey to Discover One's Power" - The Unfolding Bloom
**Tone:** Inspirational | **Audience:** General | **🆕 Now with Video!**
![Self-Discovery Comic](backend/output/comics/the_journey_to_discover_ones_p_inspirational_20250817_204810/comic.png)

**🎥 Watch the Video:**

[![Watch The Unfolding Bloom Video](https://img.shields.io/badge/▶️-Watch%20Video-red?style=for-the-badge)](https://github.com/vaibhav-malpani/ComicAI/raw/main/backend/output/comics/the_journey_to_discover_ones_p_inspirational_20250817_204810/final_video.mp4)

*Click the button above to download and watch the video (MP4 format)*


Experience the power of AI-generated video storytelling! This groundbreaking example showcases our new video generation feature, transforming a static comic about self-discovery into a dynamic, animated experience. Watch as Elara discovers her inner power through beautifully animated panels that bring the story to life with smooth transitions, character consistency, and cinematic flow.

**Video Features Demonstrated:**
- **🎭 Character Consistency**: Elara maintains her appearance across all animated panels
- **⚡ Dynamic Animation**: Static panels transform into flowing video sequences
- **🎬 Cinematic Composition**: Professional video editing with seamless panel transitions  
- **⏱️ Processing Metrics**: Generated in ~7 minutes (68s comic + 402s video)
- **☁️ Cloud Integration**: Seamlessly managed through Google Cloud Storage

## 💡 What Makes These Examples Special?

### 🎯 **Diverse Topics**
From robotics to space exploration, cosmic entities to environmental heroes - these examples showcase the unlimited creative potential of your imagination combined with AI.

### 🎭 **Tone Mastery**
Each comic perfectly captures its intended tone:
- **Humorous**: Light-hearted, accessible, and entertaining
- **Educational**: Informative yet engaging, perfect for learning
- **Inspirational**: Uplifting and motivational storytelling

### 🎨 **Visual Excellence**
Notice how each comic features:
- **Consistent art style** throughout panels
- **Clear, readable dialogue** integrated seamlessly
- **Expressive characters** that convey emotion
- **Dynamic compositions** that guide the reader's eye

### 📖 **Story Structure**
Every example demonstrates solid comic storytelling:
- **Setup**: Introducing characters and concepts
- **Development**: Building the narrative or educational content  
- **Payoff**: Satisfying conclusion with humor, learning, or inspiration

## 🚀 Try These Prompts Next!

Inspired by these examples? Here are some prompt ideas to get you started:

### Educational Series
- "How photosynthesis works, explained by talking trees"
- "The journey of a plastic bottle through recycling"
- "Ancient Roman engineering marvels in modern times"

### Humorous Adventures  
- "A vampire trying to use modern dating apps"
- "Office supplies come to life during a late-night work session"
- "A time traveler gets confused by modern technology"

### Inspirational Stories
- "A young artist overcoming creative block"
- "The story of how small actions can change the world"
- "Learning to embrace failure as a stepping stone to success"

## 🎪 Mix and Match

The real magic happens when you experiment with different combinations:
- **Educational + Humorous**: "Quantum physics explained by confused cats"
- **Inspirational + Technical**: "A coding bootcamp graduate's journey to their first job"
- **Dramatic + Educational**: "The race to develop vaccines during a pandemic"

Remember: every example started with a simple idea and a click of the "Generate Comic" button. Your next masterpiece is just a prompt away!

## 🚀 Tech Stack

### Backend
- **Python 3.11+** - Core programming language
- **FastAPI** - Modern async web framework and REST API
- **Uvicorn** - ASGI server for FastAPI
- **Google Gemini AI** - Story and dialogue generation
- **Google Imagen** - Comic artwork generation
- **Google Veo 3** - AI-powered video generation from comic panels
- **OpenCV & Pillow** - Image processing and video composition
- **Google Cloud Storage** - Dynamic bucket management for video assets
- **asyncio** - Asynchronous processing for better performance

### Frontend
- **React 18.2.0** - Modern UI framework
- **Vite 5.0.0** - Fast build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first styling
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications
- **Lucide React** - Icon library

## 📋 Prerequisites

Before getting started, make sure you have:

1. **Python 3.11 or higher** installed on your system
2. **FFmpeg** - Required for video processing and generation
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html#build-windows) or install via [Chocolatey](https://chocolatey.org/): `choco install ffmpeg`
   - **macOS**: Install via [Homebrew](https://brew.sh/): `brew install ffmpeg`
   - **Linux (Ubuntu/Debian)**: `sudo apt update && sudo apt install ffmpeg`
   - **Linux (CentOS/RHEL)**: `sudo yum install ffmpeg` or `sudo dnf install ffmpeg`
3. **Google Cloud Project** with billing enabled
4. **Google Cloud credentials** with access to:
   - Gemini API
   - Vertex AI (for Imagen)
   - Veo 3 API (for video generation)
   - Google Cloud Storage (for video asset management)
5. **Git** for cloning the repository

## 🛠️ Installation

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ComicAI
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

4. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

5. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

6. **Return to project root:**
   ```bash
   cd ..
   ```

## ⚙️ Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your API credentials in `.env`:**
   ```env
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Google Cloud Project Configuration
   GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id

   # Storage Configuration (Optional)
   GCS_BUCKET_NAME=your_custom_bucket_name  # Auto-generated if not specified

   # Optional: Logging level
   LOG_LEVEL=INFO
   ```

3. **Get your API keys:**
   - **Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **Google Cloud Project**: Create a project at [Google Cloud Console](https://console.cloud.google.com/)

4. **Set up Google Cloud authentication:**
   ```bash
   gcloud auth application-default login
   ```

## 💰 API Costs & Quotas

**Important**: Video generation uses Google's premium AI services. Be aware of costs:

> **⚠️ Pricing Disclaimer**: The costs and quotas mentioned below are estimates and may change frequently. For the most current and accurate pricing information, always refer to the official [Google Cloud Pricing](https://cloud.google.com/pricing) page and your specific service documentation:
> - [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
> - [Gemini API Pricing](https://ai.google.dev/pricing)
> - [Cloud Storage Pricing](https://cloud.google.com/storage/pricing)

### Estimated Costs Per Generation
- **Comic Generation**: ~$0.10-0.30 per comic (Gemini + Imagen)
- **Video Generation**: ~$2.00-8.00 per video (Veo 3 pricing varies by duration/quality)
- **Storage**: ~$0.02-0.10 per GB/month (Google Cloud Storage)

### Quota Considerations
- **Veo 3**: Limited requests per minute/day (varies by project tier)
- **Imagen**: 100 requests per day (free tier), higher limits for paid accounts
- **Gemini**: 60 requests per minute (free tier)

**Recommendations**:
- Start with comic generation to test functionality before enabling video
- Monitor usage in [Google Cloud Console](https://console.cloud.google.com/billing)
- Set up billing alerts to avoid unexpected charges
- Consider batch processing for multiple videos

## ✨ Features

- **Web-Based Interface** - Intuitive React-powered web application
- **AI-Powered Storytelling** - Generate engaging comic scripts with Gemini AI
- **Visual Comic Generation** - Create stunning comic artwork with Google Imagen
- **Video Generation** - Transform static comics into dynamic videos using Google Veo 3
- **Character Consistency** - Advanced validation ensures characters maintain appearance across panels
- **Multiple Tones** - Support for humorous, educational, dramatic, and inspirational content
- **Audience Targeting** - Customize content for different audiences (general, technical, kids, academic)
- **Real-time Generation** - Watch your comics and videos come to life with live progress updates
- **Panel-to-Video Conversion** - Individual panel videos with seamless final compilation
- **Video Playback & Controls** - In-browser video player with download capabilities
- **Customizable Styles** - Various visual art styles available through web interface
- **Enhanced Gallery View** - Browse comics and videos with search, filters, and sharing options
- **Generation Statistics** - Track processing times and performance metrics
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Export & Download** - Save comics in multiple image formats and videos in MP4
- **Cloud Storage Integration** - Dynamic GCS bucket management for scalable video storage

## 💻 System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Python**: 3.11 or higher
- **Node.js**: 16+ (for frontend development)
- **Memory**: Minimum 8GB RAM (16GB+ recommended for video generation)
- **Storage**: 5GB+ free space for comic and video outputs
- **Network**: Stable high-speed internet connection for AI API calls and video processing
- **Browser**: Modern web browser (Chrome 90+, Firefox 88+, Safari 14+) with HTML5 video support
- **GPU**: Optional but recommended for faster local video processing

## 🚀 Running the Application

### Start the Backend Server

1. **Activate your virtual environment:**
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Start the Frontend Development Server

3. **In a new terminal, navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

4. **Start the React development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## 🎨 Using the Web Interface

### Creating Your First Comic

1. **Enter a Topic:** Type any subject you want to create a comic about in the main input field
2. **Choose Settings:** Select your preferred tone (humorous, educational, dramatic, inspirational) and target audience
3. **Customize Style:** Optionally specify a visual style for your comic artwork
4. **Generate Comic:** Click the "Generate Comic" button and watch the AI create your comic in real-time
5. **Generate Video (Optional):** Once your comic is ready, click "Generate Video" to transform it into an animated video
6. **View Results:** Your completed comic and video will appear with options to download, share, or view in the enhanced gallery

### Video Generation Features

- **Panel-by-Panel Animation:** Each comic panel becomes a dynamic video segment
- **Seamless Compilation:** Individual panel videos are automatically merged into a final cinematic experience
- **Character Consistency:** Advanced AI ensures characters maintain their appearance across video frames
- **Real-time Progress:** Watch video generation progress with detailed status updates
- **Video Statistics:** View processing times and generation metrics
- **In-browser Playback:** Watch your video creations directly in the web interface

### Example Topics to Try

- **Educational:** "How photosynthesis works in plants"
- **Humorous:** "A cat trying to use a computer mouse"
- **Dramatic:** "A firefighter rescuing a kitten from a tree"
- **Inspirational:** "Learning to overcome stage fright"
- **Technical:** "Understanding how WiFi signals travel"

### Tips for Best Results

- **Be Specific:** More detailed topics generally produce better comics
- **Consider Your Audience:** Choose the appropriate audience setting for better content targeting  
- **Experiment with Styles:** Try different visual styles like "watercolor", "manga", or "pixel art"
- **Use the Gallery:** Browse your previously generated comics in the gallery section

### Video Specifications & Formats

#### Generated Video Details
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1024x1024 pixels (optimized for social media)
- **Frame Rate**: 24 FPS
- **Duration**: 15-30 seconds (varies by panel count)
- **Audio**: Currently not supported (visual-only)
- **File Size**: Typically 10-30MB per video

#### Supported Export Formats
- **Video**: MP4 (default)
- **Individual Panels**: PNG, JPEG
- **Comic Strip**: PNG (high resolution)

#### Video Generation Best Practices
- **Panel Count**: 4-6 panels work best for video flow
- **Character Detail**: Include specific character descriptions for consistency
- **Scene Description**: Be detailed about settings and actions for better animation
- **Narrative Flow**: Ensure logical progression between panels for smooth video transitions
- **Duration Planning**: Each panel typically becomes 3-5 seconds of video content

## 🌟 Showcase: What You Can Create

### Educational Series
Transform complex concepts into digestible visual stories and dynamic videos:
- **"The Journey of a Raindrop"** - Follow water through the entire cycle with animated panel transitions
- **"Inside a Computer's Brain"** - Make programming concepts accessible to kids with video explanations
- **"The Amazing World of Photosynthesis"** - Turn biology into an adventure with cinematic storytelling

### Creative Storytelling
Let your imagination run wild with both static and animated content:
- **Daily Life Adventures** - Turn mundane moments into hilarious escapades with video comedic timing
- **Historical Reimaginings** - What if Napoleon had a smartphone? Watch it unfold in video format
- **Sci-Fi Scenarios** - Explore futures where AI and humans collaborate through immersive video narratives

### Personal Projects
Create meaningful content in multiple formats:
- **Family Stories** - Preserve memories in comic and video format for future generations
- **Learning Journeys** - Document your path to mastering new skills with animated progress stories
- **Motivational Series** - Inspire others with visual success stories that come alive through video
- **Character-Driven Narratives** - Develop consistent characters across multiple comics and video episodes

## 🤝 Community & Sharing

### Share Your Creations
- **Social Media**: Tag us with `#ComicsAI` to showcase your best comics
- **Community Gallery**: Submit standout comics to our featured gallery
- **Educational Use**: Teachers and educators - we'd love to see classroom applications!


## 🔧 Troubleshooting & Support

### Common Issues
- **API Limits**: If you hit rate limits, consider upgrading your Google Cloud plan
- **Image Quality**: For best results, use descriptive prompts and experiment with different art styles
- **Performance**: Comic generations may take 2-5 minutes, video generation can take 5-10 minutes - patience creates masterpieces!
- **Video Processing**: Large video files require substantial bandwidth; ensure stable internet connection
- **Character Consistency**: If characters appear different across panels, regenerate with more specific character descriptions
- **Storage Space**: Video files are larger than images; ensure adequate local and cloud storage
- **Browser Compatibility**: For best video playback, use Chrome or Firefox with hardware acceleration enabled

### Video-Specific Troubleshooting

#### Veo 3 API Issues
- **"Veo 3 not available"**: Ensure your Google Cloud project has Veo 3 API enabled and billing configured
- **Quota exceeded**: Check your Veo 3 quotas in Google Cloud Console and consider upgrading your plan
- **Generation timeout**: Video processing can take 5-15 minutes; don't refresh the page during generation

#### Video Quality Issues
- **Low quality output**: Try regenerating with more detailed scene descriptions
- **Inconsistent animation**: Ensure character descriptions are detailed and consistent across panels
- **Audio sync issues**: Currently audio is not supported; videos are visual-only

#### Performance Optimization
- **Slow video generation**: 
  - Ensure stable high-speed internet connection (minimum 50 Mbps recommended)
  - Close unnecessary browser tabs and applications
  - Use wired connection instead of WiFi when possible
- **Large file sizes**: Videos are typically 10-30MB; ensure adequate storage space
- **Memory issues**: Close other applications during video generation; 16GB+ RAM recommended

#### FFmpeg Issues
- **FFmpeg not found**: Verify FFmpeg is installed and added to your system PATH
- **Codec errors**: Ensure you have the latest FFmpeg version with H.264 support
- **Permission errors**: On Linux/macOS, you may need to run with appropriate permissions


## 🎭 The Magic Behind the Scenes

Every comic and video you create represents a fascinating dance between human creativity and artificial intelligence. When you type "a robot learning to paint," here's what happens:

1. **🧠 Creative Interpretation**: Gemini AI analyzes your topic, considering context, tone, and audience
2. **📝 Story Architecture**: The AI crafts a narrative arc with compelling characters and dialogue  
3. **👥 Character Consistency**: Advanced validation ensures characters maintain their appearance across all panels
4. **🎨 Visual Translation**: Your story transforms into detailed image prompts for Imagen
5. **🖼️ Artistic Rendering**: Google's most advanced AI brings your vision to life with stunning visuals
6. **✨ Comic Composition**: Our algorithms seamlessly blend text and imagery into professional comic panels
7. **🎬 Video Generation**: Google Veo 3 transforms each panel into dynamic video segments
8. **🎞️ Cinematic Compilation**: Individual videos are merged into a cohesive animated experience
9. **☁️ Cloud Integration**: Videos are efficiently managed through dynamic Google Cloud Storage

The result? A unique piece of multimedia storytelling that never existed before - born from the collaboration between your imagination and cutting-edge AI, available as both static comics and dynamic videos.

## 🌈 The Future of Storytelling

We're not just generating comics; we're democratizing storytelling itself. Whether you're a teacher making science fun, a parent creating bedtime stories, or an entrepreneur explaining complex ideas, this tool puts Hollywood-level creative production at your fingertips.

Every comic strip is a small act of creation, a bridge between imagination and reality, a story waiting to inspire someone else. In a world where anyone can become a storyteller, what story will you tell?

## 🙏 Acknowledgments

This project stands on the shoulders of incredible innovations:
- **Google's Gemini & Imagen teams** for pushing the boundaries of AI creativity
- **The open-source community** for tools that make projects like this possible
- **Comic artists worldwide** who continue to inspire visual storytelling
- **Every user** who transforms ideas into visual magic

## 🚀 Ready to Create?

Your next great comic is just an idea away. Whether it's explaining quantum physics through cats, reimagining fairy tales in space, or simply bringing joy to someone's day - the canvas is blank and the possibilities are infinite.

**Start creating. Start inspiring. Start telling stories the world has never seen before.**

---

*"Every great story begins with a single panel. What's yours going to be?"*

---

**[⬆ Back to Top](#comics-generator)** | **[🎨 Start Creating](http://localhost:3000)**
