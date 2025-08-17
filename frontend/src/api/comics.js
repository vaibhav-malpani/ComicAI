import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 minutes for comic generation
})

export const generateComic = async (data) => {
  const response = await api.post('/comics/generate', data)
  return response.data
}

export const generateBatchComics = async (data) => {
  const response = await api.post('/comics/generate/batch', data)
  return response.data
}

export const getBatchStatus = async (taskId) => {
  const response = await api.get(`/comics/batch/${taskId}`)
  return response.data
}

export const getComics = async () => {
  const response = await api.get('/comics')
  return response.data
}

export const getComic = async (id) => {
  const response = await api.get(`/comics/${id}`)
  return response.data
}

export const getComicScript = async (id) => {
  const response = await api.get(`/comics/${id}/script`)
  return response.data
}

// Video generation API functions
export const generateVideo = async (comicId) => {
  const response = await api.post(`/comics/${comicId}/generate-video`)
  return response.data
}
