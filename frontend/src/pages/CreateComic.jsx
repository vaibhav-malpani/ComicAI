import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Wand2, Loader, Clock, Sparkles, Brain, Palette, Zap, Lightbulb, Users, Eye, Target } from 'lucide-react'
import { generateComic } from '../api/comics'

const CreateComic = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'humorous',
    target_audience: 'general',
    visual_style: 'modern digital comic'
  })
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef(null)

  const generateMutation = useMutation({
    mutationFn: generateComic,
    onMutate: () => {
      const now = Date.now()
      setStartTime(now)
      setElapsedTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - now)
      }, 1000)
    },
    onSuccess: (data) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      const totalTime = Math.round((Date.now() - startTime) / 1000)
      toast.success(`Comic generated successfully in ${totalTime}s!`)
      navigate(`/comic/${data.comic_id}`)
    },
    onError: (error) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      toast.error(error.response?.data?.detail || 'Failed to generate comic')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic for your comic')
      return
    }
    generateMutation.mutate(formData)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const topicExamples = [
    "A robot learning to paint masterpieces",
    "Time-traveling pizza delivery adventure",
    "Superhero cat saving the neighborhood",
    "Underwater detective solving mysteries",
    "Space gardener growing alien plants"
  ]

  const toneOptions = [
    { value: 'humorous', label: 'Humorous', icon: '😄', description: 'Funny and light-hearted' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Informative and learning-focused' },
    { value: 'dramatic', label: 'Dramatic', icon: '🎭', description: 'Serious and emotional' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨', description: 'Motivational and uplifting' },
  ]

  const audienceOptions = [
    { value: 'general', label: 'General', icon: Users, description: 'For everyone' },
    { value: 'kids', label: 'Kids', icon: '🧒', description: 'Child-friendly content' },
    { value: 'technical', label: 'Technical', icon: '⚙️', description: 'For tech enthusiasts' },
    { value: 'academic', label: 'Academic', icon: '🎓', description: 'Educational institutions' },
  ]

  const styleOptions = [
    { value: 'modern digital comic', label: 'Modern Digital', preview: 'Sharp, vibrant, contemporary' },
    { value: 'classic comic book', label: 'Classic Comic', preview: 'Retro superhero style' },
    { value: 'manga style', label: 'Manga', preview: 'Japanese anime aesthetic' },
    { value: 'cartoon style', label: 'Cartoon', preview: 'Playful and animated' },
    { value: 'realistic illustration', label: 'Realistic', preview: 'Photorealistic artwork' },
    { value: 'minimalist art', label: 'Minimalist', preview: 'Clean and simple design' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 badge-comic">
          <Brain className="animate-pulse" size={20} />
          <span className="font-comic">AI Comic Studio</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-heading font-black gradient-text">
          Create Your Masterpiece
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your imagination into stunning visual stories with the power of AI. 
          Just describe your idea and watch the magic happen! ✨
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-8">
            {/* Topic Input */}
            <div className="space-y-4">
              <label htmlFor="topic" className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <Lightbulb className="text-yellow-500" size={24} />
                <span>What's your comic about?</span>
                <span className="text-red-500">*</span>
              </label>

              <textarea
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Describe your comic idea in detail... The more creative, the better!"
                className="input-modern min-h-32 resize-none"
                disabled={generateMutation.isPending}
                rows={4}
              />

              {/* Topic Examples */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">💡 Need inspiration? Try these ideas:</p>
                <div className="flex flex-wrap gap-2">
                  {topicExamples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, topic: example }))}
                      className="text-xs px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 rounded-full border border-blue-200 transition-all duration-300 hover:scale-105"
                      disabled={generateMutation.isPending}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <Zap className="text-orange-500" size={24} />
                <span>What's the vibe?</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {toneOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.tone === option.value
                        ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={formData.tone === option.value}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={generateMutation.isPending}
                    />
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Audience & Style Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Target Audience */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                  <Target className="text-green-500" size={24} />
                  <span>Who's your audience?</span>
                </label>

                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="select-modern"
                  disabled={generateMutation.isPending}
                >
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {typeof option.icon === 'string' ? option.icon : ''} {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visual Style */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                  <Palette className="text-purple-500" size={24} />
                  <span>Art style?</span>
                </label>

                <select
                  name="visual_style"
                  value={formData.visual_style}
                  onChange={handleChange}
                  className="select-modern"
                  disabled={generateMutation.isPending}
                >
                  {styleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.preview}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={generateMutation.isPending || !formData.topic.trim()}
              className="w-full btn-primary text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {generateMutation.isPending ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="loading-spinner"></div>
                  <span>Creating your comic masterpiece...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Wand2 size={28} className="group-hover:animate-wiggle" />
                  <span>✨ Generate My Comic! ✨</span>
                </div>
              )}

              {/* Button Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-0 group-hover:opacity-100"></div>
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Process Steps */}
          <div className="card">
            <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
              <Sparkles className="mr-2" size={24} />
              How it works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold">Story Creation</div>
                  <div className="text-sm text-gray-600">AI analyzes your idea and crafts a compelling narrative</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold">Visual Magic</div>
                  <div className="text-sm text-gray-600">Imagen 4 generates stunning comic panels</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold">Ready to Share</div>
                  <div className="text-sm text-gray-600">Download, share, or create variations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
              💡 Pro Tips
            </h3>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Be specific about characters and settings</li>
              <li>• Include emotions and conflicts</li>
              <li>• Think about the story arc</li>
              <li>• Consider your audience</li>
              <li>• Have fun and be creative!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {generateMutation.isPending && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 animate-pulse-slow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-blue-200">
              <div className="loading-spinner"></div>
              <span className="font-semibold text-blue-900 text-lg">AI is working its magic...</span>
            </div>

            {/* Progress Steps */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain size={20} />
                </div>
                <div className="text-sm font-medium text-blue-800">Generating Story</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Palette size={20} />
                </div>
                <div className="text-sm font-medium text-purple-800">Creating Artwork</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles size={20} />
                </div>
                <div className="text-sm font-medium text-green-800">Finalizing Comic</div>
              </div>
            </div>

            <p className="text-blue-700 font-medium">
              This usually takes 1-3 minutes. Grab some coffee! ☕
            </p>

            <div className="flex items-center justify-center space-x-2 bg-white/60 rounded-lg px-4 py-2 inline-flex">
              <Clock size={16} className="text-blue-600" />
              <span className="text-blue-600 font-mono font-bold">
                {Math.floor(elapsedTime / 1000)}s elapsed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComic
