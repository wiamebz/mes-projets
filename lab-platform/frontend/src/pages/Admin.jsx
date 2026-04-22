import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────
   THÈME — light / dark (admin séparé du user)
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg:          '#111318',
    bgSecond:    '#1A1D24',
    bgCard:      '#1E2128',
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
    navBg:       '#13151B',
    pillBg:      '#2A2D37',
    inputBg:     '#23272F',
    logoIcon:    '#F0F0F0',  // logo cube en clair en dark mode
    logoText:    '#F0F0F0',
    avatarBg:    '#FF7900',
  } : {
    bg:          '#F2F2F2',
    bgSecond:    '#EAEAEA',
    bgCard:      '#FFFFFF',
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
    navBg:       '#FFFFFF',
    pillBg:      '#F4F4F4',
    inputBg:     '#F4F4F4',
    logoIcon:    '#1A1A1A',
    logoText:    '#1A1A1A',
    avatarBg:    '#1A1A1A',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ─────────────────────────────────────────
   ICÔNES SVG
───────────────────────────────────────── */
const Icon = {
  Check: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.25 8.25l2 2 3.5-4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="5" r="2.25" stroke={color} strokeWidth="1.25"/>
      <path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M11 3.5a2 2 0 0 1 0 3.5M13.5 13c0-2-1.3-3.5-3-3.8" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  ChevronRight: ({ size = 12, color = '#BDBDBD' }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6.5" cy="6.5" r="4.75" stroke={color} strokeWidth="1.25"/>
      <path d="M10.5 10.5l2.75 2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Export: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 2v8M5 7l3 3 3-3" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h10" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
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

const AVATAR_COLORS = ['#FF7900','#5C6BC0','#26A69A','#EF5350','#AB47BC','#42A5F5']
const avatarColor = i => AVATAR_COLORS[i % AVATAR_COLORS.length]
const initiales = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}

/* ─────────────────────────────────────────
   NAVBAR ADMIN avec liens + toggle dark
───────────────────────────────────────── */
function NavbarAdmin({ user, onDeconnexion, onExportMySQL, exportLoading, navigate, dark, onToggleDark, T }) {
  const [hovLogout, setHovLogout] = useState(false)
  const [hovExport, setHovExport] = useState(false)
  const [hovTheme, setHovTheme]   = useState(false)
  const [hovLink, setHovLink]     = useState(null)
  const currentPath = window.location.pathname

  const links = [
    { label: 'Utilisateurs', path: '/admin' },
    { label: 'Parcours',     path: '/admin/gestion' },
  ]

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
          <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: T.logoIcon, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="5" width="14" height="14" rx="2" stroke={dark ? '#1A1A1A' : '#FFFFFF'} strokeWidth="2"/>
              <path d="M9 12h6M12 9v6" stroke={dark ? '#1A1A1A' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: T.logoText, fontFamily: FONT, transition: 'color .3s' }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '2px', fontFamily: FONT }}>
              Administration · Orange
            </div>
          </div>
        </div>

        {/* Liens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(link => {
            const isActive = currentPath === link.path
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

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Bouton Export */}
        <button
          onClick={onExportMySQL}
          disabled={exportLoading}
          onMouseEnter={() => setHovExport(true)}
          onMouseLeave={() => setHovExport(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '600',
            color: exportLoading ? T.textMuted : (hovExport ? '#fff' : T.ok),
            padding: '5px 13px',
            border: `1px solid ${exportLoading ? T.border : T.ok}`,
            borderRadius: '4px',
            background: exportLoading ? T.pillBg : (hovExport ? T.ok : T.okLight),
            cursor: exportLoading ? 'not-allowed' : 'pointer',
            fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <Icon.Export size={13} color={exportLoading ? T.textMuted : (hovExport ? '#fff' : T.ok)} />
          {exportLoading ? 'Export...' : 'Export Data'}
        </button>

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
            cursor: 'pointer', transition: 'background .15s', flexShrink: 0,
          }}
        >
          {dark ? <Icon.Sun size={16} color={T.orange} /> : <Icon.Moon size={16} color={T.textSub} />}
        </button>

        <div style={{ width: '1px', height: '22px', background: T.border }} />

        {/* Avatar admin */}
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: T.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', fontFamily: FONT, transition: 'background .3s' }}>
          {initiales(user?.nom)}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color: T.text, fontFamily: FONT }}>{user?.nom}</span>

        {/* Déconnexion */}
        <button onClick={onDeconnexion} onMouseEnter={() => setHovLogout(true)} onMouseLeave={() => setHovLogout(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500',
            color: hovLogout ? T.orange : T.textSub,
            padding: '5px 11px',
            border: `1px solid ${hovLogout ? T.orange : T.border}`,
            borderRadius: '4px', background: 'none',
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}>
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
    <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: '9px 32px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: FONT, transition: 'background .3s, border-color .3s' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && <Icon.ChevronRight color={T.textMuted} />}
          <span style={{ color: item.onClick ? T.orange : T.text, fontWeight: '500', cursor: item.onClick ? 'pointer' : 'default' }} onClick={item.onClick}>
            {item.label}
          </span>
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   STATS ROW
───────────────────────────────────────── */
function StatsRow({ users, T }) {
  const usersAvecSessions = users.filter(u => u.total_labs > 0)
  const items = [
    { lbl: 'Utilisateurs',        val: users.length,             sub: 'Comptes enregistrés' },
    { lbl: 'Utilisateurs actifs', val: usersAvecSessions.length, sub: 'Apprenants en activité' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '26px' }}>
      {items.map(it => (
        <div key={it.lbl} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '16px 20px', position: 'relative', overflow: 'hidden', transition: 'background .3s, border-color .3s' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: T.orange }} />
          <div style={{ fontSize: '11px', fontWeight: '600', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '5px', fontFamily: FONT }}>{it.lbl}</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: T.text, fontFamily: FONT, letterSpacing: '-0.3px' }}>{it.val}</div>
          <div style={{ fontSize: '11px', color: T.textSub, marginTop: '3px', fontFamily: FONT }}>{it.sub}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   LIGNE TABLEAU USER
───────────────────────────────────────── */
function UserRow({ u, index, formatDate, onDetail, T }) {
  const [hovered, setHovered] = useState(false)
  return (
    <tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: `1px solid ${T.border}`, background: hovered ? T.bgRowHover : T.bgCard, transition: 'background .15s' }}>
      <td style={{ padding: '13px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: avatarColor(index), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>
            {initiales(u.nom)}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: T.text, fontFamily: FONT }}>{u.nom}</span>
        </div>
      </td>
      <td style={{ padding: '13px 20px', fontSize: '13px', color: T.textSub, fontFamily: FONT }}>{u.email}</td>
      <td style={{ padding: '13px 20px', fontSize: '13px', color: T.textSub, fontFamily: FONT }}>{formatDate(u.derniere_connexion)}</td>
      <td style={{ padding: '13px 20px' }}>
        {u.derniere_connexion ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', background: T.okLight, color: T.ok, padding: '3px 8px', borderRadius: '3px', fontFamily: FONT }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.ok, display: 'inline-block' }} />
            Actif
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', background: T.pillBg, color: T.textSub, padding: '3px 8px', borderRadius: '3px', fontFamily: FONT }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.textSub, display: 'inline-block' }} />
            Inactif
          </span>
        )}
      </td>
      <td style={{ padding: '13px 20px' }}>
        <button onClick={onDetail}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '4px', border: `1px solid ${hovered ? T.orange : T.border}`, background: hovered ? T.orangeLight : 'none', color: hovered ? T.orange : T.textSub, cursor: 'pointer', fontFamily: FONT, transition: 'all .15s' }}>
          Voir détails
          <Icon.ArrowRight size={12} color={hovered ? T.orange : T.textSub} />
        </button>
      </td>
    </tr>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function Admin() {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [recherche, setRecherche]       = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const [dark, setDark]                 = useState(() => localStorage.getItem('theme_admin') === 'dark')
  const navigate                        = useNavigate()

  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user'))
  const T     = getTheme(dark)

  function toggleDark() {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme_admin', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => { chargerUsers() }, [])

  async function chargerUsers() {
    try {
      const res  = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    } catch (err) { console.log(err) }
  }

  async function exportMySQL() {
    setExportLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/admin/export-mysql', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      alert(`${data.message}\n\nUsers exportés   : ${data.stats.users}\nLabs exportés    : ${data.stats.labs}\nSessions exportées: ${data.stats.sessions}`)
    } catch (err) {
      console.log(err)
      alert('Erreur lors de l\'export !')
    }
    setExportLoading(false)
  }

  function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function deconnexion() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const usersFiltres = users.filter(u =>
    u.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
    u.email?.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <NavbarAdmin
        user={user}
        onDeconnexion={deconnexion}
        onExportMySQL={exportMySQL}
        exportLoading={exportLoading}
        navigate={navigate}
        dark={dark}
        onToggleDark={toggleDark}
        T={T}
      />
      <Breadcrumb items={[{ label: 'Gestion des utilisateurs' }]} T={T} />

      <div style={{ padding: '26px 32px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '22px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: T.text, letterSpacing: '-0.4px', margin: '0 0 4px 0', fontFamily: FONT }}>
            Gestion des utilisateurs
          </h1>
          <p style={{ fontSize: '13px', color: T.textSub, margin: 0, fontFamily: FONT }}>
            Vue d'ensemble des comptes enregistrés et de leur activité.
          </p>
        </div>

        {loading ? (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '40px', textAlign: 'center', color: T.textSub, fontSize: '13px', fontFamily: FONT }}>
            Chargement...
          </div>
        ) : (
          <>
            <StatsRow users={users} T={T} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: T.textMuted, fontFamily: FONT }}>
                Liste des utilisateurs
              </span>
              <div style={{ flex: 1, height: '1px', background: T.border }} />
            </div>

            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', overflow: 'hidden', transition: 'background .3s, border-color .3s' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
                  <Icon.Users size={15} color={T.textSub} />
                  Utilisateurs enregistrés
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: '4px', padding: '7px 12px', width: '280px' }}>
                  <Icon.Search size={13} color={T.textSub} />
                  <input
                    type="text"
                    value={recherche}
                    onChange={e => setRecherche(e.target.value)}
                    placeholder="Rechercher par nom ou email..."
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '12px', color: T.text, fontFamily: FONT, outline: 'none' }}
                  />
                  {recherche && (
                    <button onClick={() => setRecherche('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: T.textSub, fontSize: '16px', lineHeight: 1, padding: 0 }}>
                      ×
                    </button>
                  )}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Utilisateur', 'Email', 'Dernière connexion', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ background: T.bgSecond, padding: '10px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.textMuted, textAlign: 'left', borderBottom: `1px solid ${T.border}`, fontFamily: FONT, transition: 'background .3s' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersFiltres.length > 0 ? (
                    usersFiltres.map((u, i) => (
                      <UserRow key={u._id} u={u} index={i} formatDate={formatDate} onDetail={() => navigate(`/admin/user/${u._id}`)} T={T} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '28px 20px', textAlign: 'center', fontSize: '13px', color: T.textSub, fontFamily: FONT }}>
                        Aucun résultat pour "{recherche}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin