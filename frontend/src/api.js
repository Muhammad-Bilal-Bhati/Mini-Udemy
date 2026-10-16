import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mini-udemy-nxp3.onrender.com',
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

async function request(method, path, data) {
  try {
    const response = await apiClient({ method, url: path, data })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Backend response timed out. Make sure the server and MongoDB are running.')
    }
    if (!error.response) {
      throw new Error('Cannot connect to the backend at https://mini-udemy-nxp3.onrender.com.')
    }
    throw new Error(error.response.data?.message || 'Something went wrong')
  }
}

export const api = {
  getCourses: (query = '') => request('GET', `/api/courses${query}`),
  getCourse: (courseId) => request('GET', `/api/courses/${courseId}`),
  signIn: (payload) => request('POST', '/api/signin', payload),
  signUp: (payload) => request('POST', '/api/signup', payload),
  createCourse: (payload) => request('POST', '/api/createCourse', payload),
  addChapter: (courseId, payload) => request('POST', `/api/courses/${courseId}/chapters`, payload),
  enroll: (courseId) => request('POST', `/api/enroll/${courseId}`),
  review: (courseId, payload) => request('POST', `/api/courses/${courseId}/reviews`, payload),
}
