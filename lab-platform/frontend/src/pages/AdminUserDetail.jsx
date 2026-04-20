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
  err:         '#C62828',
  errLight:    '#FFEBEE',
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

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
  ChevronRight: ({ size = 12, color = '#BDBDBD' }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25 2.5L7.75 6l-3.5 3.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronDown: ({ size = 14, color = C.midGray, rotated = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ flexShrink: 0, transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s ease' }}>
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ size = 13, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  User: ({ size = 22, color = C.white }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Clock: ({ size = 13, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M8 4.75V8l2.25 1.5" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: ({ size = 13, color = C.ok }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.25 8.25l2 2 3.5-4" stroke={color} strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Folder: ({ size = 16, color = C.midGray }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3H6l1.5 2H13A1.5 1.5 0 0 1 14.5 6.5v5A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5v-7z"
        stroke={color} strokeWidth="1.25" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const AVATAR_COLORS = ['#FF7900','#5C6BC0','#26A69A','#EF5350','#AB47BC','#42A5F5']
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
   CARD LAB (dans l'accordion admin)
───────────────────────────────────────── */
function LabStatCard({ lab, userId, navigate }) {
  const [hovered, setHovered] = useState(false)

  const taux      = lab.tauxCompletion ?? 0
  const tauxColor = taux >= 70 ? C.ok : taux >= 40 ? C.orangeDark : taux > 0 ? C.err : C.midGray
  const tauxBg    = taux >= 70 ? C.okLight : taux >= 40 ? C.orangeLight : taux > 0 ? C.errLight : C.lightGray

  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: '6px', overflow: 'hidden',
    }}>
      {/* Header sombre */}
      <div style={{ background: C.black, padding: '13px 16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: C.white, fontFamily: FONT, marginBottom: '2px' }}>
          {lab.titre}
        </div>
        <div style={{ fontSize: '11px', color: '#9E9E9E', fontFamily: FONT }}>
          Dernier essai : {formatDateCourte(lab.derniereSession)}
        </div>
      </div>

      {/* Badges + bouton */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Taux complétion */}
        <span style={{
          fontSize: '11px', fontWeight: '700',
          padding: '4px 9px', borderRadius: '4px',
          background: tauxBg, color: tauxColor, fontFamily: FONT,
        }}>
          {lab.etapesTotal > 0 ? `${taux}%` : '—'}
        </span>

        {/* Essais */}
        <span style={{
          fontSize: '11px', fontWeight: '600',
          padding: '4px 9px', borderRadius: '4px',
          background: C.lightGray, color: C.darkGray, fontFamily: FONT,
        }}>
          {lab.tentatives} essai{lab.tentatives > 1 ? 's' : ''}
        </span>

        {/* Bouton */}
        <button
          onClick={() => navigate(`/admin/user/${userId}/lab/${lab._id}`)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: '700',
            padding: '6px 12px', borderRadius: '4px', border: 'none',
            background: hovered ? C.orangeDark : C.orange,
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
   ACCORDION CATÉGORIE (admin)
───────────────────────────────────────── */
function CategorieAccordion({ categorie, userId, navigate, defaultOpen = true }) {
  const [ouvert, setOuvert] = useState(defaultOpen)

  const taux      = categorie.tauxCategorie ?? 0
  const tauxColor = taux >= 70 ? C.ok : taux > 0 ? C.orange : C.midGray
  const tauxBarre = taux >= 70 ? C.ok : taux > 0 ? C.orange : C.border

  // Labs ayant au moins 1 tentative
  const labsAvecTentatives = categorie.labs.filter(l => l.tentatives > 0)
  const totalLabs          = categorie.labs.length

  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: '8px', overflow: 'hidden', marginBottom: '14px',
    }}>
      {/* Header */}
      <button
        onClick={() => setOuvert(o => !o)}
        style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      >
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
          borderBottom: ouvert ? `1px solid ${C.border}` : 'none',
        }}>
          {/* Icône */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: C.lightGray, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon.Folder size={17} color={C.midGray} />
          </div>

          {/* Titre + sous-info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: C.black, fontFamily: FONT, marginBottom: '2px' }}>
              {categorie.nom}
            </div>
            <div style={{ fontSize: '11px', color: C.midGray, fontFamily: FONT }}>
              {labsAvecTentatives.length} / {totalLabs} lab{totalLabs > 1 ? 's' : ''} pratiqué{labsAvecTentatives.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Barre avancement + % */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <div style={{ width: '130px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', color: C.midGray, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Avancement
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: tauxColor, fontFamily: FONT }}>
                  {taux}%
                </span>
              </div>
              <div style={{ height: '4px', background: C.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  background: tauxBarre, width: `${taux}%`,
                  transition: 'width .5s ease',
                }} />
              </div>
            </div>
            <Icon.ChevronDown size={16} color={C.midGray} rotated={ouvert} />
          </div>
        </div>
      </button>

      {/* Contenu animé */}
      <div style={{ maxHeight: ouvert ? '2000px' : '0', overflow: 'hidden', transition: 'max-height .35s ease' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px', padding: '16px 20px',
          background: '#FAFAFA',
        }}>
          {categorie.labs.map(lab => (
            <LabStatCard
              key={lab._id}
              lab={lab}
              userId={userId}
              navigate={navigate}
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
  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const admin    = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { chargerDetails() }, [])

  async function chargerDetails() {
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
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
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: C.midGray, fontFamily: FONT, fontSize: '14px' }}>Chargement...</p>
    </div>
  )

  /* Stats globales */
  const totalSessions    = details.sessions.length
  const totalReussites   = details.sessions.filter(s => s.reussi).length
  const tempsMoyenGlobal = totalSessions > 0
    ? Math.round(details.sessions.reduce((a, s) => a + (s.temps_passe || 0), 0) / totalSessions)
    : 0

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>

      <NavbarAdmin user={admin} onDeconnexion={deconnexion} />
      <Breadcrumb items={[
        { label: 'Utilisateurs', onClick: () => navigate('/admin') },
        { label: details.user.nom },
      ]} />

      <div style={{ padding: '26px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Hero utilisateur */}
        <div style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: '6px', padding: '22px 26px',
          display: 'flex', alignItems: 'center',
          gap: '20px', marginBottom: '24px',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: avatarColor(0), display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon.User size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.black, margin: '0 0 3px 0', fontFamily: FONT }}>
              {details.user.nom}
            </h2>
            <p style={{ fontSize: '13px', color: C.midGray, margin: '0 0 2px 0', fontFamily: FONT }}>
              {details.user.email}
            </p>
            <span style={{ fontSize: '11px', color: C.midGray, fontFamily: FONT }}>
              Membre depuis le {formatDate(details.user.createdAt)}
            </span>
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
            {[
              { val: `${totalReussites} / ${totalSessions}`, lbl: 'Réussies',    color: C.ok },
              { val: formatTemps(tempsMoyenGlobal),          lbl: 'Temps moyen', color: C.black },
            ].map(kpi => (
              <div key={kpi.lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: kpi.color, fontFamily: FONT, letterSpacing: '-0.3px' }}>
                  {kpi.val}
                </div>
                <div style={{ fontSize: '10px', color: C.midGray, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT, marginTop: '2px' }}>
                  {kpi.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: C.midGray, fontFamily: FONT }}>
            Progression par catégorie
          </span>
          <div style={{ flex: 1, height: '1px', background: C.border }} />
        </div>

        {/* Accordions par catégorie — données du backend */}
        {details.categories && details.categories.length > 0 ? (
          details.categories.map((cat, i) => (
            <CategorieAccordion
              key={cat.nom}
              categorie={cat}
              userId={id}
              navigate={navigate}
              defaultOpen={i === 0}
            />
          ))
        ) : (
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: '6px', padding: '32px',
            textAlign: 'center', color: C.midGray, fontSize: '13px', fontFamily: FONT,
          }}>
            Aucune session enregistrée pour cet utilisateur.
          </div>
        )}


      </div>
    </div>
  )
}

export default AdminUserDetail