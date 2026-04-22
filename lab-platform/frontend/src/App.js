import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Labs from './pages/Labs'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AdminRoute from './components/AdminRoute'
import AdminUserDetail from './pages/AdminUserDetail'
import AdminTentatives from './pages/AdminTentatives'
import AdminGestion from './pages/AdminGestion'   // ← AJOUT
import HomePage from './pages/HomePage'
import Profil from './pages/Profil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* User */}
        <Route path="/"       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/labs"   element={<ProtectedRoute><Labs /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"                     element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/gestion"             element={<AdminRoute><AdminGestion /></AdminRoute>} />   {/* ← AJOUT */}
        <Route path="/admin/user/:id"            element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
        <Route path="/admin/user/:id/lab/:labId" element={<AdminRoute><AdminTentatives /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={
          <Navigate to={
            JSON.parse(localStorage.getItem('user'))?.role === 'admin'
              ? '/admin'
              : '/'
          } replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App