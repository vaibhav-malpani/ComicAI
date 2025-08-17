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
- **Social Media**: Tag us with `#ComicsAI` to showcase your best comics
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

**[⬆ Back to Top](#comics-generator)** | **[🎨 Start Creating](http://localhost:3000)**
