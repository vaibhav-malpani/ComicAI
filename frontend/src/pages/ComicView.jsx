import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, Share, Calendar, User, Palette, Clock, ArrowLeft, Heart, BookOpen, Zap, Star, Copy, Facebook, Twitter, Eye, Video, Play, Loader, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { getComic, getComicScript, generateVideo } from '../api/comics'

const ComicView = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [videoStatus, setVideoStatus] = useState(null)
  const queryClient = useQueryClient()

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

  // Video generation mutation
  const videoGenerationMutation = useMutation({
    mutationFn: () => generateVideo(id),
    onSuccess: (data) => {
      if (data.status === 'completed') {
        toast.success('Video generated successfully! 🎉')
        setVideoStatus('completed')
        // Refresh comic data to get updated video info
        queryClient.invalidateQueries(['comic', id])
      } else {
        toast.error('Video generation failed 😞')
        setVideoStatus('failed')
      }
    },
    onError: (error) => {
      toast.error('Failed to generate video 😞')
      console.error('Video generation error:', error)
      setVideoStatus('failed')
    }
  })

  // Initialize video status from comic data
  useEffect(() => {
    if (comic) {
      setVideoStatus(comic.video_status)
    }
  }, [comic])

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

  // Helper function to format time display
  const formatTime = (seconds) => {
    if (!seconds) return 'N/A'
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      if (remainingSeconds < 1) {
        return `${minutes}m`
      }
      return `${minutes}m${Math.round(remainingSeconds)}s`
    }
    return `${seconds.toFixed(1)}s`
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
                {formatTime(comic.processing_time_seconds)} to create
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

      {/* Video Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold gradient-text mb-4">
            🎬 Animated Version
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch your comic come to life with AI-generated video animation
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Video Available */}
            {(comic.video_status === 'completed' && comic.video_url) && (
              <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-200">
                <div className="relative">
                  <video
                    className="w-full h-auto rounded-xl shadow-lg bg-black"
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    playsInline
                    poster={`/api/comics/${id}/image`}
                    onError={(e) => {
                      console.error('Video loading error:', e.target.error)
                      toast.error('Failed to load video. Please try downloading it instead.')
                    }}
                    onLoadedMetadata={() => {
                      console.log('Video metadata loaded successfully')
                      toast.success('Video loaded successfully! 🎬')
                    }}
                    onLoadStart={() => {
                      console.log('Video loading started')
                    }}
                  >
                    <source 
                      src={`/api/comics/${encodeURIComponent(id)}/video`} 
                      type="video/mp4"
                    />
                    <div className="text-gray-500 text-center py-12 bg-gray-100 rounded-lg">
                      <p className="mb-4">Your browser doesn't support video playback.</p>
                      <a 
                        href={`/api/comics/${encodeURIComponent(id)}/video`} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block hover:bg-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Video in New Tab
                      </a>
                    </div>
                  </video>

                  {/* Video Controls Overlay */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                    <span className="text-white text-sm font-medium">🎬 AI Generated</span>
                  </div>
                </div>

                {/* Video Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <a
                    href={`/api/comics/${encodeURIComponent(id)}/video`}
                    download={`${comic.title.replace(/[^a-zA-Z0-9]/g, '_')}_video.mp4`}
                    className="btn-primary px-6 py-3 group"
                  >
                    <div className="flex items-center space-x-2">
                      <Download size={20} className="group-hover:animate-bounce" />
                      <span>Download Video</span>
                    </div>
                  </a>

                  <a
                    href={`/api/comics/${encodeURIComponent(id)}/video`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-6 py-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Eye size={20} />
                      <span>Open in New Tab</span>
                    </div>
                  </a>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  🎬 Generated on {new Date(comic.video_generated_at || Date.now()).toLocaleDateString()}
                  {comic.video_processing_time_seconds && (
                    <span> • Processing time: {formatTime(comic.video_processing_time_seconds)}</span>
                  )}
                </div>
              </div>
            )}

            {/* Video Generation in Progress */}
            {(videoStatus === 'generating' || videoStatus === 'processing' || videoGenerationMutation.isPending) && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-blue-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="text-blue-600 animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Creating Your Video...
                </h3>
                <p className="text-blue-600 mb-4">
                  Our AI is working its magic to animate your comic. This may take a few minutes.
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {/* Video Generation Failed */}
            {(videoStatus === 'failed') && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 text-center border-2 border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Video Generation Failed
                </h3>
                <p className="text-red-600 mb-6">
                  Something went wrong while creating your video. Please try again.
                </p>
                <button
                  onClick={() => {
                    setVideoStatus('generating')
                    videoGenerationMutation.mutate()
                  }}
                  className="btn-secondary px-6 py-3"
                  disabled={videoGenerationMutation.isPending}
                >
                  <div className="flex items-center space-x-2">
                    <Play size={20} />
                    <span>Try Again</span>
                  </div>
                </button>
              </div>
            )}

            {/* Video Not Generated */}
            {(!comic.video_url && !videoStatus) && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center border-2 border-purple-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  Generate Video Animation
                </h3>
                <p className="text-purple-600 mb-6 max-w-md mx-auto">
                  Transform your comic into an animated video with smooth transitions and effects
                </p>
                <button
                  onClick={() => {
                    setVideoStatus('generating')
                    videoGenerationMutation.mutate()
                  }}
                  disabled={videoGenerationMutation.isPending}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Play size={24} />
                    <span>Generate Video</span>
                  </div>
                </button>
              </div>
            )}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Comic Generation Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-blue-800">Comic Generation</div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="text-white" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 text-sm">Panels</span>
                    <span className="text-2xl font-bold text-blue-700">{comic.panel_count || 4}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 text-sm">Time</span>
                    <span className="text-xl font-bold text-blue-700">{formatTime(comic.processing_time_seconds)}</span>
                  </div>
                </div>
              </div>

              {/* Video Stats - Only show if video exists or is being processed */}
              {(comic.video_url || comic.video_status) && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold text-green-800">Video Generation</div>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Video className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 text-sm">Status</span>
                      <span className="text-xl">
                        {comic.video_status === 'completed' ? '✅' : 
                         comic.video_status === 'processing' ? '⏳' : 
                         comic.video_status === 'failed' ? '❌' : '📹'}
                      </span>
                    </div>
                    {comic.video_processing_time_seconds && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 text-sm">Time</span>
                        <span className="text-xl font-bold text-green-700">{formatTime(comic.video_processing_time_seconds)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
