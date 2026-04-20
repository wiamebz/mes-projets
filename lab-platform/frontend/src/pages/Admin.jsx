import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const C = {
  orange:      '#FF7900',
  orangeDark:  '#E05C00',
  orangeLight: '#FFF3E8',
  black:       '#1A1A1A',
  darkGray:    '#333333',
  midGray:     '#595959',
  lightGray:   '#F4F4F4',
  border:      '#E0E0E0',
  white:       '#FFFFFF',
  bg:          '#F2F2F2',
  ok:          '#2E7D32',
  okLight:     '#E8F5E9',
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ─────────────────────────────────────────
   ICÔNES SVG OUTLINE
───────────────────────────────────────── */
const Icon = {
  Check: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.25 8.25l2 2 3.5-4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: ({ size = 14, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: ({ size = 14, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="5" r="2.25" stroke={color} strokeWidth="1.25"/>
      <path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke={color}
        strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M11 3.5a2 2 0 0 1 0 3.5M13.5 13c0-2-1.3-3.5-3-3.8"
        stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  ChevronRight: ({ size = 12, color = '#BDBDBD' }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ size = 13, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: ({ size = 13, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6.5" cy="6.5" r="4.75" stroke={color} strokeWidth="1.25"/>
      <path d="M10.5 10.5l2.75 2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Export: ({ size = 13, color = C.ok }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 2v8M5 7l3 3 3-3" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h10" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────
   COULEURS AVATAR
───────────────────────────────────────── */
const AVATAR_COLORS = ['#FF7900','#5C6BC0','#26A69A','#EF5350','#AB47BC','#42A5F5']
const avatarColor = i => AVATAR_COLORS[i % AVATAR_COLORS.length]
const initiales = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}

/* ─────────────────────────────────────────
   NAVBAR ADMIN
───────────────────────────────────────── */
function NavbarAdmin({ user, onDeconnexion, onExportMySQL, exportLoading }) {
  const [hovLogout, setHovLogout] = useState(false)
  const [hovExport, setHovExport] = useState(false)

  return (
    <nav style={{
      background: C.white,
      borderBottom: `3px solid ${C.orange}`,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '6px',
          background: C.black, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="white" strokeWidth="2"/>
            <path d="M9 12h6M12 9v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontSize: '15px', fontWeight: '700',
            color: C.black, fontFamily: FONT, letterSpacing: '-0.2px',
          }}>
            Lab<span style={{ color: C.orange }}>Platform</span>
          </div>
          <div style={{
            fontSize: '10px', color: '#9E9E9E', fontWeight: '400',
            marginTop: '2px', fontFamily: FONT,
          }}>
            Administration · Orange
          </div>
        </div>
      </div>

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Bouton Export MySQL */}
        <button
          onClick={onExportMySQL}
          disabled={exportLoading}
          onMouseEnter={() => setHovExport(true)}
          onMouseLeave={() => setHovExport(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '600',
            color: exportLoading ? C.midGray : (hovExport ? '#fff' : C.ok),
            padding: '5px 13px',
            border: `1px solid ${exportLoading ? C.border : C.ok}`,
            borderRadius: '4px',
            background: exportLoading ? C.lightGray : (hovExport ? C.ok : C.okLight),
            cursor: exportLoading ? 'not-allowed' : 'pointer',
            fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <Icon.Export size={13} color={exportLoading ? C.midGray : (hovExport ? '#fff' : C.ok)} />
          {exportLoading ? 'Export...' : 'Export Data'}
        </button>

        {/* Séparateur */}
        <div style={{ width: '1px', height: '22px', background: C.border }} />

        {/* Avatar + Nom */}
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: C.black, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px',
          fontWeight: '700', color: '#fff', fontFamily: FONT,
        }}>
          {initiales(user?.nom)}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color: C.darkGray, fontFamily: FONT }}>
          {user?.nom}
        </span>

        {/* Bouton Déconnexion */}
        <button
          onClick={onDeconnexion}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500',
            color: hovLogout ? C.orange : C.midGray,
            padding: '5px 11px',
            border: `1px solid ${hovLogout ? C.orange : C.border}`,
            borderRadius: '4px', background: 'none',
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <Icon.Logout size={13} color={hovLogout ? C.orange : C.midGray} />
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────── */
function Breadcrumb({ items }) {
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.border}`,
      padding: '9px 32px', display: 'flex',
      alignItems: 'center', gap: '6px',
      fontSize: '12px', fontFamily: FONT,
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && <Icon.ChevronRight />}
          <span style={{
            color: item.onClick ? C.orange : C.black,
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
   STATS ROW
───────────────────────────────────────── */
function StatsRow({ users }) {
  const usersAvecSessions = users.filter(u => u.total_labs > 0)

  const items = [
    { lbl: 'Utilisateurs',        val: users.length,             sub: 'Comptes enregistrés' },
    { lbl: 'Utilisateurs actifs', val: usersAvecSessions.length, sub: 'Apprenants en activité' },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '14px', marginBottom: '26px',
    }}>
      {items.map(it => (
        <div key={it.lbl} style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: '6px', padding: '16px 20px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '3px', background: C.orange,
          }} />
          <div style={{
            fontSize: '11px', fontWeight: '600', color: C.midGray,
            textTransform: 'uppercase', letterSpacing: '0.6px',
            marginBottom: '5px', fontFamily: FONT,
          }}>
            {it.lbl}
          </div>
          <div style={{
            fontSize: '22px', fontWeight: '700', color: C.black,
            fontFamily: FONT, letterSpacing: '-0.3px',
          }}>
            {it.val}
          </div>
          <div style={{ fontSize: '11px', color: C.midGray, marginTop: '3px', fontFamily: FONT }}>
            {it.sub}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   LIGNE TABLEAU USER
───────────────────────────────────────── */
function UserRow({ u, index, formatDate, onDetail }) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${C.border}`,
        background: hovered ? '#FAFAFA' : C.white,
        transition: 'background .1s',
      }}
    >
      {/* Utilisateur */}
      <td style={{ padding: '13px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: avatarColor(index),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0,
          }}>
            {initiales(u.nom)}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: C.black, fontFamily: FONT }}>
            {u.nom}
          </span>
        </div>
      </td>

      {/* Email */}
      <td style={{ padding: '13px 20px', fontSize: '13px', color: C.midGray, fontFamily: FONT }}>
        {u.email}
      </td>

      {/* Dernière connexion */}
      <td style={{ padding: '13px 20px', fontSize: '13px', color: C.midGray, fontFamily: FONT }}>
        {formatDate(u.derniere_connexion)}
      </td>

      {/* Statut */}
      <td style={{ padding: '13px 20px' }}>
        {u.derniere_connexion ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: '700',
            background: C.okLight, color: C.ok,
            padding: '3px 8px', borderRadius: '3px', fontFamily: FONT,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.ok, display: 'inline-block' }} />
            Actif
          </span>
        ) : (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: '700',
            background: C.lightGray, color: C.midGray,
            padding: '3px 8px', borderRadius: '3px', fontFamily: FONT,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.midGray, display: 'inline-block' }} />
            Inactif
          </span>
        )}
      </td>

      {/* Actions */}
      <td style={{ padding: '13px 20px' }}>
        <button
          onClick={onDetail}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '600', padding: '6px 14px',
            borderRadius: '4px',
            border: `1px solid ${hovered ? C.orange : C.border}`,
            background: hovered ? C.orangeLight : 'none',
            color: hovered ? C.orange : C.midGray,
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}
        >
          Voir détails
          <Icon.ArrowRight size={12} color={hovered ? C.orange : C.midGray} />
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
  const navigate                        = useNavigate()

  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { chargerUsers() }, [])

  async function chargerUsers() {
    try {
      const res  = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    } catch (err) { console.log(err) }
  }

  async function exportMySQL() {
    setExportLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/admin/export-mysql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
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
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
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
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>

      <NavbarAdmin
        user={user}
        onDeconnexion={deconnexion}
        onExportMySQL={exportMySQL}
        exportLoading={exportLoading}
      />
      <Breadcrumb items={[{ label: 'Gestion des utilisateurs' }]} />

      <div style={{ padding: '26px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '22px' }}>
          <h1 style={{
            fontSize: '22px', fontWeight: '700', color: C.black,
            letterSpacing: '-0.4px', margin: '0 0 4px 0', fontFamily: FONT,
          }}>
            Gestion des utilisateurs
          </h1>
          <p style={{ fontSize: '13px', color: C.midGray, margin: 0, fontFamily: FONT }}>
            Vue d'ensemble des comptes enregistrés et de leur activité.
          </p>
        </div>

        {loading ? (
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: '6px', padding: '40px',
            textAlign: 'center', color: C.midGray,
            fontSize: '13px', fontFamily: FONT,
          }}>
            Chargement...
          </div>
        ) : (
          <>
            <StatsRow users={users} />

            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '10px', marginBottom: '14px',
            }}>
              <span style={{
                fontSize: '11px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '1px',
                color: C.midGray, fontFamily: FONT,
              }}>
                Liste des utilisateurs
              </span>
              <div style={{ flex: 1, height: '1px', background: C.border }} />
            </div>

            <div style={{
              background: C.white, border: `1px solid ${C.border}`,
              borderRadius: '6px', overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: '16px',
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '13px', fontWeight: '700', color: C.black,
                  fontFamily: FONT, flexShrink: 0,
                }}>
                  <Icon.Users size={15} color={C.midGray} />
                  Utilisateurs enregistrés
                </span>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: C.lightGray, border: `1px solid ${C.border}`,
                  borderRadius: '4px', padding: '7px 12px',
                  width: '280px', flexShrink: 0,
                }}>
                  <Icon.Search size={13} color={C.midGray} />
                  <input
                    type="text"
                    value={recherche}
                    onChange={e => setRecherche(e.target.value)}
                    placeholder="Rechercher par nom ou email..."
                    style={{
                      flex: 1, border: 'none', background: 'transparent',
                      fontSize: '12px', color: C.black,
                      fontFamily: FONT, outline: 'none',
                    }}
                  />
                  {recherche && (
                    <button
                      onClick={() => setRecherche('')}
                      style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        color: C.midGray, fontSize: '16px',
                        lineHeight: 1, padding: 0, flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Utilisateur', 'Email', 'Dernière connexion', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{
                        background: C.lightGray, padding: '10px 20px',
                        fontSize: '11px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        color: C.midGray, textAlign: 'left',
                        borderBottom: `1px solid ${C.border}`, fontFamily: FONT,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersFiltres.length > 0 ? (
                    usersFiltres.map((u, i) => (
                      <UserRow
                        key={u._id}
                        u={u}
                        index={i}
                        formatDate={formatDate}
                        onDetail={() => navigate(`/admin/user/${u._id}`)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{
                        padding: '28px 20px', textAlign: 'center',
                        fontSize: '13px', color: C.midGray, fontFamily: FONT,
                      }}>
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