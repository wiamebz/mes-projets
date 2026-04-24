import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../img/logo.png'
/* ─────────────────────────────────────────
   THÈME
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg: '#0F1117',
    bgCard: '#1A1D24',
    border: '#2A2D3A',
    text: '#F0F0F0',
    textSub: '#9AA0B0',
    textMuted: '#4A5060',
    orange: '#FF7900',
    orangeDark: '#E05C00',
    orangeLight: 'rgba(255,121,0,0.15)',
    ok: '#4CAF50',
    okLight: 'rgba(76,175,80,0.15)',
    err: '#EF5350',
    errLight: 'rgba(239,83,80,0.15)',
    navBg: '#0A0C12',
    pillBg: '#22252F',
    lockedText: '#4A5060',
  } : {
    bg: '#F4F4F4',
    bgCard: '#FFFFFF',
    border: '#E4E4E4',
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
    lockedText: '#BDBDBD',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const CAT_COLORS = ['#FF7900', '#5C6BC0', '#26A69A', '#EF5350', '#AB47BC', '#42A5F5']

/* ─────────────────────────────────────────
   ICÔNES
───────────────────────────────────────── */
const Icon = {
  Check: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25" />
      <path d="M5.25 8.25l2 2 3.5-4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Sun: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.25" />
      <path d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.4 3.4l.88.88M11.72 11.72l.88.88M11.72 4.28l-.88.88M4.28 11.72l-.88.88" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Moon: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Lock: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3.25" y="7.75" width="9.5" height="6.5" rx="1.25" stroke={color} strokeWidth="1.25" />
      <path d="M5.5 7.75V5.25a2.5 2.5 0 0 1 5 0v2.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Clock: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25" />
      <path d="M8 4.75V8l2.25 1.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: ({ size = 40, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Mail: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.25" />
      <path d="M2.5 4.5l5.5 4 5.5-4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Calendar: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke={color} strokeWidth="1.25" />
      <path d="M1.5 7h13M5 1.5v3M11 1.5v3" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  ChevLeft: ({ size = 20, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevRight: ({ size = 20, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Folder: ({ size = 18, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
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
function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatDateCourte(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────── */
function NavLinks({ T, navigate }) {
  const [hov, setHov] = useState(null)
  const currentPath = window.location.pathname

  const links = [
    { label: 'Accueil', path: '/' },
    { label: 'Mes Labs', path: '/labs' },
    { label: 'Profil', path: '/profil' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {links.map(link => {
        const isActive = currentPath === link.path
        const isHov = hov === link.path
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
  const [hovTheme, setHovTheme] = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={{
      background: T.navBg, borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '60px', position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box', transition: 'background .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src={logo} alt="logo" style={{ width: '140%', height: '140%', objectFit: 'contain' }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, fontFamily: FONT, marginTop: '1px' }}>by Learneo</div>
          </div>
        </div>
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
   HERO PROFIL
───────────────────────────────────────── */
function HeroProfil({ user, labs, T }) {
  const totalLabs = labs.length
  const labsCompletes = labs.filter(l => l.reussi).length
  const pctGlobal = totalLabs > 0 ? Math.round((labsCompletes / totalLabs) * 100) : 0

  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '16px',
      padding: '32px 40px',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      marginBottom: '40px',
    }}>
      {/* Avatar */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: T.orange, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', fontWeight: '800', color: '#fff',
        fontFamily: FONT, flexShrink: 0,
      }}>
        {initiales(user?.nom)}
      </div>

      {/* Infos user */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: FONT, marginBottom: '6px' }}>
          Profil d'apprentissage
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: T.text, fontFamily: FONT, margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
          {user?.nom}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon.Mail size={13} color={T.textMuted} />
            <span style={{ fontSize: '12px', color: T.textSub, fontFamily: FONT }}>
              {user?.email}
            </span>
          </div>
          {user?.createdAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon.Calendar size={13} color={T.textMuted} />
              <span style={{ fontSize: '12px', color: T.textSub, fontFamily: FONT }}>
                Membre depuis le {formatDate(user.createdAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: T.orange, fontFamily: FONT, letterSpacing: '-0.8px', lineHeight: 1 }}>
            {labsCompletes}
            <span style={{ fontSize: '18px', color: T.textMuted, fontWeight: '600' }}> / {totalLabs}</span>
          </div>
          <div style={{ fontSize: '10px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT, marginTop: '4px', fontWeight: '600' }}>
            Labs complétés
          </div>
        </div>

        <div style={{ width: '1px', height: '50px', background: T.border }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: pctGlobal >= 70 ? T.ok : pctGlobal > 0 ? T.orange : T.text, fontFamily: FONT, letterSpacing: '-0.8px', lineHeight: 1 }}>
            {pctGlobal}%
          </div>
          <div style={{ fontSize: '10px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT, marginTop: '4px', fontWeight: '600' }}>
            Progression globale
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD LAB (dans le scroll horizontal)
───────────────────────────────────────── */
function LabCard({ lab, index, color, T }) {
  const [hovered, setHovered] = useState(false)
  const taux = lab.tauxCompletion ?? 0
  const locked = !lab.debloque

  const tauxColor = taux >= 70 ? T.ok : taux > 0 ? T.orange : T.textMuted
  const tauxBg = taux >= 70 ? T.okLight : taux > 0 ? T.orangeLight : T.pillBg

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '280px', height: '180px',
        background: T.bgCard,
        border: `1px solid ${hovered ? color : T.border}`,
        borderRadius: '12px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all .2s',
        opacity: locked ? 0.6 : 1,
        boxSizing: 'border-box',
      }}
    >
      {/* Top */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: lab.reussi ? T.ok : locked ? T.border : color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: '700', color: '#fff',
            }}>
              {lab.reussi ? <Icon.Check size={12} color="#fff" /> : locked ? <Icon.Lock size={12} color={T.textMuted} /> : String(index + 1).padStart(2, '0')}
            </div>
            {lab.difficulte && (
              <span style={{
                fontSize: '9px', fontWeight: '700',
                padding: '2px 7px', borderRadius: '10px',
                background: T.pillBg, color: T.textSub,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                fontFamily: FONT,
              }}>
                {lab.difficulte}
              </span>
            )}
          </div>

          {/* Badge taux */}
          <span style={{
            fontSize: '11px', fontWeight: '700',
            padding: '3px 9px', borderRadius: '10px',
            background: tauxBg, color: tauxColor,
            fontFamily: FONT,
          }}>
            {taux}%
          </span>
        </div>

        <h4 style={{ fontSize: '14px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: '0 0 6px 0', lineHeight: 1.3 }}>
          {lab.titre}
        </h4>
      </div>

      {/* Bottom : infos + barre */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: T.textMuted, fontFamily: FONT }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon.Clock size={11} color={T.textMuted} />
            <span>{lab.etapesOk ?? 0}/{lab.etapesTotal ?? 0} étapes</span>
          </div>
          {lab.derniereSession && (
            <span>Essai : {formatDateCourte(lab.derniereSession)}</span>
          )}
        </div>

        {/* Barre progression */}
        <div style={{ height: '4px', background: T.border, borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: taux >= 100 ? T.ok : taux > 0 ? color : T.border,
            width: `${taux}%`, transition: 'width .6s ease',
          }} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION CATÉGORIE (scroll horizontal)
───────────────────────────────────────── */
function CategorieSection({ cat, index, T }) {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const color = CAT_COLORS[index % CAT_COLORS.length]

  const tauxCat = cat.tauxCategorie ?? 0
  const labsOk = cat.labs.filter(l => l.reussi).length
  const tauxColor = tauxCat >= 70 ? T.ok : tauxCat > 0 ? T.orange : T.textMuted

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
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
  }, [cat])

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Header catégorie */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '18px',
        flexWrap: 'wrap',
      }}>
        {/* Icône + titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '250px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon.Folder size={20} color={color} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT, marginBottom: '2px' }}>
              Domaine {index + 1}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: 0, letterSpacing: '-0.3px' }}>
              {cat.nom}
            </h2>
          </div>
        </div>

        {/* Stats + avancement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
              {labsOk} / {cat.labs.length}
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: FONT, marginTop: '2px' }}>
              Complétés
            </div>
          </div>

          <div style={{ width: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', color: T.textMuted, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Avancement
              </span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: tauxColor, fontFamily: FONT }}>
                {tauxCat}%
              </span>
            </div>
            <div style={{ height: '4px', background: T.border, borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                background: tauxCat >= 70 ? T.ok : tauxCat > 0 ? color : T.border,
                width: `${tauxCat}%`, transition: 'width .6s ease',
              }} />
            </div>
          </div>

          {/* Flèches navigation */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => canLeft && scroll(-1)}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: `1px solid ${canLeft ? T.orange : T.border}`,
                background: canLeft ? T.bgCard : T.pillBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canLeft ? 'pointer' : 'not-allowed',
                opacity: canLeft ? 1 : 0.4,
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (canLeft) { e.currentTarget.style.background = T.orange } }}
              onMouseLeave={e => { if (canLeft) { e.currentTarget.style.background = T.bgCard } }}
            >
              <Icon.ChevLeft size={16} color={canLeft ? T.orange : T.textMuted} />
            </button>
            <button
              onClick={() => canRight && scroll(1)}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: `1px solid ${canRight ? T.orange : T.border}`,
                background: canRight ? T.bgCard : T.pillBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canRight ? 'pointer' : 'not-allowed',
                opacity: canRight ? 1 : 0.4,
                transition: 'all .2s',
              }}
              onMouseEnter={e => { if (canRight) { e.currentTarget.style.background = T.orange } }}
              onMouseLeave={e => { if (canRight) { e.currentTarget.style.background = T.bgCard } }}
            >
              <Icon.ChevRight size={16} color={canRight ? T.orange : T.textMuted} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll horizontal des labs */}
      <div style={{ position: 'relative' }}>
        {canRight && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', zIndex: 2,
            background: `linear-gradient(to left, ${T.bg}, transparent)`,
            pointerEvents: 'none',
          }} />
        )}

        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '14px',
            overflowX: 'auto', paddingBottom: '8px',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {cat.labs.map((lab, i) => (
            <LabCard
              key={lab._id}
              lab={lab}
              index={i}
              color={color}
              T={T}
            />
          ))}
          <div style={{ width: '1px', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function Profil() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const T = getTheme(dark)

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
      const res = await fetch('http://localhost:5000/api/labs/categories', {
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

  // Collecte tous les labs de toutes les catégories pour le hero
  const allLabs = categories.flatMap(c => c.labs)

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <Navbar user={user} dark={dark} onToggleDark={toggleDark} onDeconnexion={deconnexion} T={T} />

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 40px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: T.textSub, fontSize: '14px', fontFamily: FONT, padding: '80px 0' }}>
            Chargement...
          </div>
        ) : (
          <>
            {/* Hero profil */}
            <HeroProfil user={user} labs={allLabs} T={T} />

            {/* Sections catégories */}
            {categories.map((cat, i) => (
              <CategorieSection key={cat.nom} cat={cat} index={i} T={T} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Profil