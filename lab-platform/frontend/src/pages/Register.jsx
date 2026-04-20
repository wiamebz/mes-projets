import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
  err:         '#C62828',
  errLight:    '#FFEBEE',
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

function Register() {
  const [nom, setNom]               = useState('')
  const [email, setEmail]           = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [focusNom, setFocusNom]     = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPass, setFocusPass]   = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, mot_de_passe: motDePasse }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/labs')
      } else {
        setErreur(data.message)
      }
    } catch (err) {
      setErreur('Erreur de connexion au serveur.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      fontFamily: FONT,
    }}>

      {/* Panneau gauche — branding identique au Login */}
      <div style={{
        width: '420px',
        flexShrink: 0,
        background: C.black,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Accent orange */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3px', background: C.orange,
        }} />

        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '6px',
              background: C.orange, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: C.white, fontFamily: FONT }}>
                Lab<span style={{ color: C.orange }}>Platform</span>
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px', fontFamily: FONT }}>
                by Learneo
              </div>
            </div>
          </div>

          <h2 style={{
            fontSize: '26px', fontWeight: '700', color: C.white,
            margin: '0 0 14px 0', fontFamily: FONT, lineHeight: 1.3,
            letterSpacing: '-0.4px',
          }}>
            Rejoignez la<br />
            <span style={{ color: C.orange }}>plateforme</span>
          </h2>
          <p style={{
            fontSize: '13px', color: '#888', lineHeight: 1.7,
            margin: 0, fontFamily: FONT,
          }}>
            Créez votre compte et commencez à pratiquer
            dans des environnements Kubernetes sécurisés.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            'Accès immédiat aux labs',
            'Progression sauvegardée automatiquement',
            'Environnement réinitialisé à chaque session',
          ].map(txt => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '1px solid #444', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={C.orange} strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: FONT }}>{txt}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ fontSize: '11px', color: '#444', fontFamily: FONT }}>
          © 2026 Learneo 
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* En-tête */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '22px', fontWeight: '700', color: C.black,
              margin: '0 0 6px 0', fontFamily: FONT, letterSpacing: '-0.4px',
            }}>
              Créer un compte
            </h1>
            <p style={{ fontSize: '13px', color: C.midGray, margin: 0, fontFamily: FONT }}>
              Remplissez les informations ci-dessous
            </p>
          </div>

          {/* Erreur */}
          {erreur && (
            <div style={{
              background: C.errLight,
              border: '1px solid #EF9A9A',
              borderRadius: '4px',
              padding: '11px 14px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.25" stroke={C.err} strokeWidth="1.25"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke={C.err} strokeWidth="1.25"
                  strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '13px', color: C.err, fontFamily: FONT }}>
                {erreur}
              </span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleRegister}>

            {/* Nom */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', color: C.darkGray,
                display: 'block', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT,
              }}>
                Nom complet
              </label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                onFocus={() => setFocusNom(true)}
                onBlur={() => setFocusNom(false)}
                placeholder="Prénom Nom"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  background: C.white, fontSize: '13px', fontFamily: FONT,
                  color: C.black, boxSizing: 'border-box',
                  border: `1px solid ${focusNom ? C.orange : C.border}`,
                  borderRadius: '4px', outline: 'none',
                  transition: 'border-color .15s',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', color: C.darkGray,
                display: 'block', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT,
              }}>
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                placeholder="prenom.nom@orange.com"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  background: C.white, fontSize: '13px', fontFamily: FONT,
                  color: C.black, boxSizing: 'border-box',
                  border: `1px solid ${focusEmail ? C.orange : C.border}`,
                  borderRadius: '4px', outline: 'none',
                  transition: 'border-color .15s',
                }}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', color: C.darkGray,
                display: 'block', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT,
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={motDePasse}
                onChange={e => setMotDePasse(e.target.value)}
                onFocus={() => setFocusPass(true)}
                onBlur={() => setFocusPass(false)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  background: C.white, fontSize: '13px', fontFamily: FONT,
                  color: C.black, boxSizing: 'border-box',
                  border: `1px solid ${focusPass ? C.orange : C.border}`,
                  borderRadius: '4px', outline: 'none',
                  transition: 'border-color .15s',
                }}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.orangeDark }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.orange }}
              style={{
                width: '100%', padding: '11px',
                background: loading ? '#FFBD8A' : C.orange,
                color: '#fff', border: 'none', borderRadius: '4px',
                fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: FONT, transition: 'background .15s',
              }}
            >
              {loading ? 'Création du compte...' : "Créer mon compte"}
            </button>
          </form>

          {/* Lien connexion */}
          <p style={{
            textAlign: 'center', marginTop: '20px',
            fontSize: '13px', color: C.midGray, fontFamily: FONT,
          }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{
              color: C.orange, textDecoration: 'none', fontWeight: '600',
            }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register