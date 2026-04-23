import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/logo.png'

/* ─────────────────────────────────────────
   THÈME — light / dark (admin)
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg:          '#111318',
    bgSecond:    '#1A1D24',
    bgCard:      '#1E2128',
    bgAccordion: '#17191F',
    bgRowHover:  '#23272F',
    border:      '#2A2D37',
    text:        '#F0F0F0',
    textSub:     '#9AA0B0',
    textMuted:   '#5A6070',
    orange:      '#FF7900',
    orangeDark:  '#E05C00',
    orangeLight: 'rgba(255,121,0,0.12)',
    ok:          '#4CAF50',
    okLight:     'rgba(76,175,80,0.12)',
    err:         '#EF5350',
    errLight:    'rgba(239,83,80,0.12)',
    navBg:       '#13151B',
    pillBg:      '#2A2D37',
    logoText:    '#F0F0F0',
    avatarBg:    '#FF7900',
    labHeaderBg: '#0E1015',
  } : {
    bg:          '#F2F2F2',
    bgSecond:    '#EAEAEA',
    bgCard:      '#FFFFFF',
    bgAccordion: '#FAFAFA',
    bgRowHover:  '#FAFAFA',
    border:      '#E0E0E0',
    text:        '#1A1A1A',
    textSub:     '#595959',
    textMuted:   '#9E9E9E',
    orange:      '#FF7900',
    orangeDark:  '#E05C00',
    orangeLight: '#FFF3E8',
    ok:          '#2E7D32',
    okLight:     '#E8F5E9',
    err:         '#C62828',
    errLight:    '#FFEBEE',
    navBg:       '#FFFFFF',
    pillBg:      '#F4F4F4',
    logoText:    '#1A1A1A',
    avatarBg:    '#1A1A1A',
    labHeaderBg: '#1A1A1A',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ─────────────────────────────────────────
   ICÔNES SVG
───────────────────────────────────────── */
const Icon = {
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: ({ size = 12, color }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronDown: ({ size = 14, color, rotated = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ flexShrink: 0, transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s ease' }}>
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ArrowRight: ({ size = 13, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: ({ size = 22, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Folder: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3H6l1.5 2H13A1.5 1.5 0 0 1 14.5 6.5v5A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5v-7z"
        stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
  Sun: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.25"/>
      <path d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.4 3.4l.88.88M11.72 11.72l.88.88M11.72 4.28l-.88.88M4.28 11.72l-.88.88" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Moon: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const AVATAR_COLORS = ['#FF7900', '#5C6BC0', '#26A69A', '#EF5350', '#AB47BC', '#42A5F5']
const avatarColor = i => AVATAR_COLORS[i % AVATAR_COLORS.length]
const initiales = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}

function formatTemps(secondes) {
  if (!secondes || secondes < 0) return '—'
  if (secondes < 60) return `${secondes}s`
  return `${Math.floor(secondes / 60)}min ${secondes % 60}s`
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDateCourte(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/* ─────────────────────────────────────────
   NAVBAR ADMIN (avec liens + toggle dark)
───────────────────────────────────────── */
function NavbarAdmin({ user, onDeconnexion, navigate, dark, onToggleDark, T }) {
  const [hovLogout, setHovLogout] = useState(false)
  const [hovTheme, setHovTheme]   = useState(false)
  const [hovLink, setHovLink]     = useState(null)
  const currentPath = window.location.pathname

  const links = [
    { label: 'Utilisateurs', path: '/admin' },
    { label: 'Parcours',     path: '/admin/gestion' },
  ]

  // "Utilisateurs" est considéré actif si on est sur /admin ou /admin/user/*
  const isUsersActive = currentPath === '/admin' || currentPath.startsWith('/admin/user')

  return (
    <nav style={{
      background: T.navBg, borderBottom: `3px solid ${T.orange}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      position: 'sticky', top: 0, zIndex: 200, boxSizing: 'border-box',
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
          <div style={{
            width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <img src={logo} alt="logo" style={{ width: '140%', height: '140%', objectFit: 'contain' }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: T.logoText, fontFamily: FONT, transition: 'color .3s' }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '2px', fontFamily: FONT }}>
              Administration · Learneo
            </div>
          </div>
        </div>

        {/* Liens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(link => {
            const isActive = link.path === '/admin' ? isUsersActive : currentPath === link.path
            const isHov    = hovLink === link.path
            return (
              <button key={link.path} onClick={() => navigate(link.path)}
                onMouseEnter={() => setHovLink(link.path)} onMouseLeave={() => setHovLink(null)}
                style={{
                  fontSize: '13px', fontWeight: isActive ? '700' : '500',
                  color: isActive || isHov ? T.orange : T.text,
                  padding: '8px 14px', border: 'none', borderRadius: '6px',
                  background: isActive ? T.orangeLight : isHov ? T.pillBg : 'transparent',
                  cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
                }}>
                {link.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Toggle dark/light */}
        <button
          onClick={onToggleDark}
          onMouseEnter={() => setHovTheme(true)}
          onMouseLeave={() => setHovTheme(false)}
          title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          style={{
            width: '34px', height: '34px', borderRadius: '50%', border: 'none',
            background: hovTheme ? T.pillBg : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background .15s',
          }}
        >
          {dark ? <Icon.Sun size={16} color={T.orange} /> : <Icon.Moon size={16} color={T.textSub} />}
        </button>

        <div style={{ width: '1px', height: '22px', background: T.border }} />

        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: T.avatarBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff',
          fontFamily: FONT, transition: 'background .3s',
        }}>
          {initiales(user?.nom)}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color: T.text, fontFamily: FONT }}>
          {user?.nom}
        </span>
        <button
          onClick={onDeconnexion}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500',
            color: hovLogout ? T.orange : T.textSub,
            padding: '5px 11px',
            border: `1px solid ${hovLogout ? T.orange : T.border}`,
            borderRadius: '4px', background: 'none',
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <Icon.Logout size={13} color={hovLogout ? T.orange : T.textSub} />
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────── */
function Breadcrumb({ items, T }) {
  return (
    <div style={{
      background: T.navBg, borderBottom: `1px solid ${T.border}`,
      padding: '9px 32px', display: 'flex',
      alignItems: 'center', gap: '6px',
      fontSize: '12px', fontFamily: FONT,
      transition: 'background .3s, border-color .3s',
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && <Icon.ChevronRight color={T.textMuted} />}
          <span style={{
            color: item.onClick ? T.orange : T.text,
            fontWeight: '500',
            cursor: item.onClick ? 'pointer' : 'default',
          }} onClick={item.onClick}>
            {item.label}
          </span>
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD LAB (dans l'accordion admin)
───────────────────────────────────────── */
function LabStatCard({ lab, userId, navigate, T }) {
  const [hovered, setHovered] = useState(false)

  const taux = lab.tauxCompletion ?? 0
  const tauxColor = taux >= 70 ? T.ok : taux >= 40 ? T.orangeDark : taux > 0 ? T.err : T.textSub
  const tauxBg = taux >= 70 ? T.okLight : taux >= 40 ? T.orangeLight : taux > 0 ? T.errLight : T.pillBg

  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: '6px', overflow: 'hidden',
      transition: 'background .3s, border-color .3s',
    }}>
      {/* Header sombre */}
      <div style={{ background: T.labHeaderBg, padding: '13px 16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', fontFamily: FONT, marginBottom: '2px' }}>
          {lab.titre}
        </div>
        <div style={{ fontSize: '11px', color: '#9E9E9E', fontFamily: FONT }}>
          Dernier essai : {formatDateCourte(lab.derniereSession)}
        </div>
      </div>

      {/* Badges + bouton */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700',
          padding: '4px 9px', borderRadius: '4px',
          background: tauxBg, color: tauxColor, fontFamily: FONT,
        }}>
          {lab.etapesTotal > 0 ? `${taux}%` : '—'}
        </span>

        <span style={{
          fontSize: '11px', fontWeight: '600',
          padding: '4px 9px', borderRadius: '4px',
          background: T.pillBg, color: T.text, fontFamily: FONT,
        }}>
          {lab.tentatives} essai{lab.tentatives > 1 ? 's' : ''}
        </span>

        <button
          onClick={() => navigate(`/admin/user/${userId}/lab/${lab._id}`)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: '700',
            padding: '6px 12px', borderRadius: '4px', border: 'none',
            background: hovered ? T.orangeDark : T.orange,
            color: '#fff', cursor: 'pointer',
            fontFamily: FONT, transition: 'background .15s',
          }}
        >
          Voir les essais
          <Icon.ArrowRight size={11} color="#fff" />
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   ACCORDION CATÉGORIE
───────────────────────────────────────── */
function CategorieAccordion({ categorie, userId, navigate, defaultOpen = true, T }) {
  const [ouvert, setOuvert] = useState(defaultOpen)

  const taux = categorie.tauxCategorie ?? 0
  const tauxColor = taux >= 70 ? T.ok : taux > 0 ? T.orange : T.textSub
  const tauxBarre = taux >= 70 ? T.ok : taux > 0 ? T.orange : T.border

  const labsAvecTentatives = categorie.labs.filter(l => l.tentatives > 0)
  const totalLabs = categorie.labs.length

  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: '8px', overflow: 'hidden', marginBottom: '14px',
      transition: 'background .3s, border-color .3s',
    }}>
      <button
        onClick={() => setOuvert(o => !o)}
        style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      >
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
          borderBottom: ouvert ? `1px solid ${T.border}` : 'none',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: T.pillBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon.Folder size={17} color={T.textSub} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: T.text, fontFamily: FONT, marginBottom: '2px' }}>
              {categorie.nom}
            </div>
            <div style={{ fontSize: '11px', color: T.textSub, fontFamily: FONT }}>
              {labsAvecTentatives.length} / {totalLabs} lab{totalLabs > 1 ? 's' : ''} pratiqué{labsAvecTentatives.length > 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <div style={{ width: '130px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', color: T.textMuted, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Avancement
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: tauxColor, fontFamily: FONT }}>
                  {taux}%
                </span>
              </div>
              <div style={{ height: '4px', background: T.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  background: tauxBarre, width: `${taux}%`,
                  transition: 'width .5s ease',
                }} />
              </div>
            </div>
            <Icon.ChevronDown size={16} color={T.textSub} rotated={ouvert} />
          </div>
        </div>
      </button>

      <div style={{ maxHeight: ouvert ? '2000px' : '0', overflow: 'hidden', transition: 'max-height .35s ease' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px', padding: '16px 20px',
          background: T.bgAccordion,
          transition: 'background .3s',
        }}>
          {categorie.labs.map(lab => (
            <LabStatCard
              key={lab._id}
              lab={lab}
              userId={userId}
              navigate={navigate}
              T={T}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function AdminUserDetail() {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark]       = useState(() => localStorage.getItem('theme_admin') === 'dark')
  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const admin = JSON.parse(localStorage.getItem('user'))
  const T     = getTheme(dark)

  function toggleDark() {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme_admin', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => { chargerDetails() }, [])

  async function chargerDetails() {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDetails(data)
      setLoading(false)
    } catch (err) { console.log(err) }
  }

  function deconnexion() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: T.textSub, fontFamily: FONT, fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  const totalSessions = details.sessions.length
  const totalReussites = details.sessions.filter(s => s.reussi).length
  const tempsMoyenGlobal = totalSessions > 0
    ? Math.round(details.sessions.reduce((a, s) => a + (s.temps_passe || 0), 0) / totalSessions)
    : 0

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <NavbarAdmin
        user={admin}
        onDeconnexion={deconnexion}
        navigate={navigate}
        dark={dark}
        onToggleDark={toggleDark}
        T={T}
      />
      <Breadcrumb items={[
        { label: 'Utilisateurs', onClick: () => navigate('/admin') },
        { label: details.user.nom },
      ]} T={T} />

      <div style={{ padding: '26px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Hero utilisateur */}
        <div style={{
          background: T.bgCard, border: `1px solid ${T.border}`,
          borderRadius: '6px', padding: '22px 26px',
          display: 'flex', alignItems: 'center',
          gap: '20px', marginBottom: '24px',
          transition: 'background .3s, border-color .3s',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: avatarColor(0), display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon.User size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: T.text, margin: '0 0 3px 0', fontFamily: FONT }}>
              {details.user.nom}
            </h2>
            <p style={{ fontSize: '13px', color: T.textSub, margin: '0 0 2px 0', fontFamily: FONT }}>
              {details.user.email}
            </p>
            <span style={{ fontSize: '11px', color: T.textMuted, fontFamily: FONT }}>
              Membre depuis le {formatDate(details.user.createdAt)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
            {[
              { val: `${totalReussites} / ${totalSessions}`, lbl: 'Réussies', color: T.ok },
              { val: formatTemps(tempsMoyenGlobal), lbl: 'Temps moyen', color: T.text },
            ].map(kpi => (
              <div key={kpi.lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: kpi.color, fontFamily: FONT, letterSpacing: '-0.3px' }}>
                  {kpi.val}
                </div>
                <div style={{ fontSize: '10px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT, marginTop: '2px' }}>
                  {kpi.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: T.textMuted, fontFamily: FONT }}>
            Progression par catégorie
          </span>
          <div style={{ flex: 1, height: '1px', background: T.border }} />
        </div>

        {/* Accordions */}
        {details.categories && details.categories.length > 0 ? (
          details.categories.map((cat, i) => (
            <CategorieAccordion
              key={cat.nom}
              categorie={cat}
              userId={id}
              navigate={navigate}
              defaultOpen={i === 0}
              T={T}
            />
          ))
        ) : (
          <div style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: '6px', padding: '32px',
            textAlign: 'center', color: T.textSub, fontSize: '13px', fontFamily: FONT,
          }}>
            Aucune session enregistrée pour cet utilisateur.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUserDetail