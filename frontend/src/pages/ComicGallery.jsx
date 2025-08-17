import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Loader, Eye, Calendar, Star, Filter, Grid, List, Search, Plus, Heart, Zap, Clock } from 'lucide-react'
import { useState } from 'react'
import { getComics } from '../api/comics'

const ComicGallery = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [filterTone, setFilterTone] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: comicsData, isLoading, error } = useQuery({
    queryKey: ['comics'],
    queryFn: getComics,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto mb-4 w-12 h-12"></div>
          <p className="text-xl font-medium text-gray-600">Loading amazing comics...</p>
          <p className="text-sm text-gray-500">This won't take long! ✨</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="text-red-500" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">Failed to load comics. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  const comics = comicsData?.comics || []

  // Filter and search comics
  const filteredComics = comics.filter(comic => {
    const matchesTone = filterTone === 'all' || comic.generation_params?.tone === filterTone
    const matchesSearch = comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comic.theme.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTone && matchesSearch
  })

  const tones = ['all', 'humorous', 'educational', 'dramatic', 'inspirational']

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 badge-comic">
          <Star className="animate-pulse" size={20} />
          <span className="font-comic">AI Comic Gallery</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-heading font-black gradient-text">
          Discover Amazing Comics
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore a world of creativity! Browse through stunning AI-generated comics created by our community.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-blue-200">
            <Eye className="text-blue-500" size={20} />
            <span className="font-semibold text-blue-700">{comics.length} Comics</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-green-200">
            <Zap className="text-green-500" size={20} />
            <span className="font-semibold text-green-700">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search comics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-600" size={20} />
              <select
                value={filterTone}
                onChange={(e) => setFilterTone(e.target.value)}
                className="select-modern"
              >
                {tones.map(tone => (
                  <option key={tone} value={tone}>
                    {tone === 'all' ? 'All Tones' : tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-gray-600'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-gray-600'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Results */}
        {(searchTerm || filterTone !== 'all') && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <span>Showing {filteredComics.length} of {comics.length} comics</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                "{searchTerm}"
              </span>
            )}
            {filterTone !== 'all' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {filterTone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Comics Grid/List */}
      {filteredComics.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            {comics.length === 0 ? (
              <Eye size={60} className="text-gray-400" />
            ) : (
              <Search size={60} className="text-gray-400" />
            )}
          </div>

          {comics.length === 0 ? (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No comics yet! 🎨</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Be the first to create an amazing AI-generated comic and inspire others!
              </p>
              <Link to="/create" className="btn-primary text-lg px-8 py-4">
                <Plus size={24} className="mr-2" />
                Create First Comic
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No matches found 🔍</h3>
              <p className="text-xl text-gray-600 mb-8">
                Try adjusting your search terms or filters.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setFilterTone('all')
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            : "space-y-6"
        }>
          {filteredComics.map((comic, index) => (
            <Link
              key={comic.comic_id}
              to={`/comic/${comic.comic_id}`}
              className="group block animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {viewMode === 'grid' ? (
                <div className="card-comic group-hover:scale-105 group-hover:rotate-1 relative overflow-hidden">
                  {/* Featured Badge */}
                  {index < 3 && (
                    <div className="absolute top-4 left-4 z-10 bg-comic-yellow text-black font-bold text-xs px-3 py-1 rounded-full border-2 border-black animate-pulse">
                      <Star size={12} className="inline mr-1" />
                      FEATURED
                    </div>
                  )}

                  <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl mb-4 overflow-hidden relative">
                    <img
                      src={`/api/comics/${comic.comic_id}/image`}
                      alt={comic.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="%23374151">Comic Art</text></svg>'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-black">
                        <span className="font-bold text-black">View Comic</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2 group-hover:gradient-text transition-all duration-300 line-clamp-2">
                    {comic.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {comic.theme}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(comic.generated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{comic.panel_count || 1} panels</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="badge text-xs">
                      {comic.generation_params?.tone || 'general'}
                    </span>
                    <button className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card flex items-center space-x-6 group-hover:bg-gray-50">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={`/api/comics/${comic.comic_id}/image`}
                      alt={comic.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="%23374151">Comic</text></svg>'
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:gradient-text transition-all duration-300">
                      {comic.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      {comic.theme}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(comic.generated_at).toLocaleDateString()}</span>
                      <span className="badge">
                        {comic.generation_params?.tone || 'general'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Create CTA */}
      {filteredComics.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-heading font-bold mb-4">
                Ready to create your own? ✨
              </h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Join our community of creators and bring your ideas to life with AI-powered comics!
              </p>
              <Link to="/create" className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Create Your Comic Now! 🚀
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComicGallery
