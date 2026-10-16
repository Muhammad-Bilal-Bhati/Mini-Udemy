import { useState } from 'react'
import { api } from '../api'

function AuthModal({ mode, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isSignup = mode === 'signup'

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = isSignup ? await api.signUp(form) : await api.signIn({ email: form.email, password: form.password })
      onSuccess(result.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal auth-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>x</button>
        <p className="eyebrow">{isSignup ? 'START YOUR JOURNEY' : 'WELCOME BACK'}</p>
        <h2>{isSignup ? 'Make space to grow.' : 'Pick up where you left off.'}</h2>
        <form onSubmit={submit}>
          {isSignup && <input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
          {isSignup && <label className="field-label">I want to join as
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="student">Student - learn and review courses</option>
              <option value="instructor">Instructor - create courses</option>
            </select>
          </label>}
          <input required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input required minLength="6" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {error && <p className="form-error">{error}</p>}
          <button className="dark-button full" disabled={busy}>{busy ? 'Working...' : isSignup ? 'Create account' : 'Log in'}</button>
        </form>
        <button className="switch-auth" onClick={onClose}>{isSignup ? 'Already have an account? Log in' : 'New here? Join free'}</button>
      </div>
    </div>
  )
}

export default AuthModal
