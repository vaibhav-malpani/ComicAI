import { Link } from 'react-router-dom'
import { Plus, Image, Sparkles, BookOpen, Zap, Brain, Palette, Wand2, Star, ArrowRight, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getComics } from '../api/comics'

const Home = () => {
  const { data: comicsData } = useQuery({
    queryKey: ['comics'],
    queryFn: getComics,
  })

  const recentComics = comicsData?.comics.slice(0, 3) || []

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <div className="relative text-center space-y-8 py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-comic-yellow/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-comic-purple/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* AI Powered Badge */}
        <div className="inline-flex items-center space-x-3 badge-comic animate-bounce-slow">
          <Sparkles size={20} className="animate-spin-slow" />
          <span className="font-comic">✨ Powered by Google AI ✨</span>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="hero-title animate-slide-up">
            ComicCraft AI
          </h1>
          <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl font-comic animate-slide-up animation-delay-1000">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-comic-blue shadow-comic">
              <Brain className="text-comic-blue animate-pulse" size={32} />
              <span className="text-comic-blue font-bold">Stories</span>
            </div>
            <Plus className="text-gray-400" size={24} />
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-comic-red shadow-comic">
              <Palette className="text-comic-red animate-pulse animation-delay-1000" size={32} />
              <span className="text-comic-red font-bold">Art</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-slide-up animation-delay-2000">
          Transform your wildest ideas into <span className="font-bold gradient-text">stunning visual comics</span> in minutes! 
          Our AI creates compelling stories and breathtaking artwork automatically.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up animation-delay-3000">
          <Link to="/create" className="group btn-primary text-lg px-8 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative flex items-center space-x-3">
              <Wand2 size={24} className="group-hover:animate-wiggle" />
              <span>Create Your Masterpiece</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>

          <Link to="/gallery" className="group btn-secondary text-lg px-8 py-4">
            <div className="flex items-center space-x-3">
              <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>See Examples</span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-slide-up animation-delay-3000">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">∞</div>
            <div className="text-gray-600 font-medium">Unlimited Stories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">⚡</div>
            <div className="text-gray-600 font-medium">Lightning Fast</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">🎨</div>
            <div className="text-gray-600 font-medium">Professional Quality</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-heading font-black gradient-text mb-4">
            How the Magic Happens
          </h2>
          <p className="text-xl text-gray-600">Three simple steps to comic greatness</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card group hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 text-center relative overflow-hidden">
            <div className="feature-icon bg-gradient-to-br from-blue-400 to-blue-600 group-hover:from-blue-500 group-hover:to-blue-700">
              <BookOpen className="text-white" size={40} />
            </div>
            <div className="absolute top-4 right-4 bg-comic-yellow text-black font-bold text-xs px-2 py-1 rounded-full border-2 border-black">
              STEP 1
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4 gradient-text">AI Storytelling</h3>
            <p className="text-gray-600 leading-relaxed">
              Our advanced <span className="font-semibold text-blue-600">Gemini AI</span> crafts compelling narratives, 
              complete with rich characters, engaging dialogue, and dramatic plot twists.
            </p>
            <div className="mt-6 inline-flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <Brain size={16} className="mr-2" />
              <span>Smart Story Generation</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card group hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 text-center relative overflow-hidden">
            <div className="feature-icon bg-gradient-to-br from-purple-400 to-purple-600 group-hover:from-purple-500 group-hover:to-purple-700">
              <Sparkles className="text-white animate-pulse" size={40} />
            </div>
            <div className="absolute top-4 right-4 bg-comic-yellow text-black font-bold text-xs px-2 py-1 rounded-full border-2 border-black">
              STEP 2
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4 gradient-text">Stunning Visuals</h3>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-purple-600">Imagen 4</span> transforms stories into 
              breathtaking comic panels with professional-grade illustrations and perfect composition.
            </p>
            <div className="mt-6 inline-flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <Palette size={16} className="mr-2" />
              <span>AI-Powered Art</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card group hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 text-center relative overflow-hidden">
            <div className="feature-icon bg-gradient-to-br from-green-400 to-green-600 group-hover:from-green-500 group-hover:to-green-700">
              <Zap className="text-white animate-pulse" size={40} />
            </div>
            <div className="absolute top-4 right-4 bg-comic-yellow text-black font-bold text-xs px-2 py-1 rounded-full border-2 border-black">
              STEP 3
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4 gradient-text">Instant Magic</h3>
            <p className="text-gray-600 leading-relaxed">
              From concept to completion in <span className="font-semibold text-green-600">under 3 minutes!</span> 
              Download, share, or create variations of your comic masterpiece.
            </p>
            <div className="mt-6 inline-flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
              <Zap size={16} className="mr-2" />
              <span>Lightning Speed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comics */}
      {recentComics.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-black gradient-text mb-4">
              Fresh from the AI Studio
            </h2>
            <p className="text-xl text-gray-600">Check out the latest comic creations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentComics.map((comic, index) => (
              <Link
                key={comic.comic_id}
                to={`/comic/${comic.comic_id}`}
                className="group block animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="card-comic group-hover:scale-110 group-hover:shadow-2xl relative overflow-hidden">
                  {/* Comic Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-comic-yellow text-black font-bold text-xs px-2 py-1 rounded-full border-2 border-black">
                    <Star size={12} className="inline mr-1" />
                    NEW
                  </div>

                  <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-xl mb-4 overflow-hidden relative">
                    <img
                      src={`/api/comics/${comic.comic_id}/image`}
                      alt={comic.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23374151">Comic Preview</text></svg>'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2 group-hover:gradient-text transition-all duration-300">
                    {comic.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {comic.theme}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="badge">
                      {comic.generation_params?.tone || 'general'}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(comic.generated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/gallery" 
              className="inline-block group relative"
            >
              <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white font-black text-xl px-12 py-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1">
                <div className="flex items-center justify-center space-x-3">
                  <Image size={28} className="group-hover:animate-bounce" />
                  <span className="tracking-wide">EXPLORE ALL COMICS</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black group-hover:animate-spin">
                    <ArrowRight size={16} className="text-black" />
                  </div>
                </div>

                {/* Comic Book Style Dots */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full border-2 border-black animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full border-2 border-black animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-black animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl"></div>
              </div>

              {/* Speech Bubble */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2">
                <div className="bg-white text-black px-4 py-2 rounded-2xl border-4 border-black text-sm font-bold whitespace-nowrap relative">
                  WOW! 🎉
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black"></div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px] w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>

              {/* Sparkles Animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-8 text-yellow-300 opacity-0 group-hover:opacity-100 animate-ping">✨</div>
                <div className="absolute top-8 right-12 text-pink-300 opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.3s' }}>⭐</div>
                <div className="absolute bottom-4 left-16 text-cyan-300 opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.6s' }}>💫</div>
                <div className="absolute bottom-8 right-8 text-purple-300 opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.9s' }}>✨</div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-heading font-black">
            Ready to Create Comic Magic? ✨
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are bringing their imagination to life with AI-powered comics.
          </p>
          <Link to="/create" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Start Creating Now - It's Free! 🚀
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
