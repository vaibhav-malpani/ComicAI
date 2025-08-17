import { Routes, Route } from 'react-router-dom'
import { BookOpen, Palette, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateComic from './pages/CreateComic'
import ComicGallery from './pages/ComicGallery'
import ComicView from './pages/ComicView'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

        {/* Floating Comic Elements */}
        <div className="absolute top-10 left-10 opacity-10 animate-float">
          <div className="w-20 h-20 bg-comic-yellow rounded-full border-4 border-black"></div>
        </div>
        <div className="absolute top-1/4 right-20 opacity-10 animate-float animation-delay-1000">
          <div className="w-16 h-16 bg-comic-red transform rotate-45 border-4 border-black"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-10 animate-float animation-delay-2000">
          <div className="w-12 h-12 bg-comic-blue rounded-full border-4 border-black"></div>
        </div>
        <div className="absolute top-1/3 left-1/2 opacity-10 animate-float animation-delay-3000">
          <div className="comic-speech-bubble w-24 h-16 text-xs flex items-center justify-center font-comic">
            POW!
          </div>
        </div>

        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 comic-dot-pattern"></div>
      </div>

      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-8 custom-scrollbar">
        <div className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateComic />} />
            <Route path="/gallery" element={<ComicGallery />} />
            <Route path="/comic/:id" element={<ComicView />} />
          </Routes>
        </div>
      </main>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 z-20 no-print">
        <div className="flex flex-col space-y-4">
          {/* Scroll to Top Button */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
