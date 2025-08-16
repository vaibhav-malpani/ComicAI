import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Wand2, Loader } from 'lucide-react'
import { generateComic } from '../api/comics'

const CreateComic = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'humorous',
    target_audience: 'general',
    visual_style: 'modern digital comic'
  })

  const generateMutation = useMutation({
    mutationFn: generateComic,
    onSuccess: (data) => {
      toast.success('Comic generated successfully!')
      navigate(`/comic/${data.comic_id}`)
    },
    onError: (error) => {
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Comic</h1>
        <p className="text-lg text-gray-600">
          Enter a topic and let AI create an amazing comic for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Comic Topic *
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., 'A robot learning to paint', 'Climate change superhero', 'Medieval cooking adventure'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={generateMutation.isPending}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={generateMutation.isPending}
            >
              <option value="humorous">Humorous</option>
              <option value="educational">Educational</option>
              <option value="dramatic">Dramatic</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <div>
            <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={generateMutation.isPending}
            >
              <option value="general">General</option>
              <option value="kids">Kids</option>
              <option value="technical">Technical</option>
              <option value="academic">Academic</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="visual_style" className="block text-sm font-medium text-gray-700 mb-2">
            Visual Style
          </label>
          <select
            id="visual_style"
            name="visual_style"
            value={formData.visual_style}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={generateMutation.isPending}
          >
            <option value="modern digital comic">Modern Digital Comic</option>
            <option value="classic comic book">Classic Comic Book</option>
            <option value="manga style">Manga Style</option>
            <option value="cartoon style">Cartoon Style</option>
            <option value="realistic illustration">Realistic Illustration</option>
            <option value="minimalist art">Minimalist Art</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={generateMutation.isPending}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {generateMutation.isPending ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Generating Comic...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Comic</span>
            </>
          )}
        </button>
      </form>

      {generateMutation.isPending && (
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner"></div>
            <div>
              <p className="font-medium text-blue-900">Creating your comic...</p>
              <p className="text-sm text-blue-700">
                This may take a few minutes as we generate the script and artwork.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComic
