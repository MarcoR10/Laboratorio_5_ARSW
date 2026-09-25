import axios from 'axios'

// Por defecto /api va por el proxy de Vite (ver vite.config.js), así no hay líos de CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
// El login del backend vive en /auth/login, por fuera de /api
const AUTH_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/auth/login`

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Dejamos un mensaje legible para que el slice lo muestre tal cual
    if (!err.response) {
      err.message = 'No se pudo conectar con el backend'
    } else if (err.response.status === 401) {
      localStorage.removeItem('token')
      err.message = 'No has iniciado sesión o el token venció'
    } else if (err.response.data?.message) {
      err.message = err.response.data.message
    }
    return Promise.reject(err)
  },
)

export async function login(username, password) {
  const { data } = await axios.post(AUTH_URL, { username, password })
  localStorage.setItem('token', data.access_token)
  return data
}

// El backend responde { code, message, data }, aquí nos quedamos solo con data
const unwrap = (res) => res.data.data
const bpPath = (...parts) => ['/v1/blueprints', ...parts.map(encodeURIComponent)].join('/')

// Servicio real: misma interfaz que apimock
const apiclient = {
  getAll() {
    return http.get(bpPath()).then(unwrap)
  },

  async getByAuthor(author) {
    try {
      return await http.get(bpPath(author)).then(unwrap)
    } catch (err) {
      // El backend da 404 si el autor no tiene planos; el mock devuelve lista vacía
      if (err.response?.status === 404) return []
      throw err
    }
  },

  getByAuthorAndName(author, name) {
    return http.get(bpPath(author, name)).then(unwrap)
  },

  create(blueprint) {
    return http.post(bpPath(), blueprint).then(unwrap)
  },
}

export default apiclient
