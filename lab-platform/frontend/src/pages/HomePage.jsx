import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────
   THÈME
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg:          '#0F1117',
    bgCard:      '#1A1D24',
    border:      '#2A2D3A',
    text:        '#F0F0F0',
    textSub:     '#9AA0B0',
    textMuted:   '#4A5060',
    orange:      '#FF7900',
    orangeDark:  '#E05C00',
    orangeLight: 'rgba(255,121,0,0.15)',
    ok:          '#4CAF50',
    okLight:     'rgba(76,175,80,0.15)',
    navBg:       '#0A0C12',
    pillBg:      '#22252F',
    lockedText:  '#4A5060',
    calBorder:   '#F0F0F0',
  } : {
    bg:          '#F4F4F4',
    bgCard:      '#FFFFFF',
    border:      '#E4E4E4',
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
    lockedText:  '#BDBDBD',
    calBorder:   '#1A1A1A',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ─────────────────────────────────────────
   ICÔNES
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
  Lock: ({ size = 18, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3.25" y="7.75" width="9.5" height="6.5" rx="1.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.5 7.75V5.25a2.5 2.5 0 0 1 5 0v2.5" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Calendar: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke={color} strokeWidth="1.25"/>
      <path d="M1.5 7h13M5 1.5v3M11 1.5v3" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Folder: ({ size = 32, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevLeft: ({ size = 22, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevRight: ({ size = 22, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const CAT_COLORS = ['#FF7900','#5C6BC0','#26A69A','#EF5350','#AB47BC','#42A5F5']
const initiales  = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}
function formatDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ─────────────────────────────────────────
   LIENS DE NAVIGATION
───────────────────────────────────────── */
function NavLinks({ T, navigate }) {
  const [hov, setHov] = useState(null)
  const currentPath   = window.location.pathname

  const links = [
    { label: 'Accueil',  path: '/' },
    { label: 'Mes Labs', path: '/labs' },
    { label: 'Profil',   path: '/profil' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {links.map(link => {
        const isActive = currentPath === link.path
        const isHov    = hov === link.path
        return (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            onMouseEnter={() => setHov(link.path)}
            onMouseLeave={() => setHov(null)}
            style={{
              fontSize: '13px',
              fontWeight: isActive ? '700' : '500',
              color: isActive || isHov ? T.orange : T.text,
              padding: '8px 14px',
              border: 'none',
              borderRadius: '6px',
              background: isActive ? T.orangeLight : isHov ? T.pillBg : 'transparent',
              cursor: 'pointer',
              fontFamily: FONT,
              transition: 'all .15s',
              position: 'relative',
            }}
          >
            {link.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function Navbar({ user, dark, onToggleDark, onDeconnexion, T }) {
  const [hovLogout, setHovLogout] = useState(false)
  const [hovTheme,  setHovTheme]  = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={{
      background: T.navBg, borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '60px', position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box', transition: 'background .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: T.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Check size={15} color="#fff" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, fontFamily: FONT, marginTop: '1px' }}>by Learneo</div>
          </div>
        </div>

        {/* Liens de navigation */}
        <NavLinks T={T} navigate={navigate} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={onToggleDark} onMouseEnter={() => setHovTheme(true)} onMouseLeave={() => setHovTheme(false)}
          style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: hovTheme ? T.pillBg : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s' }}>
          {dark ? <Icon.Sun size={16} color={T.orange} /> : <Icon.Moon size={16} color={T.textSub} />}
        </button>
        <div style={{ width: '1px', height: '20px', background: T.border }} />
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: T.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', fontFamily: FONT }}>
          {initiales(user?.nom)}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color: T.text, fontFamily: FONT }}>{user?.nom}</span>
        <button onClick={onDeconnexion} onMouseEnter={() => setHovLogout(true)} onMouseLeave={() => setHovLogout(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500', color: hovLogout ? T.orange : T.textSub, padding: '5px 11px', border: `1px solid ${hovLogout ? T.orange : T.border}`, borderRadius: '4px', background: 'none', cursor: 'pointer', fontFamily: FONT, transition: 'all .15s' }}>
          <Icon.Logout size={13} color={hovLogout ? T.orange : T.textSub} />
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────
   HERO CARD (première card du slider)
───────────────────────────────────────── */
function HeroCard({ categories, T, dark }) {
  const totalLabs    = categories.reduce((s, c) => s + c.totalLabs, 0)
  const totalReussis = categories.reduce((s, c) => s + c.labsReussis, 0)

  // Palette — sombre en dark, gris pro en light (pas blanc, pas dark)
  const bgGradient = dark
    ? 'linear-gradient(135deg, #0F1520 0%, #141B2E 50%, #0A1218 100%)'
    : 'linear-gradient(135deg, #2A2E3A 0%, #1E2330 50%, #151820 100%)'
  const textMain  = '#FFFFFF'
  const textSub   = 'rgba(255,255,255,0.5)'

  return (
    <div style={{
      width: '100%', height: '460px',
      borderRadius: '16px',
      background: bgGradient,
      padding: '56px 64px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Cercles décoratifs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,121,0,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '25%', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,121,0,0.05)', pointerEvents: 'none' }} />

      {/* Contenu */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '5px 13px', borderRadius: '20px',
          border: '1px solid rgba(255,121,0,0.35)',
          background: 'rgba(255,121,0,0.1)', marginBottom: '24px',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF7900' }} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#FF7900', fontFamily: FONT, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Plateforme CKA — Learneo
          </span>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '54px', fontWeight: '800', color: textMain, fontFamily: FONT, letterSpacing: '-1.5px', lineHeight: 1.05, display: 'block' }}>Labs</span>
          <span style={{ fontSize: '54px', fontWeight: '800', color: '#FF7900', fontFamily: FONT, letterSpacing: '-1.5px', lineHeight: 1.05, display: 'block' }}>Kubernetes</span>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '500', color: textSub, fontFamily: FONT, margin: '0 0 8px 0', letterSpacing: '0.3px' }}>
          Certified Kubernetes Administrator
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '14px 0 18px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FF7900' }} />
          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(to right, #FF7900, transparent)' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,121,0,0.3)' }} />
        </div>

        <p style={{ fontSize: '14px', color: textSub, fontFamily: FONT, margin: 0, lineHeight: 1.7, maxWidth: '480px' }}>
          Préparez-vous à la certification CKA à travers des labs pratiques structurés par domaine d'examen.
        </p>
      </div>

      {/* Mini stats */}
      <div style={{ position: 'relative', display: 'flex', gap: '40px' }}>
        {[
          { val: totalReussis, lbl: 'terminés' },
          { val: totalLabs,    lbl: 'disponibles' },
        ].map(s => (
          <div key={s.lbl}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: textMain, fontFamily: FONT, letterSpacing: '-0.8px' }}>{s.val}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px', fontWeight: '600' }}>Labs {s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD CATÉGORIE
───────────────────────────────────────── */
function CategorieCard({ cat, index, navigate, T }) {
  const [hovered, setHovered] = useState(false)
  const color  = CAT_COLORS[index % CAT_COLORS.length]
  const taux   = cat.tauxCategorie ?? 0
  const locked = !cat.estOuverte

  return (
    <div
      onMouseEnter={() => !locked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !locked && navigate('/labs', { state: { categorie: cat.nom } })}
      style={{
        width: '100%', height: '460px',
        background: T.bgCard,
        border: `1px solid ${hovered ? color : T.border}`,
        borderRadius: '16px', overflow: 'hidden',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.6 : 1,
        boxShadow: hovered ? `0 10px 32px rgba(0,0,0,0.14)` : 'none',
        transition: 'border-color .2s, box-shadow .2s',
        display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Bande couleur top */}
      <div style={{ height: '5px', background: locked ? T.border : `linear-gradient(to right, ${color}, ${color}66)`, flexShrink: 0 }} />

      <div style={{ padding: '48px 64px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header icône + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: locked ? T.border : `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {locked ? <Icon.Lock size={28} color={T.lockedText} /> : <Icon.Folder size={36} color={color} />}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: T.textMuted, fontFamily: FONT, marginBottom: '6px', letterSpacing: '0.8px' }}>
              DOMAINE {index + 1}
            </div>
            <span style={{ fontSize: '14px', fontWeight: '800', padding: '5px 12px', borderRadius: '12px', background: locked ? T.border : taux >= 70 ? T.okLight : taux > 0 ? T.orangeLight : T.pillBg, color: locked ? T.lockedText : taux >= 70 ? T.ok : taux > 0 ? T.orange : T.textMuted, fontFamily: FONT }}>
              {taux}%
            </span>
          </div>
        </div>

        {/* Titre */}
        <h3 style={{ fontSize: '36px', fontWeight: '800', color: locked ? T.lockedText : T.text, fontFamily: FONT, margin: '0 0 20px 0', lineHeight: 1.2, letterSpacing: '-0.8px' }}>
          {cat.nom}
        </h3>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: locked ? T.lockedText : color, fontFamily: FONT, letterSpacing: '-0.8px' }}>{cat.totalLabs}</div>
            <div style={{ fontSize: '11px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT, marginTop: '4px', fontWeight: '600' }}>Labs</div>
          </div>
          <div style={{ width: '1px', background: T.border }} />
          <div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: locked ? T.lockedText : cat.labsReussis > 0 ? T.ok : T.text, fontFamily: FONT, letterSpacing: '-0.8px' }}>{cat.labsReussis}</div>
            <div style={{ fontSize: '11px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT, marginTop: '4px', fontWeight: '600' }}>Terminés</div>
          </div>
        </div>

        {/* Barre progression */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: '5px', background: T.border, borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', borderRadius: '3px', background: locked ? T.border : taux >= 70 ? T.ok : taux > 0 ? color : T.border, width: `${taux}%`, transition: 'width .6s ease' }} />
          </div>

          {locked && cat.date_ouverture ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon.Calendar size={13} color={T.lockedText} />
              <span style={{ fontSize: '12px', color: T.lockedText, fontFamily: FONT }}>
                Ouverture le {formatDate(cat.date_ouverture)}
              </span>
            </div>
          ) : !locked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon.ArrowRight size={13} color={hovered ? color : T.textMuted} />
              <span style={{ fontSize: '12px', color: hovered ? color : T.textMuted, fontFamily: FONT, fontWeight: '600', transition: 'color .15s' }}>
                Accéder aux labs
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SCROLLER PRINCIPAL (hero + catégories)
───────────────────────────────────────── */
function MainScroller({ categories, navigate, T, dark }) {
  const scrollRef  = useRef(null)
  const [pos,       setPos]       = useState(0)
  const [canLeft,   setCanLeft]   = useState(false)
  const [canRight,  setCanRight]  = useState(false)
  const [hover,     setHover]     = useState(false)
  const [paused,    setPaused]    = useState(false)
  const totalItems = 1 + categories.length

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 20)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20)
    setPos(Math.round(el.scrollLeft / el.clientWidth))
  }

  useEffect(() => {
    setTimeout(checkScroll, 100)
    const el = scrollRef.current
    if (el) el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [categories])

  // Autoplay 2 secondes
  useEffect(() => {
    if (hover || paused) return
    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const maxScroll = el.scrollWidth - el.clientWidth
      const next = el.scrollLeft + el.clientWidth >= maxScroll - 20
        ? 0
        : el.scrollLeft + el.clientWidth
      el.scrollTo({ left: next, behavior: 'smooth' })
    }, 2000)
    return () => clearInterval(interval)
  }, [hover, paused, categories])

  function scroll(dir) {
    const el = scrollRef.current
    if (!el) return
    setPaused(true)
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: FONT, marginBottom: '6px' }}>
          Kubernetes — Parcours certifiant
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: 0 }}>
          Domaines de formation
        </h2>
      </div>

      {/* Scroller avec flèches SUR la card + pause au hover */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Flèche gauche */}
        {canLeft && (
          <button
            onClick={() => scroll(-1)}
            style={{
              position: 'absolute', left: '20px', top: '50%',
              transform: 'translateY(-50%)', zIndex: 10,
              width: '48px', height: '48px', borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'all .2s',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.orange; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            <Icon.ChevLeft size={22} color={T.orange} />
          </button>
        )}

        {/* Flèche droite */}
        {canRight && (
          <button
            onClick={() => scroll(1)}
            style={{
              position: 'absolute', right: '20px', top: '50%',
              transform: 'translateY(-50%)', zIndex: 10,
              width: '48px', height: '48px', borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'all .2s',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.orange; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            <Icon.ChevRight size={22} color={T.orange} />
          </button>
        )}

        {/* Container scrollable — chaque card = 100% */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '24px',
            overflowX: 'auto', paddingBottom: '20px',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* Hero en premier */}
          <div style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'center' }}>
            <HeroCard categories={categories} T={T} dark={dark} />
          </div>

          {/* Cards catégories */}
          {categories.map((cat, i) => (
            <div key={cat.nom} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'center' }}>
              <CategorieCard cat={cat} index={i} navigate={navigate} T={T} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicateurs sous le scroller */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        {Array.from({ length: totalItems }).map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setPaused(true)
              const el = scrollRef.current
              if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
            }}
            style={{
              width: i === pos ? '24px' : '8px',
              height: '8px', borderRadius: '4px',
              background: i === pos ? T.orange : T.border,
              transition: 'all .3s', cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CALENDRIER
───────────────────────────────────────── */
function Calendrier({ categories, T, dark }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Convertit la raison backend en label explicite pour l'utilisateur
  function getLabel(cat) {
    if (cat.estOuverte) {
      if (cat.raison === 'deblocage_admin') return 'Débloqué par admin'
      if (cat.date_ouverture) return `Ouvert depuis le ${new Date(cat.date_ouverture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
      return 'Disponible'
    }
    // Fermé
    if (cat.raison === 'verrouille_admin') return 'Verrouillé par admin'
    if (cat.raison === 'categorie_precedente_incomplete') return 'Catégorie précédente à compléter'
    if (cat.raison === 'date_future' && cat.date_ouverture) {
      return `Ouverture le ${new Date(cat.date_ouverture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
    }
    return 'Verrouillé'
  }

  // Tri par ordre (le backend renvoie déjà par ordre croissant, on garde)
  const categoriesTriees = [...categories].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))

  return (
    <div
      ref={ref}
      style={{
        marginTop: '100px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transition: 'opacity .8s ease, transform .8s ease',
      }}
    >
      <div style={{
        padding: '40px',
        border: `2px solid ${T.calBorder}`,
        borderRadius: '16px',
        background: T.bgCard,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Icon.Calendar size={16} color={T.orange} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: 0 }}>
            Calendrier de déploiement
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: T.textSub, fontFamily: FONT, margin: '0 0 28px 0', lineHeight: 1.6 }}>
          Les domaines sont ouverts progressivement selon la progression de la formation.
        </p>

        <div style={{ position: 'relative' }}>
          {/* Ligne verticale */}
          <div style={{ position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', background: T.border }} />

          {categoriesTriees.map(cat => {
            const estOuverte = cat.estOuverte
            const label      = getLabel(cat)

            return (
              <div key={cat.nom} style={{ display: 'flex', gap: '18px', marginBottom: '28px' }}>
                {/* Cercle timeline */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: estOuverte ? T.orange : T.pillBg,
                  border: `2px solid ${estOuverte ? T.orange : T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                }}>
                  {estOuverte ? <Icon.Check size={15} color="#fff" /> : <Icon.Lock size={14} color={T.textMuted} />}
                </div>

                {/* Contenu */}
                <div style={{ paddingTop: '6px', flex: 1 }}>
                  {/* Ligne 1 : Label + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: estOuverte ? T.text : T.textSub, fontFamily: FONT }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: '700',
                      padding: '3px 9px', borderRadius: '10px',
                      background: estOuverte ? T.okLight : T.pillBg,
                      color: estOuverte ? T.ok : T.textMuted,
                      fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      {estOuverte ? 'Ouvert' : 'Verrouillé'}
                    </span>
                  </div>

                  {/* Ligne 2 : Nom de la catégorie */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: estOuverte ? T.text : T.textMuted,
                    fontFamily: FONT,
                    marginBottom: '4px',
                  }}>
                    Domaine {cat.ordre} — {cat.nom}
                  </div>

                  {/* Ligne 3 : Progression */}
                  <div style={{ fontSize: '12px', color: T.textSub, fontFamily: FONT, lineHeight: 1.6 }}>
                    {cat.labsReussis} / {cat.totalLabs} lab{cat.totalLabs > 1 ? 's' : ''} complété{cat.labsReussis > 1 ? 's' : ''} · {cat.tauxCategorie}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function HomePage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [dark, setDark]             = useState(() => localStorage.getItem('theme') === 'dark')

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user'))
  const T        = getTheme(dark)

  function toggleDark() {
    setDark(d => { const next = !d; localStorage.setItem('theme', next ? 'dark' : 'light'); return next })
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    if (user?.role === 'admin') { navigate('/admin'); return }
    chargerCategories()
  }, [])

  async function chargerCategories() {
    try {
      const res  = await fetch('http://localhost:5000/api/labs/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await res.json()
      setCategories(data)
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  function deconnexion() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <Navbar user={user} dark={dark} onToggleDark={toggleDark} onDeconnexion={deconnexion} T={T} />

      {loading ? (
        <div style={{ textAlign: 'center', color: T.textSub, fontSize: '14px', fontFamily: FONT, padding: '80px 0' }}>
          Chargement...
        </div>
      ) : (
        <>
          {/* Scroller pleine largeur */}
          <div style={{ padding: '32px 40px 24px' }}>
            <MainScroller categories={categories} navigate={navigate} T={T} dark={dark} />
          </div>

          {/* Calendrier centré */}
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px 80px' }}>
            <Calendrier categories={categories} T={T} dark={dark} />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage