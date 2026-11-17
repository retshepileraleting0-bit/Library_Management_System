import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '../api'
import UserForm from '../components/UserForm'
import '../styles/Users.css'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError('Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  function handleAddNew() {
    setEditingUser(null)
    setShowForm(true)
  }

  function handleEdit(user) {
    setEditingUser(user)
    setShowForm(true)
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Delete user "${user.username}"?`
    )
    if (!confirmed) return

    try {
      await deleteUser(user.id)
      setUsers(users.filter((u) => u.id !== user.id))
    } catch (err) {
      alert('Could not delete user: ' + err.message)
    }
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingUser(null)
    fetchUsers()
  }

  if (loading) return <div className="page-loading">Loading users...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add New User
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage
