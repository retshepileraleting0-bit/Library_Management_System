import { useState, useEffect } from 'react'
import { createBook, updateBook } from '../api'
import '../styles/Books.css'

function BookForm({ book, onSuccess, onCancel }) {
  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [category, setCategory] = useState(book?.category || '')
  const [isbn, setIsbn] = useState(book?.isbn || '')
  const [quantity, setQuantity] = useState(book?.quantity ?? 0)
  const [description, setDescription] = useState(book?.description || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(book?.title || '')
    setAuthor(book?.author || '')
    setCategory(book?.category || '')
    setIsbn(book?.isbn || '')
    setQuantity(book?.quantity ?? 0)
    setDescription(book?.description || '')
  }, [book])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const bookData = { title, author, category, isbn, quantity: Number(quantity), description }

    try {
      if (book) {
        await updateBook(book.id, bookData)
      } else {
        await createBook(bookData)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Could not save book.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-panel">
      <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. To Kill a Mockingbird"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Harper Lee"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-- Select category --</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
              <option value="Biography">Biography</option>
              <option value="Children">Children</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              id="isbn"
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-0-06-112008-4"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-small">
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short summary of the book..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : book ? 'Save Changes' : 'Add Book'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookForm
