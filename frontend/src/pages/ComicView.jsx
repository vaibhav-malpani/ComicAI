import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Download, Share, Calendar, User, Palette, Clock, ArrowLeft, Heart, BookOpen, Zap, Star, Copy, Facebook, Twitter, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { getComic, getComicScript } from '../api/comics'

const ComicView = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

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
    link.download = `${comic.title.replace(/[^a-zA-Z0-9]/g, '_')}_comic.png`
    link.click()
    toast.success('Comic downloaded! 📥')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: comic.title,
          text: `Check out this amazing AI-generated comic: ${comic.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard! 📋')
    setShowShareMenu(false)
  }

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this amazing AI comic: ${comic.title}`)

    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  if (comicLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto mb-4 w-12 h-12"></div>
          <p className="text-xl font-medium text-gray-600">Loading your comic...</p>
          <p className="text-sm text-gray-500">Getting everything ready! ✨</p>
        </div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="text-red-500" size={40} />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Comic Not Found 😕</h3>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the comic you're looking for.
        </p>
        <Link to="/gallery" className="btn-primary">
          <ArrowLeft size={20} className="mr-2" />
          Back to Gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Back Navigation */}
      <Link 
        to="/gallery" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Gallery</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 badge-comic">
            <Star className="animate-pulse" size={16} />
            <span className="font-comic">AI Generated</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-black gradient-text">
            {comic.title}
          </h1>

          {comic.theme && (
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {comic.theme}
            </p>
          )}
        </div>

        {/* Comic Meta Information */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-blue-200">
            <Calendar className="text-blue-500" size={16} />
            <span className="text-sm font-medium text-blue-700">
              {new Date(comic.generated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-green-200">
            <User className="text-green-500" size={16} />
            <span className="text-sm font-medium text-green-700">
              {comic.generation_params?.target_audience || 'General'}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-purple-200">
            <Palette className="text-purple-500" size={16} />
            <span className="text-sm font-medium text-purple-700">
              {comic.generation_params?.visual_style || 'Modern Digital'}
            </span>
          </div>

          {comic.processing_time_seconds && (
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-orange-200">
              <Zap className="text-orange-500" size={16} />
              <span className="text-sm font-medium text-orange-700">
                {comic.processing_time_seconds.toFixed(1)}s to create
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={handleDownload} 
            className="btn-primary group px-8 py-4 text-lg relative overflow-hidden"
          >
            <div className="flex items-center space-x-3">
              <Download size={24} className="group-hover:animate-bounce" />
              <span>Download Comic</span>
            </div>
          </button>

          <div className="relative">
            <button 
              onClick={handleShare} 
              className="btn-secondary px-8 py-4 text-lg group"
            >
              <div className="flex items-center space-x-3">
                <Share size={24} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Share</span>
              </div>
            </button>

            {/* Share Dropdown */}
            {showShareMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 space-y-2 z-50 min-w-48">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                >
                  <Copy size={20} className="text-gray-600" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                >
                  <Twitter size={20} className="text-blue-500" />
                  <span>Share on Twitter</span>
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                >
                  <Facebook size={20} className="text-blue-600" />
                  <span>Share on Facebook</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={24} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Comic Display */}
      <div className="flex justify-center">
        <div className="relative group">
          <div className="comic-panel bg-white p-6 max-w-4xl relative overflow-hidden">
            {/* Comic Border Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-comic-blue via-comic-purple to-comic-red"></div>

            <img
              src={`/api/comics/${id}/image`}
              alt={comic.title}
              className="w-full h-auto rounded-xl shadow-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="32" fill="%23374151">Comic Artwork Loading...</text></svg>'
              }}
            />
          </div>

          {/* Floating Action on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button 
              onClick={handleDownload}
              className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-2xl font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 border-2 border-black"
            >
              💾 Save Comic
            </button>
          </div>
        </div>
      </div>

      {/* Comic Details Card */}
      <div className="card max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Generation Details */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold gradient-text mb-4">
              Creation Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Eye className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">Tone</div>
                  <div className="text-blue-600 capitalize">{comic.generation_params?.tone || 'General'}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Palette className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-purple-800">Art Style</div>
                  <div className="text-purple-600">{comic.generation_params?.visual_style || 'Modern Digital Comic'}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Target Audience</div>
                  <div className="text-green-600 capitalize">{comic.generation_params?.target_audience || 'General'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold gradient-text mb-4">
              Comic Stats
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {comic.panel_count || 1}
                </div>
                <div className="text-blue-800 font-medium">Panels</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {comic.processing_time_seconds ? `${comic.processing_time_seconds.toFixed(1)}s` : 'N/A'}
                </div>
                <div className="text-purple-800 font-medium">Generated</div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white text-center mt-6">
              <h4 className="text-xl font-bold mb-2">Love this comic? 💫</h4>
              <p className="mb-4 opacity-90">Create your own AI-generated masterpiece!</p>
              <Link to="/create" className="inline-block bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300">
                Create My Comic 🎨
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComicView
