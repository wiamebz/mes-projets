import axios from 'axios'
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

/* ─────────────────────────────────────────
   INTERCEPTEUR DE REQUÊTE Ajoute automatiquement le token JWT dans le header Authorization
───────────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* ─────────────────────────────────────────
   INTERCEPTEUR DE RÉPONSE
   _ Si le serveur répond 401 (token expiré ou invalide), on déconnecte l'utilisateur automatiquement et on redirige 
   vers /login
   _ Sauf si on est déjà sur /login (évite une boucle infinie)
───────────────────────────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api