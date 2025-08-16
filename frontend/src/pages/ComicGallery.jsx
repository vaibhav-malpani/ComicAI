import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Loader, Eye, Calendar } from 'lucide-react'
import { getComics } from '../api/comics'

const ComicGallery = () => {
  const { data: comicsData, isLoading, error } = useQuery({
    queryKey: ['comics'],
    queryFn: getComics,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load comics. Please try again.</p>
      </div>
    )
  }

  const comics = comicsData?.comics || []

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Comic Gallery</h1>
        <p className="text-lg text-gray-600">
          Explore all the amazing comics created with AI
        </p>
      </div>

      {comics.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Eye size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No comics yet</h3>
          <p className="text-gray-600 mb-6">Create your first comic to get started!</p>
          <Link to="/create" className="btn-primary">
            Create Comic
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {comics.map((comic) => (
            <Link
              key={comic.comic_id}
              to={`/comic/${comic.comic_id}`}
              className="group block"
            >
              <div className="card hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={`/api/comics/${comic.comic_id}/image`}
                    alt={comic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23374151">Comic Preview</text></svg>'
                    }}
                  />
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {comic.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {comic.theme}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(comic.generated_at).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {comic.panel_count} panels
                  </span>
                </div>

                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {comic.generation_params?.tone || 'general'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ComicGallery
