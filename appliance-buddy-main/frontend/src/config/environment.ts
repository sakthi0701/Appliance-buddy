const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || window.location.origin + '/api'
  }
  return 'http://localhost:3001/api'
}

export const API_BASE_URL = getApiBaseUrl()

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}