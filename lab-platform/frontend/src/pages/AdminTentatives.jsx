import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../img/logo.png'

/* ─────────────────────────────────────────
   THÈME — light / dark (admin séparé du user)
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg: '#111318',
    bgCard: '#1E2128',
    bgSecond: '#1A1D24',
    bgRowHov: '#252830',
    border: '#2A2D37',
    borderOk: '#2E5C31',
    borderErr: '#5C2626',
    text: '#F0F0F0',
    textSub: '#9AA0B0',
    textMuted: '#5A6070',
    orange: '#FF7900',
    orangeDark: '#E05C00',
    orangeLight: 'rgba(255,121,0,0.12)',
    ok: '#4CAF50',
    okLight: 'rgba(76,175,80,0.1)',
    err: '#EF5350',
    errLight: 'rgba(239,83,80,0.1)',
    navBg: '#13151B',
    pillBg: '#2A2D37',
    avatarBg: '#FF7900',
    etapeOkBg: 'rgba(76,175,80,0.08)',
    etapeErrBg: 'rgba(239,83,80,0.08)',
    monoBg: 'rgba(255,255,255,0.06)',
    heroBg: '#1A1D24',
  } : {
    bg: '#F2F2F2',
    bgCard: '#FFFFFF',
    bgSecond: '#FAFAFA',
    bgRowHov: '#F5F5F5',
    border: '#E0E0E0',
    borderOk: '#A5D6A7',
    borderErr: '#EF9A9A',
    text: '#1A1A1A',
    textSub: '#595959',
    textMuted: '#9E9E9E',
    orange: '#FF7900',
    orangeDark: '#E05C00',
    orangeLight: '#FFF3E8',
    ok: '#2E7D32',
    okLight: '#E8F5E9',
    err: '#C62828',
    errLight: '#FFEBEE',
    navBg: '#FFFFFF',
    pillBg: '#F4F4F4',
    avatarBg: '#1A1A1A',
    etapeOkBg: 'rgba(46,125,50,0.06)',
    etapeErrBg: 'rgba(198,40,40,0.06)',
    monoBg: 'rgba(0,0,0,0.04)',
    heroBg: '#FFFFFF',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', 'Fira Code', 'Courier New', monospace"

/* ─────────────────────────────────────────
   ICÔNES SVG OUTLINE
───────────────────────────────────────── */
const Icon = {
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: ({ size = 12, color }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25" />
      <path d="M8 4.75V8l2.25 1.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Sun: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.25" />
      <path d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.4 3.4l.88.88M11.72 11.72l.88.88M11.72 4.28l-.88.88M4.28 11.72l-.88.88"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Moon: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Users: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="5" r="2.25" stroke={color} strokeWidth="1.25" />
      <path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M11 3.5a2 2 0 0 1 0 3.5M13.5 13c0-2-1.3-3.5-3-3.8"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Layers: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 5.5L8 2.5L14 5.5L8 8.5L2 5.5Z"
        stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M2 10.5L8 13.5L14 10.5"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 8L8 11L14 8"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   NAVBAR ADMIN
───────────────────────────────────────── */
function NavbarAdmin({ user, dark, onToggleDark, onDeconnexion, T, navigate }) {
  const [hovLogout, setHovLogout] = useState(false)
  const [hovTheme, setHovTheme] = useState(false)
  const currentPath = window.location.pathname

  const navLinks = [
    { label: 'Utilisateurs', path: '/admin' },
    { label: 'Parcours', path: '/admin/gestion' },
  ]

  return (
    <nav style={{
      background: T.navBg,
      borderBottom: `3px solid ${T.orange}`,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box',
      transition: 'background .3s',
    }}>
      {/* Logo + Liens */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src={logo} alt="logo" style={{ width: '140%', height: '140%', objectFit: 'contain' }} />
          </div>
          {/* <div style={{
            width: '34px', height: '34px', borderRadius: '6px',
            background: dark ? '#F0F0F0' : '#1A1A1A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'background .3s',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="5" width="14" height="14" rx="2"
                stroke={dark ? '#1A1A1A' : 'white'} strokeWidth="2"/>
              <path d="M9 12h6M12 9v6"
                stroke={dark ? '#1A1A1A' : 'white'} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div> */}
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontSize: '15px', fontWeight: '700',
              color: T.text, fontFamily: FONT, letterSpacing: '-0.2px',
              transition: 'color .3s',
            }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{
              fontSize: '10px', color: T.textMuted,
              fontWeight: '400', marginTop: '2px', fontFamily: FONT,
              transition: 'color .3s',
            }}>
              Administration · Learneo
            </div>
          </div>
        </div>

        {/* Liens nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {navLinks.map(link => {
            const isActive = currentPath === link.path ||
              (link.path === '/admin' && currentPath.startsWith('/admin/user'))
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? T.orange : T.textSub,
                  padding: '7px 14px',
                  border: 'none',
                  borderRadius: '6px',
                  background: isActive ? T.orangeLight : 'transparent',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  transition: 'all .15s',
                }}
              >
                {link.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Toggle dark/light */}
        <button
          onClick={onToggleDark}
          onMouseEnter={() => setHovTheme(true)}
          onMouseLeave={() => setHovTheme(false)}
          title={dark ? 'Mode clair' : 'Mode sombre'}
          style={{
            width: '34px', height: '34px', borderRadius: '50%', border: 'none',
            background: hovTheme ? T.pillBg : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background .15s', flexShrink: 0,
          }}
        >
          {dark
            ? <Icon.Sun size={16} color={T.orange} />
            : <Icon.Moon size={16} color={T.textSub} />
          }
        </button>

        <div style={{ width: '1px', height: '20px', background: T.border }} />

        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: T.avatarBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '700', color: '#fff', fontFamily: FONT,
          transition: 'background .3s',
        }}>
          {initiales(user?.nom)}
        </div>
        <span style={{
          fontSize: '13px', fontWeight: '500',
          color: T.text, fontFamily: FONT, transition: 'color .3s',
        }}>
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
      background: T.navBg,
      borderBottom: `1px solid ${T.border}`,
      padding: '9px 32px', display: 'flex',
      alignItems: 'center', gap: '6px',
      fontSize: '12px', fontFamily: FONT,
      transition: 'background .3s, border-color .3s',
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && <Icon.ChevronRight size={12} color={T.textMuted} />}
          <span
            style={{
              color: item.onClick ? T.orange : T.text,
              fontWeight: '500',
              cursor: item.onClick ? 'pointer' : 'default',
              transition: 'color .3s',
            }}
            onClick={item.onClick}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD TENTATIVE
───────────────────────────────────────── */
function TentativeCard({ session, index, total, T }) {
  const reussi = session.reussi
  const etapes = session.etapes || []
  const numero = total - index

  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${reussi ? T.borderOk : T.border}`,
      borderRadius: '6px', overflow: 'hidden',
      transition: 'background .3s, border-color .3s',
    }}>
      {/* Barre top colorée */}
      <div style={{
        height: '3px',
        background: reussi ? T.ok : T.border,
        transition: 'background .3s',
      }} />

      {/* Header tentative */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '14px 20px',
        borderBottom: etapes.length > 0 ? `1px solid ${T.border}` : 'none',
        background: reussi
          ? (T.bgCard === '#FFFFFF' ? '#FAFFFE' : 'rgba(76,175,80,0.04)')
          : T.bgCard,
        transition: 'background .3s, border-color .3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Numéro tentative */}
          <span style={{
            fontSize: '11px', fontWeight: '700', padding: '3px 10px',
            borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.4px',
            background: T.pillBg, color: T.text, fontFamily: FONT,
            transition: 'background .3s, color .3s',
          }}>
            Tentative {numero}
          </span>

          {/* Date */}
          <span style={{
            fontSize: '12px', color: T.textSub,
            fontFamily: FONT, transition: 'color .3s',
          }}>
            {formatDate(session.date_connexion)}
          </span>

          {/* Durée */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon.Clock size={12} color={T.textMuted} />
            <span style={{
              fontSize: '12px', color: T.textSub,
              fontFamily: FONT, transition: 'color .3s',
            }}>
              {formatTemps(session.temps_passe)}
            </span>
          </div>
        </div>

        {/* Badge résultat */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', fontWeight: '700',
          background: reussi ? T.okLight : T.errLight,
          color: reussi ? T.ok : T.err,
          padding: '4px 10px', borderRadius: '3px', fontFamily: FONT,
          transition: 'background .3s, color .3s',
        }}>
          {reussi ? 'Réussi' : 'Échoué'}
        </span>
      </div>

      {/* Détail des étapes */}
      {etapes.length > 0 && (
        <div style={{
          padding: '14px 20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {etapes.map((etape, j) => (
            <div key={j} style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', padding: '10px 14px',
              background: etape.completee ? T.etapeOkBg : T.etapeErrBg,
              border: `1px solid ${etape.completee ? T.borderOk : T.borderErr}`,
              borderRadius: '4px',
              transition: 'background .3s, border-color .3s',
            }}>
              {/* Numéro étape */}
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: etape.completee ? T.ok : T.err,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0,
              }}>
                {j + 1}
              </div>

              {/* Nom + description */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px', fontWeight: '700',
                  color: etape.completee ? T.ok : T.err,
                  fontFamily: FONT, marginBottom: '3px',
                  textTransform: 'capitalize',
                  transition: 'color .3s',
                }}>
                  {etape.nom.replace(/_/g, ' ')}
                </div>
                <span style={{
                  fontSize: '11px',
                  color: etape.completee ? T.ok : T.err,
                  fontFamily: MONO, opacity: 0.9,
                  background: T.monoBg,
                  padding: '2px 6px', borderRadius: '3px',
                  display: 'inline-block',
                  transition: 'color .3s, background .3s',
                }}>
                  {etape.description}
                </span>
              </div>

              {/* Temps étape */}
              <span style={{
                fontSize: '11px', color: T.textMuted,
                fontFamily: FONT, whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color .3s',
              }}>
                {formatTemps(etape.temps)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function AdminTentatives() {
  const [sessions, setSessions] = useState([])
  const [user, setUser] = useState(null)
  const [labTitre, setLabTitre] = useState('')
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme_admin')
    return saved ? saved === 'dark' : false
  })

  const navigate = useNavigate()
  const { id, labId } = useParams()
  const token = localStorage.getItem('token')
  const admin = JSON.parse(localStorage.getItem('user'))
  const T = getTheme(dark)

  function toggleDark() {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme_admin', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data.user)

      const filtrees = data.sessions.filter(
        s => s.lab_id?._id === labId || s.lab_id === labId
      )
      setSessions(filtrees)

      if (filtrees.length > 0) {
        setLabTitre(filtrees[0].lab_id?.titre || 'Lab')
      }
      setLoading(false)
    } catch (err) { console.log(err) }
  }

  function deconnexion() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .3s',
    }}>
      <p style={{ color: T.textSub, fontFamily: FONT, fontSize: '14px' }}>
        Chargement...
      </p>
    </div>
  )

  /* Stats rapides */
  const reussites = sessions.filter(s => s.reussi).length
  const taux = sessions.length > 0
    ? Math.round((reussites / sessions.length) * 100) : 0
  const tempsMoyen = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + (s.temps_passe || 0), 0) / sessions.length) : 0

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      fontFamily: FONT, transition: 'background .3s',
    }}>

      <NavbarAdmin
        user={admin}
        dark={dark}
        onToggleDark={toggleDark}
        onDeconnexion={deconnexion}
        T={T}
        navigate={navigate}
      />
      <Breadcrumb
        items={[
          { label: 'Utilisateurs', onClick: () => navigate('/admin') },
          { label: user?.nom, onClick: () => navigate(`/admin/user/${id}`) },
          { label: labTitre },
        ]}
        T={T}
      />

      <div style={{ padding: '26px 32px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Hero lab + stats */}
        <div style={{
          background: T.heroBg,
          border: `1px solid ${T.border}`,
          borderRadius: '6px', padding: '20px 26px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '22px',
          transition: 'background .3s, border-color .3s',
        }}>
          <div>
            <h1 style={{
              fontSize: '18px', fontWeight: '700', color: T.text,
              margin: '0 0 4px 0', fontFamily: FONT, letterSpacing: '-0.3px',
              transition: 'color .3s',
            }}>
              {labTitre}
            </h1>
            <p style={{
              fontSize: '13px', color: T.textSub,
              margin: 0, fontFamily: FONT, transition: 'color .3s',
            }}>
              Tentatives de{' '}
              <strong style={{ color: T.text }}>{user?.nom}</strong>
              {' '}· {sessions.length} tentative{sessions.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { val: reussites, lbl: 'Réussies', color: T.ok },
              {
                val: `${taux}%`,
                lbl: 'Taux',
                color: taux >= 70 ? T.ok : taux >= 40 ? T.orange : T.err,
              },
              { val: formatTemps(tempsMoyen), lbl: 'Temps moy.', color: T.text },
            ].map(kpi => (
              <div key={kpi.lbl} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px', fontWeight: '700',
                  color: kpi.color, fontFamily: FONT, letterSpacing: '-0.3px',
                  transition: 'color .3s',
                }}>
                  {kpi.val}
                </div>
                <div style={{
                  fontSize: '10px', color: T.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  fontFamily: FONT, marginTop: '2px', transition: 'color .3s',
                }}>
                  {kpi.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', marginBottom: '14px',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '1px',
            color: T.textMuted, fontFamily: FONT, transition: 'color .3s',
          }}>
            Historique des tentatives
          </span>
          <div style={{
            flex: 1, height: '1px',
            background: T.border, transition: 'background .3s',
          }} />
        </div>

        {/* Liste tentatives */}
        {sessions.length === 0 ? (
          <div style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: '6px', padding: '40px',
            textAlign: 'center',
            transition: 'background .3s, border-color .3s',
          }}>
            <p style={{ color: T.textMuted, fontFamily: FONT, fontSize: '13px', margin: 0 }}>
              Aucune tentative enregistrée pour ce lab.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((session, i) => (
              <TentativeCard
                key={i}
                session={session}
                index={i}
                total={sessions.length}
                T={T}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminTentatives