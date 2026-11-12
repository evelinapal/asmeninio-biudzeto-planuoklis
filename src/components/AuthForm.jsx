import { useState } from 'react'
import { supabase } from '../supabase'

export default function AuthForm() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const isRegister = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!email.trim() || !password) {
      setMessageType('error')
      setMessage('Įveskite el. paštą ir slaptažodį.')
      return
    }

    setLoading(true)
    try {
      const { error } = isRegister
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })

      if (error) throw error

      setMessageType('success')
      setMessage(
        isRegister
          ? 'Registracija sėkminga. Jei reikia, patvirtinkite el. paštą.'
          : 'Prisijungėte sėkmingai.',
      )
    } catch (error) {
      setMessageType('error')
      setMessage(error?.message || 'Nepavyko prisijungti prie paskyros. Bandykite dar kartą.')
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setMessage('')
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit} aria-busy={loading}>
      <label htmlFor="auth-email">El. paštas</label>
      <input
        id="auth-email"
        type="email"
        autoComplete="email"
        placeholder="vardas@example.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value)
          setMessage('')
        }}
        required
      />

      <label htmlFor="auth-password">Slaptažodis</label>
      <input
        id="auth-password"
        type="password"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        placeholder="Įveskite slaptažodį"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value)
          setMessage('')
        }}
        required
      />

      {message ? (
        <p className={messageType === 'error' ? 'form-error' : 'form-success'} role="status">
          {message}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Prašome palaukti…' : isRegister ? 'Registruotis' : 'Prisijungti'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={toggleMode} disabled={loading}>
          {isRegister ? 'Jau turite paskyrą? Prisijunkite' : 'Neturite paskyros? Registruokitės'}
        </button>
      </div>
    </form>
  )
}
