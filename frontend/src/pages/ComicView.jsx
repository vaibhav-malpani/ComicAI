import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Download, Share, Calendar, User, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import { getComic, getComicScript } from '../api/comics'

const ComicView = () => {
  const { id } = useParams()

  const { data: comic, isLoading: comicLoading } = useQuery({
    queryKey: ['comic', id],
    queryFn: () => getComic(id),
    enabled: !!id,
  })

  const { data: script, isLoading: scriptLoading } = useQuery({
    queryKey: ['comic-script', id],
    queryFn: () => getComicScript(id),
    enabled: !!id,
  })

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `/api/comics/${id}/image`
    link.download = `${comic.comic_id}.png`
    link.click()
    toast.success('Comic downloaded!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: comic.title,
          text: `Check out this AI-generated comic: ${comic.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (comicLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comic...</p>
        </div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Comic not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{comic.title}</h1>
        {comic.theme && (
          <p className="text-lg text-gray-600">{comic.theme}</p>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{new Date(comic.generated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User size={16} />
            <span>{comic.generation_params?.target_audience || 'General'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Palette size={16} />
            <span>{comic.generation_params?.visual_style || 'Modern'}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={handleDownload} className="btn-primary">
            <Download size={16} />
            <span>Download</span>
          </button>
          <button onClick={handleShare} className="btn-secondary">
            <Share size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comic Image */}
      <div className="text-center">
        <div className="inline-block comic-panel bg-white p-4">
          <img
            src={`/api/comics/${id}/image`}
            alt={comic.title}
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="%23374151">Comic Image</text></svg>'
            }}
          />
        </div>
      </div>

    </div>
  )
}

export default ComicView
