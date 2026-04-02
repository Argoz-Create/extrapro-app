'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function MaintenancePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Mot de passe incorrect.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8faf8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#16a34a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      </div>

      {/* Wordmark */}
      <h1 style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#111827',
        letterSpacing: '-0.02em',
        marginBottom: 6,
      }}>
        EXTRAPRO
      </h1>

      {/* Status */}
      <p style={{
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 1.5,
      }}>
        Site en cours de développement.<br />
        Revenez bientôt.
      </p>

      {/* Password form */}
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Accès partenaire"
          autoComplete="current-password"
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 15,
            border: error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
            borderRadius: 8,
            outline: 'none',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            padding: '12px',
            backgroundColor: loading || !password ? '#86efac' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
          }}
        >
          {loading ? 'Vérification...' : 'Accéder'}
        </button>
      </form>

    </div>
  )
}
