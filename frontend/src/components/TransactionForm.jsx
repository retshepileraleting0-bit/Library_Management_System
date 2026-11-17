import { useState } from 'react'
import { createTransaction } from '../api'
import { useAuth } from '../context/AuthContext'
import '../styles/Transactions.css'

function TransactionForm({ books, onSuccess, onCancel }) {
  const { user } = useAuth()

  const [bookId, setBookId] = useState('')
  const [type, setType] = useState('add')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!bookId) {
      setError('Please select a book.')
      return
    }

    setSaving(true)
    try {
      await createTransaction({
        bookId: Number(bookId),
        type,
        quantity: Number(quantity),
        notes,
        createdBy: user?.username || 'unknown',
      })
      onSuccess()
    } catch (err) {
      setError(err.message || 'Could not save transaction.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-panel">
      <h2>Record a Transaction</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="book">Book *</label>
          <select id="book" value={bookId} onChange={(e) => setBookId(e.target.value)} required>
            <option value="">-- Select a book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} (currently {b.quantity} in stock)
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Transaction Type *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="add"
                  checked={type === 'add'}
                  onChange={() => setType('add')}
                />
                Add stock
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="deduct"
                  checked={type === 'deduct'}
                  onChange={() => setType('deduct')}
                />
                Deduct stock
              </label>
            </div>
          </div>

          <div className="form-group form-group-small">
            <label htmlFor="qty">Quantity *</label>
            <input
              id="qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. New delivery from publisher, or book lost"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Record Transaction'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
