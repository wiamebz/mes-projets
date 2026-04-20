import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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
  okBorder:    '#A5D6A7',
  err:         '#C62828',
  errLight:    '#FFEBEE',
  errBorder:   '#EF9A9A',
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', 'Fira Code', 'Courier New', monospace"

/* ─────────────────────────────────────────
   ICÔNES SVG OUTLINE
───────────────────────────────────────── */
const Icon = {
  Logout: ({ size = 14, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: ({ size = 13, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M13 8H3M7 4l-4 4 4 4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: ({ size = 12, color = '#BDBDBD' }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clock: ({ size = 13, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M8 4.75V8l2.25 1.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CheckCircle: ({ size = 13, color = C.ok }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.25 8.25l2 2 3.5-4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  XCircle: ({ size = 13, color = C.err }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round"/>
    </svg>
  ),
  List: ({ size = 14, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 4.5h10M3 8h10M3 11.5h6" stroke={color} strokeWidth="1.25"
        strokeLinecap="round"/>
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
function NavbarAdmin({ user, onDeconnexion }) {
  const [hovLogout, setHovLogout] = useState(false)

  return (
    <nav style={{
      background: C.white, borderBottom: `3px solid ${C.orange}`,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box',
    }}>
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
          <div style={{ fontSize: '15px', fontWeight: '700', color: C.black, fontFamily: FONT }}>
            Lab<span style={{ color: C.orange }}>Platform</span>
          </div>
          <div style={{ fontSize: '10px', color: '#9E9E9E', fontWeight: '400', marginTop: '2px', fontFamily: FONT }}>
            Administration · Learneo
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: C.black, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff',
        }}>
          {initiales(user?.nom)}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color: C.darkGray, fontFamily: FONT }}>
          {user?.nom}
        </span>
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
   CARD TENTATIVE
───────────────────────────────────────── */
function TentativeCard({ session, index, total }) {
  const reussi      = session.reussi
  const etapes      = session.etapes || []
  const etapesOk    = etapes.filter(e => e.completee).length
  const etapesTotal = etapes.length
  const numero      = total - index

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${reussi ? C.okBorder : C.border}`,
      borderRadius: '6px', overflow: 'hidden',
    }}>
      {/* Barre top colorée */}
      <div style={{ height: '3px', background: reussi ? C.ok : C.border }} />

      {/* Header tentative */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '14px 20px',
        borderBottom: etapes.length > 0 ? `1px solid ${C.border}` : 'none',
        background: reussi ? '#FAFFFE' : C.white,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Numéro tentative */}
          <span style={{
            fontSize: '11px', fontWeight: '700', padding: '3px 10px',
            borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.4px',
            background: C.darkGray, color: '#fff', fontFamily: FONT,
          }}>
            Tentative {numero}
          </span>

          {/* Date */}
          <span style={{ fontSize: '12px', color: C.midGray, fontFamily: FONT }}>
            {formatDate(session.date_connexion)}
          </span>

          {/* Durée */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon.Clock size={12} color={C.midGray} />
            <span style={{ fontSize: '12px', color: C.midGray, fontFamily: FONT }}>
              {formatTemps(session.temps_passe)}
            </span>
          </div>

          {/* Étapes */}
          {/* {etapesTotal > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon.List size={12} color={C.midGray} />
              <span style={{ fontSize: '12px', color: C.midGray, fontFamily: FONT }}>
                {etapesOk} / {etapesTotal} étapes
              </span>
            </div>
          )} */}
        </div>

        {/* Badge résultat */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', fontWeight: '700',
          background: reussi ? C.okLight : C.errLight,
          color: reussi ? C.ok : C.err,
          padding: '4px 10px', borderRadius: '3px', fontFamily: FONT,
        }}>
          {/* {reussi
            ? <Icon.CheckCircle size={12} color={C.ok} />
            : <Icon.XCircle size={12} color={C.err} />
          } */}
          {reussi ? 'Réussi' : 'Échoué'}
        </span>
      </div>

      {/* Détail des étapes */}
      {etapes.length > 0 && (
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {etapes.map((etape, j) => (
            <div key={j} style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', padding: '10px 14px',
              background: etape.completee ? C.okLight : C.errLight,
              border: `1px solid ${etape.completee ? C.okBorder : C.errBorder}`,
              borderRadius: '4px',
            }}>
              {/* Numéro étape */}
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: etape.completee ? C.ok : C.err,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0,
              }}>
                {j + 1}
              </div>

              {/* Nom + description */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px', fontWeight: '700',
                  color: etape.completee ? C.ok : C.err,
                  fontFamily: FONT, marginBottom: '3px',
                  textTransform: 'capitalize',
                }}>
                  {etape.nom.replace(/_/g, ' ')}
                </div>
                <span style={{
                  fontSize: '11px', color: etape.completee ? C.ok : C.err,
                  fontFamily: MONO, opacity: 0.85,
                  background: etape.completee
                    ? 'rgba(46,125,50,0.08)'
                    : 'rgba(198,40,40,0.08)',
                  padding: '2px 6px', borderRadius: '3px',
                  display: 'inline-block',
                }}>
                  {etape.description}
                </span>
              </div>

              {/* Temps étape */}
              <span style={{
                fontSize: '11px', color: C.midGray,
                fontFamily: FONT, whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
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
  const [user, setUser]         = useState(null)
  const [labTitre, setLabTitre] = useState('')
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()
  const { id, labId } = useParams()
  const token  = localStorage.getItem('token')
  const admin  = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
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
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <p style={{ color: C.midGray, fontFamily: FONT, fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  /* Stats rapides */
  const reussites  = sessions.filter(s => s.reussi).length
  const taux       = sessions.length > 0
    ? Math.round((reussites / sessions.length) * 100) : 0
  const tempsMoyen = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + (s.temps_passe || 0), 0) / sessions.length) : 0

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>

      <NavbarAdmin user={admin} onDeconnexion={deconnexion} />
      <Breadcrumb items={[
        { label: 'Utilisateurs',  onClick: () => navigate('/admin') },
        { label: user?.nom,       onClick: () => navigate(`/admin/user/${id}`) },
        { label: labTitre },
      ]} />

      <div style={{ padding: '26px 32px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Bouton retour */}
        {/* <button
          onClick={() => navigate(`/admin/user/${id}`)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.midGray }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: '500', color: C.midGray,
            padding: '6px 12px', border: `1px solid ${C.border}`,
            borderRadius: '4px', background: C.white,
            cursor: 'pointer', marginBottom: '20px', fontFamily: FONT,
          }}
        >
          <Icon.ArrowLeft size={13} />
          Retour aux détails
        </button> */}

        {/* Hero lab + stats */}
        <div style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: '6px', padding: '20px 26px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '22px',
        }}>
          <div>
            <h1 style={{
              fontSize: '18px', fontWeight: '700', color: C.black,
              margin: '0 0 4px 0', fontFamily: FONT, letterSpacing: '-0.3px',
            }}>
              {labTitre}
            </h1>
            <p style={{ fontSize: '13px', color: C.midGray, margin: 0, fontFamily: FONT }}>
              Tentatives de <strong style={{ color: C.black }}>{user?.nom}</strong>
              {' '}· {sessions.length} tentative{sessions.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { val: reussites,             lbl: 'Réussies',    color: C.ok },
              { val: `${taux}%`,            lbl: 'Taux',        color: taux >= 70 ? C.ok : taux >= 40 ? C.orange : C.err },
              { val: formatTemps(tempsMoyen), lbl: 'Temps moy.', color: C.black },
            ].map(kpi => (
              <div key={kpi.lbl} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px', fontWeight: '700',
                  color: kpi.color, fontFamily: FONT, letterSpacing: '-0.3px',
                }}>
                  {kpi.val}
                </div>
                <div style={{
                  fontSize: '10px', color: C.midGray,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  fontFamily: FONT, marginTop: '2px',
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
            color: C.midGray, fontFamily: FONT,
          }}>
            Historique des tentatives
          </span>
          <div style={{ flex: 1, height: '1px', background: C.border }} />
        </div>

        {/* Liste tentatives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.map((session, i) => (
            <TentativeCard
              key={i}
              session={session}
              index={i}
              total={sessions.length}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminTentatives