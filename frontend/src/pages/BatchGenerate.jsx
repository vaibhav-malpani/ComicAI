import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus, Minus, Zap, Loader, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateBatchComics, getBatchStatus } from '../api/comics'

const BatchGenerate = () => {
  const [topics, setTopics] = useState([''])
  const [settings, setSettings] = useState({
    tone: 'humorous',
    visual_style: 'modern digital comic'
  })
  const [taskId, setTaskId] = useState(null)

  const batchMutation = useMutation({
    mutationFn: generateBatchComics,
    onSuccess: (data) => {
      setTaskId(data.task_id)
      toast.success('Batch generation started!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to start batch generation')
    }
  })

  const { data: batchStatus } = useQuery({
    queryKey: ['batch-status', taskId],
    queryFn: () => getBatchStatus(taskId),
    enabled: !!taskId,
    refetchInterval: taskId && ['started', 'in_progress'].includes(batchStatus?.status) ? 2000 : false,
  })

  const addTopic = () => {
    setTopics([...topics, ''])
  }

  const removeTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index))
  }

  const updateTopic = (index, value) => {
    const newTopics = [...topics]
    newTopics[index] = value
    setTopics(newTopics)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validTopics = topics.filter(topic => topic.trim())

    if (validTopics.length === 0) {
      toast.error('Please enter at least one topic')
      return
    }

    batchMutation.mutate({
      topics: validTopics,
      ...settings
    })
  }

  const resetForm = () => {
    setTaskId(null)
    setTopics([''])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Batch Generate Comics</h1>
        <p className="text-lg text-gray-600">
          Create multiple comics at once by providing multiple topics
        </p>
      </div>

      {!taskId ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Topics</h2>

            <div className="space-y-3">
              {topics.map((topic, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder={`Topic ${index + 1} (e.g., "Space adventure", "Time travel mystery")`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={batchMutation.isPending}
                  />

                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={batchMutation.isPending}
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTopic}
              className="mt-4 flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
              disabled={batchMutation.isPending}
            >
              <Plus size={16} />
              <span>Add Topic</span>
            </button>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Settings</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={settings.tone}
                  onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={batchMutation.isPending}
                >
                  <option value="humorous">Humorous</option>
                  <option value="educational">Educational</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visual Style
                </label>
                <select
                  value={settings.visual_style}
                  onChange={(e) => setSettings(prev => ({ ...prev, visual_style: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={batchMutation.isPending}
                >
                  <option value="modern digital comic">Modern Digital Comic</option>
                  <option value="classic comic book">Classic Comic Book</option>
                  <option value="manga style">Manga Style</option>
                  <option value="cartoon style">Cartoon Style</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={batchMutation.isPending || topics.filter(t => t.trim()).length === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {batchMutation.isPending ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Starting Batch Generation...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Generate {topics.filter(t => t.trim()).length} Comics</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Batch Generation Status</h2>

            {batchStatus && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {batchStatus.status === 'completed' ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : batchStatus.status === 'failed' ? (
                    <XCircle className="text-red-500" size={24} />
                  ) : (
                    <Loader className="animate-spin text-blue-500" size={24} />
                  )}

                  <div>
                    <p className="font-semibold capitalize">{batchStatus.status}</p>
                    <p className="text-sm text-gray-600">
                      {batchStatus.completed} of {batchStatus.total} comics completed
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(batchStatus.completed / batchStatus.total) * 100}%` }}
                  />
                </div>

                {batchStatus.status === 'completed' && batchStatus.comics && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Generated Comics:</h3>
                    <div className="grid gap-3">
                      {batchStatus.comics.map((comic, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{comic.title}</p>
                            <p className="text-sm text-gray-600">{comic.comic_id}</p>
                          </div>
                          <a
                            href={`/comic/${comic.comic_id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            View Comic
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {batchStatus.status === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                      Batch generation failed: {batchStatus.error}
                    </p>
                  </div>
                )}

                {(['completed', 'failed'].includes(batchStatus.status)) && (
                  <button
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Generate New Batch
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchGenerate
