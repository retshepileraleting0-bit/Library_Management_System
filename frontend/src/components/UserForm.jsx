import { useState, useEffect } from 'react'
import { createUser, updateUser } from '../api'
import '../styles/Users.css'

function UserForm({ user, onSuccess, onCancel }) {
  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(user?.role || 'librarian')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setUsername(user?.username || '')
    setPassword('')
    setRole(user?.role || 'librarian')
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!user && !password) {
      setError('Password is required for new users.')
      return
    }

    const userData = { username, role }
    if (password) userData.password = password

    setSaving(true)
    try {
      if (user) {
        await updateUser(user.id, userData)
      } else {
        await createUser(userData)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Could not save user.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-panel">
      <h2>{user ? 'Edit User' : 'Add New User'}</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="uname">Username *</label>
          <input
            id="uname"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. john_librarian"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="upass">
            Password {user ? '(leave blank to keep current)' : '*'}
          </label>
          <input
            id="upass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={user ? 'Leave blank to keep unchanged' : 'Enter a password'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="urole">Role *</label>
          <select id="urole" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : user ? 'Save Changes' : 'Add User'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
