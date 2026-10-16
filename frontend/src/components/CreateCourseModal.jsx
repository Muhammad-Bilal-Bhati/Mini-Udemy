import { useState } from 'react'
import { api } from '../api'

function CreateCourseModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await api.createCourse({ ...form, price: Number(form.price) })
      onCreated(result.data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal create-course-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>x</button>
        <p className="eyebrow">INSTRUCTOR STUDIO</p>
        <h2>Shape your next course.</h2>
        <form className="course-form" onSubmit={submit}>
          <input name="title" required placeholder="Course title" value={form.title} onChange={updateField} />
          <textarea name="description" required minLength="10" placeholder="What will students learn?" value={form.description} onChange={updateField} />
          <div className="form-row"><input name="category" required placeholder="Category e.g. Design" value={form.category} onChange={updateField} /><input name="price" required min="0" type="number" placeholder="Price" value={form.price} onChange={updateField} /></div>
          {error && <p className="form-error">{error}</p>}
          <button className="dark-button full" disabled={busy}>{busy ? 'Publishing...' : 'Publish course'}</button>
        </form>
      </div>
    </div>
  )
}

export default CreateCourseModal
