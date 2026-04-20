import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { io } from 'socket.io-client'
import 'xterm/css/xterm.css'

/* ─────────────────────────────────────────
   THÈME
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg:'#111318', bgSecond:'#1A1D24', bgCard:'#1E2128', border:'#2A2D37',
    text:'#F0F0F0', textSub:'#9AA0B0', textMuted:'#5A6070',
    orange:'#FF7900', orangeDark:'#E05C00', orangeLight:'rgba(255,121,0,0.12)',
    ok:'#4CAF50', okLight:'rgba(76,175,80,0.12)',
    err:'#EF5350', errLight:'rgba(239,83,80,0.12)',
    navBg:'#13151B', statBg:'#1A1D24', pillBg:'#2A2D37',
  } : {
    bg:'#F2F2F2', bgSecond:'#EAEAEA', bgCard:'#FFFFFF', border:'#E0E0E0',
    text:'#1A1A1A', textSub:'#595959', textMuted:'#9E9E9E',
    orange:'#FF7900', orangeDark:'#E05C00', orangeLight:'#FFF3E8',
    ok:'#2E7D32', okLight:'#E8F5E9',
    err:'#C62828', errLight:'#FFEBEE',
    navBg:'#FFFFFF', statBg:'#FFFFFF', pillBg:'#F4F4F4',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SF Mono', 'Fira Code', 'Courier New', monospace"
const CAT_COLORS = ['#FF7900','#5C6BC0','#26A69A','#EF5350','#AB47BC','#42A5F5']
const LAB_DURATION_SECONDS = 30 * 60 // 30 minutes

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
  Lock: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3.25" y="7.75" width="9.5" height="6.5" rx="1.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.5 7.75V5.25a2.5 2.5 0 0 1 5 0v2.5" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Clock: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M8 4.75V8l2.25 1.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.25 2.75H3.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h2.75" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M10.25 5.25l2.5 2.75-2.5 2.75M12.75 8H6.75" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Terminal: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" stroke={color} strokeWidth="1.25"/>
      <path d="M4.5 6.25l2.75 1.75-2.75 1.75M8.75 9.75H11.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Stop: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="4.25" y="4.25" width="7.5" height="7.5" rx="1.25" stroke={color} strokeWidth="1.25"/>
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
  ChevronLeft: ({ size = 18, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 4l-4 4 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: ({ size = 18, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Folder: ({ size = 20, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  X: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.25" stroke={color} strokeWidth="1.25"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke={color} strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  ),
  Trophy: ({ size = 24, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 6H5a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3h1M17 6h2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 14v4M8 20h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Refresh: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M14 8a6 6 0 1 1-1.75-4.24M14 3.5V6h-2.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M13 8H3M7 4L3 8l4 4" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function grouperParCategorie(labs) {
  return labs.reduce((acc, lab) => {
    const cat = lab.categorie || 'Général'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(lab)
    return acc
  }, {})
}
function tauxCategorie(labs) {
  if (!labs.length) return 0
  return Math.round(labs.reduce((s, l) => s + (l.tauxCompletion ?? 0), 0) / labs.length)
}
const initiales = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}

// Format MM:SS
function formatTime(seconds) {
  const mm = Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0')
  const ss = (Math.max(0, seconds) % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

/* ─────────────────────────────────────────
   NAV LINKS
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
          <button key={link.path} onClick={() => navigate(link.path)}
            onMouseEnter={() => setHov(link.path)} onMouseLeave={() => setHov(null)}
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
      background: T.navBg, borderBottom: `3px solid ${T.orange}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '60px', position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box', transition: 'background .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: T.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Check size={16} color="#fff" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
              Lab<span style={{ color: T.orange }}>Platform</span>
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '2px', fontFamily: FONT }}>by Learneo</div>
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
   STATS ROW
───────────────────────────────────────── */
function StatsRow({ labs, T }) {
  const total     = labs.length
  const completes = labs.filter(l => l.reussi).length
  const debloques = labs.filter(l => l.debloque).length
  const pct       = total > 0 ? Math.round((completes / total) * 100) : 0
  const tous      = total > 0 && completes === total
  const enCours   = labs.find(l => l.debloque && !l.reussi)
  const prochain  = tous ? null : labs.find(l => !l.reussi)

  const cards = [
    { key:'debloques', bar:T.orange, label:'Labs débloqués', val:`${debloques} / ${total}`, sub:'Accessibles dans le parcours' },
    { key:'reussis', bar:completes > 0 ? T.ok : T.border, label:'Labs réussis', val:`${completes} / ${total}`, sub:`${pct}% du parcours complété`, progress:pct, progressColor:completes > 0 ? T.ok : T.border },
    { key:'encours', bar:enCours ? T.orange : T.border, label:'Lab en cours', valSmall:enCours ? enCours.titre : '—', sub:enCours ? `Difficulté : ${enCours.difficulte}` : tous ? 'Tous réussis' : 'Aucun lab actif' },
    { key:'prochain', bar:tous ? T.ok : T.border, label:'Prochain objectif', valSmall:prochain ? prochain.titre : 'Parcours terminé', sub:prochain ? `Réussissez "${enCours?.titre ?? 'le lab en cours'}"` : 'Tous les labs sont débloqués' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
      {cards.map(c => (
        <div key={c.key} style={{ background: T.statBg, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '16px 20px', position: 'relative', overflow: 'hidden', transition: 'background .3s' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: c.bar }} />
          <div style={{ fontSize: '10px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px', fontFamily: FONT }}>{c.label}</div>
          {c.val && <div style={{ fontSize: '22px', fontWeight: '700', color: T.text, fontFamily: FONT }}>{c.val}</div>}
          {c.valSmall && <div style={{ fontSize: '13px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.valSmall}</div>}
          {c.progress !== undefined && (
            <div style={{ height: '3px', background: T.border, borderRadius: '2px', overflow: 'hidden', marginTop: '8px', marginBottom: '4px' }}>
              <div style={{ height: '100%', borderRadius: '2px', background: c.progressColor, width: `${c.progress}%`, transition: 'width .4s ease' }} />
            </div>
          )}
          <div style={{ fontSize: '11px', color: T.textSub, marginTop: '3px', fontFamily: FONT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   CARD LAB
───────────────────────────────────────── */
function LabCard({ lab, globalIndex, onLancer, T }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => lab.debloque && setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: T.bgCard, border: `1px solid ${hovered ? T.orange : T.border}`,
        borderRadius: '8px', overflow: 'hidden', opacity: lab.debloque ? 1 : 0.55,
        boxShadow: hovered ? '0 4px 20px rgba(255,121,0,0.15)' : 'none',
        transition: 'all .2s', display: 'flex', flexDirection: 'column',
        width: '280px', flexShrink: 0,
      }}>
      <div style={{ height: '3px', background: lab.reussi ? T.ok : lab.debloque ? T.orange : T.border }} />
      <div style={{ padding: '16px 18px', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: lab.reussi ? T.ok : lab.debloque ? T.orange : T.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>
            {lab.reussi ? <Icon.Check size={13} color="#fff" /> : String(globalIndex + 1).padStart(2, '0')}
          </div>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: lab.debloque ? T.text : T.textSub, margin: 0, lineHeight: 1.4, fontFamily: FONT }}>{lab.titre}</h3>
        </div>
        <p style={{ fontSize: '12px', color: T.textSub, lineHeight: 1.65, margin: '0 0 14px 0', fontFamily: FONT }}>{lab.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: T.textMuted, fontFamily: FONT }}>
            <Icon.Clock size={12} color={T.textMuted} />30 min
          </div>
          {lab.etapesTotal > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{ flex: 1, height: '3px', background: T.border, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '2px', background: lab.tauxCompletion === 100 ? T.ok : T.orange, width: `${lab.tauxCompletion ?? 0}%`, transition: 'width .4s ease' }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, fontFamily: FONT, whiteSpace: 'nowrap' }}>{lab.etapesOk ?? 0}/{lab.etapesTotal}</span>
            </div>
          )}
        </div>
        {!lab.debloque && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: T.textSub, background: T.pillBg, borderRadius: '4px', padding: '6px 10px', marginTop: '12px', fontFamily: FONT }}>
            <Icon.Lock size={12} color={T.textSub} />
            Terminez le lab précédent pour débloquer
          </div>
        )}
        {lab.reussi && (
          <div style={{ fontSize: '11px', fontWeight: '600', color: T.ok, background: T.okLight, borderRadius: '4px', padding: '6px 10px', marginTop: '12px', fontFamily: FONT }}>
            Lab complété avec succès
          </div>
        )}
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '10px 18px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => lab.debloque && onLancer(lab)} disabled={!lab.debloque}
          onMouseEnter={e => { if (lab.debloque) e.currentTarget.style.background = T.orangeDark }}
          onMouseLeave={e => { if (lab.debloque) e.currentTarget.style.background = lab.reussi ? '#666' : T.orange }}
          style={{
            fontSize: '11px', fontWeight: '700', padding: '7px 16px', borderRadius: '4px', border: 'none',
            background: lab.debloque ? (lab.reussi ? '#666' : T.orange) : T.pillBg,
            color: lab.debloque ? '#fff' : T.textMuted,
            cursor: lab.debloque ? 'pointer' : 'not-allowed',
            fontFamily: FONT, transition: 'background .15s',
          }}>
          {!lab.debloque ? 'Verrouillé' : lab.reussi ? 'Refaire' : 'Lancer'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION CATÉGORIE
───────────────────────────────────────── */
function CategorieSection({ nom, labs, index, globalOffset, onLancer, T }) {
  const [visible, setVisible]   = useState(index === 0)
  const [canLeft, setCanLeft]   = useState(false)
  const [canRight, setCanRight] = useState(false)
  const sectionRef = useRef(null)
  const scrollRef  = useRef(null)
  const color = CAT_COLORS[index % CAT_COLORS.length]

  useEffect(() => {
    if (index === 0) return
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

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
  }, [labs])

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  const taux      = tauxCategorie(labs)
  const labsOk    = labs.filter(l => l.reussi).length
  const tauxColor = taux >= 70 ? T.ok : taux > 0 ? T.orange : T.textMuted
  const tauxBarre = taux >= 70 ? T.ok : taux > 0 ? color : T.border

  return (
    <div ref={sectionRef} style={{
      marginBottom: '48px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity .7s ease, transform .7s ease',
    }}>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Folder size={22} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: FONT, marginBottom: '3px' }}>Domaine {index + 1}</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: T.text, fontFamily: FONT, marginBottom: '4px' }}>{nom}</div>
          <div style={{ fontSize: '12px', color: T.textSub, fontFamily: FONT }}>{labsOk} / {labs.length} lab{labs.length > 1 ? 's' : ''} complété{labsOk > 1 ? 's' : ''}</div>
        </div>
        <div style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', color: T.textMuted, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avancement</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: tauxColor, fontFamily: FONT }}>{taux}%</span>
          </div>
          <div style={{ height: '5px', background: T.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '3px', background: tauxBarre, width: `${taux}%`, transition: 'width .5s ease' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[-1, 1].map(dir => {
            const active = dir === -1 ? canLeft : canRight
            const IconComp = dir === -1 ? Icon.ChevronLeft : Icon.ChevronRight
            return (
              <button key={dir} onClick={() => active && scroll(dir)}
                style={{ width: '34px', height: '34px', borderRadius: '50%', border: `1px solid ${active ? T.orange : T.border}`, background: active ? T.bgCard : T.pillBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: active ? 'pointer' : 'not-allowed', opacity: active ? 1 : 0.4, transition: 'all .2s' }}>
                <IconComp size={16} color={active ? T.orange : T.textMuted} />
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {canRight && (
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', zIndex: 2, background: `linear-gradient(to left, ${T.bg}, transparent)`, pointerEvents: 'none' }} />
        )}
        <div ref={scrollRef} style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
          {labs.map((lab, i) => (
            <LabCard key={lab._id} lab={lab} globalIndex={globalOffset + i} onLancer={onLancer} T={T} />
          ))}
          <div style={{ width: '1px', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   LOADING SCREEN — démarrage du lab
───────────────────────────────────────── */
function LoadingScreen({ lab, T }) {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
    }}>
      {/* Spinner */}
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        border: `4px solid ${T.border}`,
        borderTopColor: T.orange,
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: '0 0 8px 0' }}>
          Patientez...
        </h2>
        <p style={{ fontSize: '14px', color: T.textSub, fontFamily: FONT, margin: '0 0 4px 0' }}>
          Démarrage de l'environnement Kubernetes
        </p>
        <p style={{ fontSize: '12px', color: T.textMuted, fontFamily: FONT, margin: 0 }}>
          {lab?.titre} · Cela peut prendre jusqu'à 30 secondes
        </p>
      </div>

      {/* Dots animés */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: T.orange,
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%           { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────
   RÉSULTAT ÉCRAN — fin du lab
───────────────────────────────────────── */
function ResultatScreen({ lab, resultat, onRefaire, onRetour, T }) {
  const etapes      = resultat.etapes || []
  const etapesOk    = etapes.filter(e => e.completee).length
  const etapesTotal = etapes.length
  const score       = etapesTotal > 0 ? Math.round((etapesOk / etapesTotal) * 100) : 0
  const reussi      = score === 100
  const tempsMin    = Math.floor((resultat.tempsPasse || 0) / 60)
  const tempsSec    = (resultat.tempsPasse || 0) % 60

  const scoreColor = score >= 70 ? T.ok : score > 0 ? T.orange : T.err
  const scoreBg    = score >= 70 ? T.okLight : score > 0 ? T.orangeLight : T.errLight

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header résultat */}
      <div style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        padding: '40px 32px',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        {/* Icône résultat */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: scoreBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          {reussi
            ? <Icon.Trophy size={36} color={T.ok} />
            : score > 0
              ? <Icon.Check size={36} color={T.orange} />
              : <Icon.X size={36} color={T.err} />
          }
        </div>

        <div style={{ fontSize: '11px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: FONT, marginBottom: '8px' }}>
          {reussi ? 'Lab complété avec succès' : score > 0 ? 'Lab terminé' : 'Lab incomplet'}
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: T.text, fontFamily: FONT, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          {lab.titre}
        </h1>

        {/* Score gros */}
        <div style={{ fontSize: '64px', fontWeight: '800', color: scoreColor, fontFamily: FONT, letterSpacing: '-2px', lineHeight: 1, margin: '20px 0 8px' }}>
          {score}%
        </div>

        <div style={{ fontSize: '14px', color: T.textSub, fontFamily: FONT }}>
          <strong style={{ color: T.text }}>{etapesOk} / {etapesTotal}</strong> étape{etapesTotal > 1 ? 's' : ''} réussie{etapesOk > 1 ? 's' : ''}
          {' · '}
          <strong style={{ color: T.text }}>{tempsMin}min {tempsSec}s</strong>
        </div>
      </div>

      {/* Liste des étapes */}
      {etapes.length > 0 && (
        <div style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          padding: '24px 28px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: T.text, fontFamily: FONT, margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Détail des étapes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {etapes.map((etape, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px',
                background: etape.completee ? T.okLight : T.errLight,
                borderRadius: '8px',
                border: `1px solid ${etape.completee ? T.ok : T.err}33`,
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: etape.completee ? T.ok : T.err,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {etape.completee ? <Icon.Check size={14} color="#fff" /> : <Icon.X size={14} color="#fff" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: T.text, fontFamily: FONT, marginBottom: '2px' }}>
                    Étape {i + 1} — {etape.nom?.replace(/etape_\d+_/, '').replace(/_/g, ' ') || 'Étape'}
                  </div>
                  {etape.description && (
                    <div style={{ fontSize: '12px', color: T.textSub, fontFamily: FONT, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {etape.description}
                    </div>
                  )}
                </div>
                {etape.temps && (
                  <div style={{ fontSize: '11px', color: T.textMuted, fontFamily: FONT, flexShrink: 0 }}>
                    {etape.temps}s
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={onRetour}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.color = T.orange }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '6px',
            border: `1px solid ${T.border}`,
            background: T.bgCard, color: T.text,
            fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <Icon.ArrowLeft size={14} color={T.text} />
          Retour à la liste
        </button>
        <button
          onClick={onRefaire}
          onMouseEnter={e => e.currentTarget.style.background = T.orangeDark}
          onMouseLeave={e => e.currentTarget.style.background = T.orange}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '6px', border: 'none',
            background: T.orange, color: '#fff',
            fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', fontFamily: FONT, transition: 'background .15s',
          }}
        >
          <Icon.Refresh size={14} color="#fff" />
          Refaire le lab
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   VUE TERMINAL
───────────────────────────────────────── */
function VueTerminal({ lab, terminalRef, onArreter, timer, T }) {
  const [hovStop, setHovStop] = useState(false)

  // Couleur du timer selon temps restant
  const minRestantes = Math.floor(timer / 60)
  const timerColor = timer <= 60 ? T.err : minRestantes < 5 ? T.orange : T.text
  const timerBg    = timer <= 60 ? T.errLight : minRestantes < 5 ? T.orangeLight : T.pillBg

  return (
    <div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: T.pillBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Terminal size={17} color={T.textSub} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: T.text, margin: '0 0 2px 0', fontFamily: FONT }}>{lab.titre}</h2>
            <p style={{ fontSize: '12px', color: T.textSub, margin: 0, fontFamily: FONT }}>Session terminal · Kubernetes with Kind</p>
          </div>
        </div>

        {/* Timer + bouton stop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Timer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 16px', borderRadius: '6px',
            background: timerBg,
            border: `1px solid ${timerColor}44`,
            transition: 'all .3s',
          }}>
            <Icon.Clock size={14} color={timerColor} />
            <span style={{
              fontSize: '15px', fontWeight: '700',
              color: timerColor,
              fontFamily: MONO,
              letterSpacing: '1px',
            }}>
              {formatTime(timer)}
            </span>
          </div>

          <button onClick={onArreter}
            onMouseEnter={() => setHovStop(true)} onMouseLeave={() => setHovStop(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', border: 'none', background: hovStop ? '#B71C1C' : '#C62828', color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
            <Icon.Stop size={13} color="#fff" />
            Arrêter le lab
          </button>
        </div>
      </div>

      <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #2A2A2A' }}>
        <div style={{ background: '#242424', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #333' }}>
          {['#FF5F57','#FFBD2E','#28C840'].map(bg => (
            <div key={bg} style={{ width: '11px', height: '11px', borderRadius: '50%', background: bg }} />
          ))}
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#666', marginLeft: '8px', fontFamily: MONO }}>
            bash — {lab.image_docker}
          </span>
        </div>
        <div ref={terminalRef} style={{ height: '500px', padding: '5px', background: '#0f1117' }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function Labs() {
  const [labs, setLabs]         = useState([])
  const [labActif, setLabActif] = useState(null)
  const [phase, setPhase]       = useState('liste')  // 'liste' | 'loading' | 'running' | 'resultat'
  const [resultat, setResultat] = useState(null)
  const [timer, setTimer]       = useState(LAB_DURATION_SECONDS)
  const [dark, setDark]         = useState(() => localStorage.getItem('theme') === 'dark')

  const terminalRef  = useRef(null)
  const socketRef    = useRef(null)
  const xtermRef     = useRef(null)
  const timerRef     = useRef(null)
  const etapesRef    = useRef([])  // Buffer des étapes détectées dans la session
  const startTimeRef = useRef(null)

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user'))
  const T        = getTheme(dark)

  function toggleDark() {
    setDark(d => { const next = !d; localStorage.setItem('theme', next ? 'dark' : 'light'); return next })
  }

  useEffect(() => {
    if (user?.role === 'admin') { navigate('/admin'); return }
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    chargerLabs()
    return () => { stopTimer(); supprimerConteneur() }
  }, [])

  async function chargerLabs() {
    const token = localStorage.getItem('token')
    const res   = await fetch('http://localhost:5000/api/labs', { headers: { Authorization: `Bearer ${token}` } })
    const data  = await res.json()
    setLabs(data)
  }

  function startTimer() {
    stopTimer()
    setTimer(LAB_DURATION_SECONDS)
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          // Temps écoulé → arrêt auto
          stopTimer()
          terminerLab('temps_ecoule')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  async function supprimerConteneur() {
    const conteneur_id = socketRef.current?.conteneur_id
    if (!conteneur_id) return
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      await fetch(`http://localhost:5000/api/labs/arreter/${conteneur_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    } catch (err) { console.log(err) }
    if (socketRef.current) socketRef.current.disconnect()
    if (xtermRef.current) { xtermRef.current.dispose(); xtermRef.current = null }
  }

  function terminerLab(raison) {
    stopTimer()
    const tempsPasse = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0
    setResultat({
      etapes: etapesRef.current,
      tempsPasse,
      raison, // 'lab_complete' | 'abandonne' | 'temps_ecoule'
    })
    setPhase('resultat')
    supprimerConteneur()
  }

  async function arreterLab() {
    terminerLab('abandonne')
  }

  async function retourListe() {
    setPhase('liste')
    setLabActif(null)
    setResultat(null)
    etapesRef.current = []
    await chargerLabs()
  }

  async function refaireLab() {
    if (!labActif) return
    const lab = labActif
    setPhase('liste')
    setLabActif(null)
    setResultat(null)
    etapesRef.current = []
    // Petit délai pour que le state se reset bien
    setTimeout(() => lancerLab(lab), 100)
  }

  async function deconnexion() {
    stopTimer()
    await supprimerConteneur()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function lancerLab(lab) {
    setLabActif(lab)
    setPhase('loading')
    etapesRef.current = []

    const socket = io('http://localhost:5000')
    socketRef.current = socket

    socket.emit('start_lab', {
      image_docker: lab.image_docker,
      cmd: lab.cmd,
      lab_id: lab._id,
      token: localStorage.getItem('token'),
    })

    socket.on('conteneur_id', id => {
      socketRef.current.conteneur_id = id
    })

    let terminalInitialise = false
    let buffer = ''

    socket.on('output', data => {
      // Détecter les événements STEP_COMPLETED pour alimenter etapesRef
      buffer += data
      const lines = buffer.split('\n')
      buffer = lines.pop() // dernière ligne peut-être incomplète
      for (const line of lines) {
        const match = line.match(/STEP_COMPLETED:([^:]+):(true|false):(.*)/)
        if (match) {
          etapesRef.current.push({
            nom: match[1],
            completee: match[2] === 'true',
            description: match[3].trim(),
          })
        }
      }

      // Premier "output" = cluster prêt, passer en phase running
      if (!terminalInitialise) {
        terminalInitialise = true
        setPhase('running')
        startTimer()
        // Initialiser le terminal après un petit délai
        setTimeout(() => {
          if (terminalRef.current && !xtermRef.current) {
            const term = new Terminal({
              cursorBlink: true, fontFamily: MONO, fontSize: 13,
              lineHeight: 1.5, theme: { background: '#0f1117' },
            })
            const fitAddon = new FitAddon()
            term.loadAddon(fitAddon)
            term.open(terminalRef.current)
            fitAddon.fit()
            xtermRef.current = term
            term.focus()
            // Écrire ce qui s'est accumulé + la data actuelle
            term.write(data)
            term.onData(d => socket.emit('input', d))
          }
        }, 100)
      } else if (xtermRef.current) {
        xtermRef.current.write(data)
      }
    })

    socket.on('lab_termine', () => {
      terminerLab('lab_complete')
    })
  }

  const categoriesMap = grouperParCategorie(labs)
  const categoriesArr = Object.entries(categoriesMap)
  let runningOffset = 0
  const categoriesWithOffset = categoriesArr.map(([nom, labs]) => {
    const offset = runningOffset
    runningOffset += labs.length
    return { nom, labs, offset }
  })

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <Navbar user={user} dark={dark} onToggleDark={toggleDark} onDeconnexion={deconnexion} T={T} />

      <div style={{ padding: '28px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        {phase === 'liste' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: T.text, margin: '0 0 5px 0', fontFamily: FONT }}>Labs disponibles</h1>
              <p style={{ fontSize: '13px', color: T.textSub, margin: 0, fontFamily: FONT }}>
                Pratiquez dans un environnement isolé et sécurisé — chaque lab est réinitialisé après chaque session.
              </p>
            </div>

            <StatsRow labs={labs} T={T} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: T.textMuted, fontFamily: FONT }}>
                Kubernetes — Parcours certifiant
              </span>
              <div style={{ flex: 1, height: '1px', background: T.border }} />
            </div>

            {categoriesWithOffset.map(({ nom, labs, offset }, i) => (
              <CategorieSection key={nom} nom={nom} labs={labs} index={i} globalOffset={offset} onLancer={lancerLab} T={T} />
            ))}
          </>
        )}

        {phase === 'loading' && <LoadingScreen lab={labActif} T={T} />}

        {phase === 'running' && (
          <VueTerminal lab={labActif} terminalRef={terminalRef} onArreter={arreterLab} timer={timer} T={T} />
        )}

        {phase === 'resultat' && resultat && (
          <ResultatScreen lab={labActif} resultat={resultat} onRefaire={refaireLab} onRetour={retourListe} T={T} />
        )}
      </div>
    </div>
  )
}

export default Labs