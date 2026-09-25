import apimock from './apimock.js'
import apiclient from './apiClient.js'

// Una sola línea decide qué servicio usa toda la app (VITE_USE_MOCK en .env)
const blueprintsService = import.meta.env.VITE_USE_MOCK === 'true' ? apimock : apiclient

export default blueprintsService
