import { Link } from 'react-router-dom'
import { Plus, Image, Sparkles, BookOpen, Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getComics } from '../api/comics'

const Home = () => {
  const { data: comicsData } = useQuery({
    queryKey: ['comics'],
    queryFn: getComics,
  })

  const recentComics = comicsData?.comics.slice(0, 3) || []

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-comic-yellow px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles size={16} />
          <span>Powered by AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-shadow">
          Daily Comics Generator
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Create amazing comics with the power of AI! Generate unique storylines with Gemini 
          and bring them to life with beautiful artwork using Imagen 4.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
            <Plus size={20} />
            <span>Create Your First Comic</span>
          </Link>

          <Link to="/gallery" className="btn-secondary inline-flex items-center space-x-2">
            <Image size={20} />
            <span>Browse Gallery</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="w-16 h-16 bg-comic-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Storytelling</h3>
          <p className="text-gray-600">
            Generate compelling comic scripts with Google's Gemini AI, complete with dialogue, 
            characters, and scene descriptions.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-comic-red rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Beautiful Artwork</h3>
          <p className="text-gray-600">
            Create stunning visual panels using Imagen 4, bringing your stories to life 
            with professional-quality illustrations.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-comic-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Instant Generation</h3>
          <p className="text-gray-600">
            Go from idea to finished comic in minutes. Choose your topic, style, and tone, 
            then watch the magic happen!
          </p>
        </div>
      </div>

      {/* Recent Comics */}
      {recentComics.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">Recent Comics</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {recentComics.map((comic) => (
              <Link
                key={comic.comic_id}
                to={`/comic/${comic.comic_id}`}
                className="card hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <img
                    src={`/api/comics/${comic.comic_id}/image`}
                    alt={comic.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23374151">Comic Preview</text></svg>'
                    }}
                  />
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2">{comic.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{comic.theme}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comic.generated_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery" className="btn-secondary">
              View All Comics
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
