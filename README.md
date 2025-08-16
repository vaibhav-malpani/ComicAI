# Daily Comics Generator

A full-stack web application that automatically generates comic strips using Google's Gemini AI for storytelling and Imagen for visual creation. Transform any topic into engaging visual comics with customizable tones and styles through an intuitive web interface.

## 🚀 Tech Stack

### Backend
- **Python 3.11+** - Core programming language
- **FastAPI** - Modern async web framework and REST API
- **Uvicorn** - ASGI server for FastAPI
- **Google Gemini AI** - Story and dialogue generation
- **Google Imagen** - Comic artwork generation
- **OpenCV & Pillow** - Image processing
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
2. **Google Cloud Project** with billing enabled
3. **Google Cloud credentials** with access to:
   - Gemini API
   - Vertex AI (for Imagen)
4. **Git** for cloning the repository

## 🛠️ Installation

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd daily-comics-generator
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

## ✨ Features

- **Web-Based Interface** - Intuitive React-powered web application
- **AI-Powered Storytelling** - Generate engaging comic scripts with Gemini AI
- **Visual Comic Generation** - Create stunning comic artwork with Google Imagen
- **Multiple Tones** - Support for humorous, educational, dramatic, and inspirational content
- **Audience Targeting** - Customize content for different audiences (general, technical, kids, academic)
- **Real-time Generation** - Watch your comics come to life with live progress updates
- **Customizable Styles** - Various visual art styles available through web interface
- **Gallery View** - Browse and manage your generated comics
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Export & Download** - Save comics in multiple image formats

## 💻 System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Python**: 3.11 or higher
- **Node.js**: 16+ (for frontend development)
- **Memory**: Minimum 4GB RAM (8GB+ recommended)
- **Storage**: 2GB+ free space for comic outputs
- **Network**: Stable internet connection for AI API calls
- **Browser**: Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

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
4. **Generate:** Click the "Generate Comic" button and watch the AI create your comic in real-time
5. **View Results:** Your completed comic will appear with options to download or share

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

## 🌟 Showcase: What You Can Create

### Educational Series
Transform complex concepts into digestible visual stories:
- **"The Journey of a Raindrop"** - Follow water through the entire cycle
- **"Inside a Computer's Brain"** - Make programming concepts accessible to kids
- **"The Amazing World of Photosynthesis"** - Turn biology into an adventure

### Creative Storytelling
Let your imagination run wild:
- **Daily Life Adventures** - Turn mundane moments into hilarious escapades
- **Historical Reimaginings** - What if Napoleon had a smartphone?
- **Sci-Fi Scenarios** - Explore futures where AI and humans collaborate

### Personal Projects
Create meaningful content:
- **Family Stories** - Preserve memories in comic format
- **Learning Journeys** - Document your path to mastering new skills
- **Motivational Series** - Inspire others with visual success stories

## 🤝 Community & Sharing

### Share Your Creations
- **Social Media**: Tag us with `#DailyComicsAI` to showcase your best comics
- **Community Gallery**: Submit standout comics to our featured gallery
- **Educational Use**: Teachers and educators - we'd love to see classroom applications!


## 🔧 Troubleshooting & Support

### Common Issues
- **API Limits**: If you hit rate limits, consider upgrading your Google Cloud plan
- **Image Quality**: For best results, use descriptive prompts and experiment with different art styles
- **Performance**: Large comic generations may take 2-5 minutes - patience creates masterpieces!


## 🎭 The Magic Behind the Scenes

Every comic you create represents a fascinating dance between human creativity and artificial intelligence. When you type "a robot learning to paint," here's what happens:

1. **🧠 Creative Interpretation**: Gemini AI analyzes your topic, considering context, tone, and audience
2. **📝 Story Architecture**: The AI crafts a narrative arc with compelling characters and dialogue  
3. **🎨 Visual Translation**: Your story transforms into detailed image prompts for Imagen
4. **🖼️ Artistic Rendering**: Google's most advanced AI brings your vision to life with stunning visuals
5. **✨ Comic Composition**: Our algorithms seamlessly blend text and imagery into professional comic panels

The result? A unique piece of visual storytelling that never existed before - born from the collaboration between your imagination and cutting-edge AI.

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

**[⬆ Back to Top](#daily-comics-generator)** | **[🎨 Start Creating](http://localhost:3000)**
