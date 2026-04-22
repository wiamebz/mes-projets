import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────
   THÈME — light / dark (admin)
───────────────────────────────────────── */
function getTheme(dark) {
  return dark ? {
    bg:          '#111318',
    bgSecond:    '#1A1D24',
    bgCard:      '#1E2128',
    bgHeader:    '#23272F',
    bgRowHover:  '#23272F',
    border:      '#2A2D37',
    text:        '#F0F0F0',
    textSub:     '#9AA0B0',
    textMuted:   '#5A6070',
    orange:      '#FF7900',
    orangeDark:  '#E05C00',
    orangeLight: 'rgba(255,121,0,0.15)',
    ok:          '#4CAF50',
    okLight:     'rgba(76,175,80,0.15)',
    err:         '#EF5350',
    errLight:    'rgba(239,83,80,0.15)',
    info:        '#42A5F5',
    infoLight:   'rgba(66,165,245,0.12)',
    navBg:       '#13151B',
    pillBg:      '#2A2D37',
    inputBg:     '#23272F',
    btnBg:       '#23272F',
    logoIcon:    '#F0F0F0',
    logoText:    '#F0F0F0',
    avatarBg:    '#FF7900',
  } : {
    bg:          '#F2F2F2',
    bgSecond:    '#FAFAFA',
    bgCard:      '#FFFFFF',
    bgHeader:    '#FAFAFA',
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
    info:        '#1976D2',
    infoLight:   '#E3F2FD',
    navBg:       '#FFFFFF',
    pillBg:      '#F4F4F4',
    inputBg:     '#FFFFFF',
    btnBg:       '#FFFFFF',
    logoIcon:    '#1A1A1A',
    logoText:    '#1A1A1A',
    avatarBg:    '#1A1A1A',
  }
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ─────────────────────────────────────────
   ICÔNES SVG — Lucide style 1.5
───────────────────────────────────────── */
const Icon = {
  Logout: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Lock: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  Unlock: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 0 1 7-2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Calendar: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 10h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Layers: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Box: ({ size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Save: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M17 21v-8H7v8M7 3v5h8" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Refresh: ({ size = 13, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M3 21v-5h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  X: ({ size = 14, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
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
const initiales = nom => {
  if (!nom) return 'US'
  const p = nom.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.slice(0, 2).toUpperCase()
}

function toDateInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

function formatDateFr(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const getDiffColors = (T) => ({
  'Débutant':      T.ok,
  'Intermédiaire': T.orange,
  'Avancé':        T.err,
})

/* ─────────────────────────────────────────
   NAVBAR ADMIN
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

  return (
    <nav style={{
      background: T.navBg, borderBottom: `3px solid ${T.orange}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '60px', position: 'sticky', top: 0, zIndex: 200,
      boxSizing: 'border-box', transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
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

        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: T.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', fontFamily: FONT, transition: 'background .3s' }}>
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
   BADGE ÉTAT
───────────────────────────────────────── */
function StatusBadge({ etat, label, size = 'md', T }) {
  let color, bg, icon
  if (etat === 'deblocage_manuel') {
    color = T.ok; bg = T.okLight
    icon = <Icon.Unlock size={12} color={color} />
  } else if (etat === 'verrouillage_manuel') {
    color = T.err; bg = T.errLight
    icon = <Icon.Lock size={12} color={color} />
  } else {
    color = T.textSub; bg = T.pillBg
    icon = <Icon.Refresh size={12} color={color} />
  }

  const padding = size === 'sm' ? '3px 8px' : '4px 10px'
  const fontSize = size === 'sm' ? '10px' : '11px'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding, borderRadius: '4px',
      background: bg, color,
      fontSize, fontWeight: '700',
      fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.4px',
      border: `1px solid ${color}33`,
    }}>
      {icon}
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────
   SEGMENTED CONTROL
───────────────────────────────────────── */
function SegmentedControl({ value, onChange, options, T }) {
  return (
    <div style={{
      display: 'inline-flex', borderRadius: '6px',
      border: `1px solid ${T.border}`, overflow: 'hidden',
      background: T.btnBg,
    }}>
      {options.map((opt, i) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', border: 'none',
              borderLeft: i > 0 ? `1px solid ${T.border}` : 'none',
              background: isActive ? opt.color : T.btnBg,
              color: isActive ? '#fff' : T.textSub,
              fontSize: '11px', fontWeight: '600',
              cursor: 'pointer', fontFamily: FONT,
              transition: 'all .15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bgSecond }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = T.btnBg }}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────
   LIGNE TABLEAU LAB
───────────────────────────────────────── */
function LabRow({ lab, onUpdate, toast, T }) {
  const [saving, setSaving] = useState(false)

  const value = lab.deblocage_manuel ? 'unlock'
              : lab.verrouillage_manuel ? 'lock'
              : 'auto'

  async function changer(nouveau) {
    setSaving(true)
    const update = {
      verrouillage_manuel: nouveau === 'lock',
      deblocage_manuel:    nouveau === 'unlock',
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/admin/labs/${lab._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(update),
      })
      const data = await res.json()
      if (res.ok) {
        toast(`"${lab.titre}" mis à jour`, 'success')
        onUpdate()
      } else {
        toast(data.message || 'Erreur', 'error')
      }
    } catch (err) {
      toast('Erreur de connexion', 'error')
    } finally {
      setSaving(false)
    }
  }

  const DIFF_COLORS = getDiffColors(T)
  const diffColor = DIFF_COLORS[lab.difficulte] || T.textSub

  return (
    <tr style={{ borderBottom: `1px solid ${T.border}`, opacity: saving ? 0.5 : 1 }}>
      <td style={{ padding: '12px 16px', width: '40px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: '50%',
          background: T.pillBg, color: T.textSub,
          fontSize: '11px', fontWeight: '700', fontFamily: FONT,
        }}>
          {String(lab.ordre).padStart(2, '0')}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon.Box size={16} color={T.textSub} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: T.text, fontFamily: FONT }}>
            {lab.titre}
          </span>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700',
          padding: '3px 9px', borderRadius: '3px',
          background: `${diffColor}20`, color: diffColor,
          fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.4px',
        }}>
          {lab.difficulte}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <StatusBadge etat={lab.etat} label={lab.etatLabel} size="sm" T={T} />
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <SegmentedControl
          value={value}
          onChange={changer}
          T={T}
          options={[
            { value: 'lock',   label: 'Verrouiller', icon: <Icon.Lock size={11} color={value === 'lock' ? '#fff' : T.err} />,  color: T.err },
            { value: 'unlock', label: 'Débloquer',   icon: <Icon.Unlock size={11} color={value === 'unlock' ? '#fff' : T.ok} />, color: T.ok },
            { value: 'auto',   label: 'Auto',        icon: <Icon.Refresh size={11} color={value === 'auto' ? '#fff' : T.textSub} />, color: T.textSub },
          ]}
        />
      </td>
    </tr>
  )
}

/* ─────────────────────────────────────────
   CARD CATÉGORIE
───────────────────────────────────────── */
function CategorieCard({ cat, onUpdate, toast, T }) {
  const [verrouillage, setVerrouillage]   = useState(cat.verrouillage_manuel)
  const [deblocage, setDeblocage]         = useState(cat.deblocage_manuel)
  const [dateOuverture, setDateOuverture] = useState(toDateInput(cat.date_ouverture))
  const [saving, setSaving]               = useState(false)
  const [bulkSaving, setBulkSaving]       = useState(false)
  const [hovSave, setHovSave]             = useState(false)

  const aChange =
    verrouillage  !== cat.verrouillage_manuel ||
    deblocage     !== cat.deblocage_manuel    ||
    dateOuverture !== toDateInput(cat.date_ouverture)

  const valueCat = deblocage ? 'unlock' : verrouillage ? 'lock' : 'auto'

  function changerCategorie(nouveau) {
    setVerrouillage(nouveau === 'lock')
    setDeblocage(nouveau === 'unlock')
  }

  async function enregistrer() {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/admin/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          verrouillage_manuel: verrouillage,
          deblocage_manuel:    deblocage,
          date_ouverture:      dateOuverture || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast(`Catégorie "${cat.nom}" mise à jour`, 'success')
        onUpdate()
      } else {
        toast(data.message || 'Erreur', 'error')
      }
    } catch (err) {
      toast('Erreur de connexion', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function actionEnMasse(action) {
    const labels = {
      lock_all:   'Verrouiller tous les labs',
      unlock_all: 'Débloquer tous les labs',
      reset_all:  'Réinitialiser tous les labs',
    }
    if (!window.confirm(`${labels[action]} de "${cat.nom}" ?`)) return

    setBulkSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/admin/categories/${cat._id}/labs-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        toast(`${data.modifiedCount} lab(s) mis à jour`, 'success')
        onUpdate()
      } else {
        toast(data.message || 'Erreur', 'error')
      }
    } catch (err) {
      toast('Erreur de connexion', 'error')
    } finally {
      setBulkSaving(false)
    }
  }

  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${aChange ? T.orange : T.border}`,
      borderRadius: '8px', overflow: 'hidden',
      marginBottom: '20px',
      transition: 'all .2s',
      boxShadow: aChange ? '0 4px 14px rgba(255,121,0,0.10)' : 'none',
    }}>
      {/* HEADER CATÉGORIE */}
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, background: T.bgHeader, transition: 'background .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: T.orangeLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Layers size={18} color={T.orange} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: FONT, marginBottom: '2px' }}>
              Domaine {cat.ordre}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: T.text, margin: 0, fontFamily: FONT }}>
              {cat.nom}
            </h3>
            {cat.description && (
              <p style={{ fontSize: '12px', color: T.textSub, margin: '3px 0 0 0', fontFamily: FONT }}>
                {cat.description}
              </p>
            )}
          </div>
          <StatusBadge etat={cat.etat} label={cat.etatLabel} T={T} />
        </div>

        {/* CONTRÔLE CATÉGORIE + DATE */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: FONT }}>
              État catégorie
            </span>
            <SegmentedControl
              value={valueCat}
              onChange={changerCategorie}
              T={T}
              options={[
                { value: 'lock',   label: 'Verrouiller', icon: <Icon.Lock size={12} color={valueCat === 'lock' ? '#fff' : T.err} />,  color: T.err },
                { value: 'unlock', label: 'Débloquer',   icon: <Icon.Unlock size={12} color={valueCat === 'unlock' ? '#fff' : T.ok} />, color: T.ok },
                { value: 'auto',   label: 'Automatique', icon: <Icon.Refresh size={12} color={valueCat === 'auto' ? '#fff' : T.textSub} />, color: T.textSub },
              ]}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon.Calendar size={14} color={T.textSub} />
            <input
              type="date"
              value={dateOuverture}
              onChange={e => setDateOuverture(e.target.value)}
              disabled={deblocage || verrouillage}
              style={{
                padding: '7px 12px', borderRadius: '6px',
                border: `1px solid ${T.border}`, fontSize: '12px',
                fontFamily: FONT, color: T.text,
                background: (deblocage || verrouillage) ? T.pillBg : T.inputBg,
                cursor: (deblocage || verrouillage) ? 'not-allowed' : 'text',
                opacity: (deblocage || verrouillage) ? 0.5 : 1,
                colorScheme: 'dark',
              }}
            />
            {dateOuverture && !deblocage && !verrouillage && (
              <button onClick={() => setDateOuverture('')}
                style={{ padding: '7px', border: `1px solid ${T.border}`, borderRadius: '6px', background: T.btnBg, color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Icon.X size={12} color={T.textSub} />
              </button>
            )}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={enregistrer}
            disabled={!aChange || saving}
            onMouseEnter={() => setHovSave(true)}
            onMouseLeave={() => setHovSave(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontSize: '12px', fontWeight: '700',
              padding: '8px 16px', borderRadius: '5px', border: 'none',
              background: !aChange ? T.pillBg : (hovSave ? T.orangeDark : T.orange),
              color: !aChange ? T.textMuted : '#fff',
              cursor: !aChange || saving ? 'not-allowed' : 'pointer',
              fontFamily: FONT, transition: 'background .15s',
            }}
          >
            <Icon.Save size={12} color={!aChange ? T.textMuted : '#fff'} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {dateOuverture && !deblocage && !verrouillage && (
          <div style={{ fontSize: '11px', color: T.textSub, marginTop: '10px', fontFamily: FONT, fontStyle: 'italic' }}>
            Ouverture programmée le <strong style={{ color: T.text }}>{formatDateFr(dateOuverture)}</strong>
          </div>
        )}
      </div>

      {/* TABLEAU DES LABS */}
      <div style={{ padding: '0' }}>
        {cat.labs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: T.textSub, fontSize: '13px', fontFamily: FONT }}>
            Aucun lab dans cette catégorie
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.bgCard, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon.Box size={14} color={T.textSub} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: T.text, fontFamily: FONT }}>
                  {cat.labs.length} lab{cat.labs.length > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <BulkButton onClick={() => actionEnMasse('lock_all')} disabled={bulkSaving} icon={<Icon.Lock size={11} color={T.err} />} color={T.err} bg={T.errLight} T={T}>
                  Tout verrouiller
                </BulkButton>
                <BulkButton onClick={() => actionEnMasse('unlock_all')} disabled={bulkSaving} icon={<Icon.Unlock size={11} color={T.ok} />} color={T.ok} bg={T.okLight} T={T}>
                  Tout débloquer
                </BulkButton>
                <BulkButton onClick={() => actionEnMasse('reset_all')} disabled={bulkSaving} icon={<Icon.Refresh size={11} color={T.textSub} />} color={T.textSub} bg={T.pillBg} T={T}>
                  Tout en auto
                </BulkButton>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Titre du lab', 'Difficulté', 'État actuel', 'Contrôle individuel'].map((h, i) => (
                    <th key={h} style={{
                      background: T.bgHeader, padding: '10px 16px',
                      fontSize: '10px', fontWeight: '700',
                      textTransform: 'uppercase', letterSpacing: '0.6px',
                      color: T.textMuted, textAlign: i === 4 ? 'right' : 'left',
                      borderBottom: `1px solid ${T.border}`, fontFamily: FONT,
                      transition: 'background .3s',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cat.labs.map(lab => (
                  <LabRow key={lab._id} lab={lab} onUpdate={onUpdate} toast={toast} T={T} />
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   BULK BUTTON
───────────────────────────────────────── */
function BulkButton({ onClick, disabled, icon, color, bg, children, T }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px', borderRadius: '4px',
        border: `1px solid ${color}33`,
        background: hov ? bg : T.btnBg,
        color, fontSize: '11px', fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: FONT, transition: 'all .15s',
      }}
    >
      {icon}
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function Toast({ toast, T }) {
  if (!toast) return null
  const bg = toast.type === 'success' ? T.ok : T.err
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 300,
      padding: '12px 20px', borderRadius: '6px',
      background: bg, color: '#fff',
      fontSize: '13px', fontWeight: '600', fontFamily: FONT,
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: '8px',
      animation: 'slideUp .3s ease',
    }}>
      {toast.type === 'success' ? <Icon.Check size={14} color="#fff" /> : <Icon.X size={14} color="#fff" />}
      {toast.message}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────
   STAT BOX
───────────────────────────────────────── */
function StatBox({ icon, value, label, T }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: '6px', padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: '10px',
      minWidth: '110px',
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: T.orangeLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: T.text, fontFamily: FONT, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: FONT, marginTop: '3px' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
function AdminGestion() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [toastState, setToastState] = useState(null)
  const [dark, setDark]             = useState(() => localStorage.getItem('theme_admin') === 'dark')

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const user     = JSON.parse(localStorage.getItem('user'))
  const T        = getTheme(dark)

  function toggleDark() {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme_admin', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => { chargerCategories() }, [])

  async function chargerCategories() {
    try {
      const res  = await fetch('http://localhost:5000/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.log(err)
      showToast('Erreur de chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  function showToast(message, type) {
    setToastState({ message, type })
    setTimeout(() => setToastState(null), 3000)
  }

  function deconnexion() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const totalLabs = categories.reduce((s, c) => s + c.nombreLabs, 0)
  const totalCats = categories.length

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, transition: 'background .3s' }}>
      <NavbarAdmin user={user} onDeconnexion={deconnexion} navigate={navigate} dark={dark} onToggleDark={toggleDark} T={T} />
      <Breadcrumb items={[
        { label: 'Administration', onClick: () => navigate('/admin') },
        { label: 'Parcours' },
      ]} T={T} />

      <div style={{ padding: '26px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: T.text, margin: '0 0 4px 0', fontFamily: FONT }}>
              Gestion du parcours
            </h1>
            <p style={{ fontSize: '13px', color: T.textSub, margin: 0, fontFamily: FONT }}>
              Contrôlez l'accès aux catégories et aux labs individuellement.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexShrink: 0 }}>
            <StatBox icon={<Icon.Layers size={14} color={T.orange} />} value={totalCats} label="Catégories" T={T} />
            <StatBox icon={<Icon.Box size={14} color={T.orange} />} value={totalLabs} label="Labs" T={T} />
          </div>
        </div>

        {loading ? (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '40px', textAlign: 'center', color: T.textSub, fontSize: '13px', fontFamily: FONT }}>
            Chargement...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '40px', textAlign: 'center', color: T.textSub, fontSize: '13px', fontFamily: FONT }}>
            Aucune catégorie trouvée
          </div>
        ) : (
          <>
            {categories.map((cat) => (
              <CategorieCard
                key={cat._id}
                cat={cat}
                onUpdate={chargerCategories}
                toast={showToast}
                T={T}
              />
            ))}
          </>
        )}
      </div>

      <Toast toast={toastState} T={T} />
    </div>
  )
}

export default AdminGestion