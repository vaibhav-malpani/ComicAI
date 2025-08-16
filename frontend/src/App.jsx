import { Routes, Route } from 'react-router-dom'
import { BookOpen, Palette, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateComic from './pages/CreateComic'
import ComicGallery from './pages/ComicGallery'
import ComicView from './pages/ComicView'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateComic />} />
          <Route path="/gallery" element={<ComicGallery />} />
          <Route path="/comic/:id" element={<ComicView />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
