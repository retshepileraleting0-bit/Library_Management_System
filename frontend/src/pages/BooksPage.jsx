import { useState, useEffect } from 'react'
import { getBooks, deleteBook } from '../api'
import BookForm from '../components/BookForm'
import '../styles/Books.css'

function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingBook, setEditingBook] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      const data = await getBooks()
      setBooks(data)
    } catch (err) {
      setError('Could not load books.')
    } finally {
      setLoading(false)
    }
  }

  function handleAddNew() {
    setEditingBook(null)
    setShowForm(true)
  }

  function handleEdit(book) {
    setEditingBook(book)
    setShowForm(true)
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    )
    if (!confirmed) return

    try {
      await deleteBook(book.id)
      setBooks(books.filter((b) => b.id !== book.id))
    } catch (err) {
      alert('Could not delete book: ' + err.message)
    }
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingBook(null)
    fetchBooks()
  }

  if (loading) return <div className="page-loading">Loading books...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div className="books-page">
      <div className="page-header">
        <h1 className="page-title">Book Management</h1>
        <button className="btn-primary" onClick={handleAddNew}>
          + Add New Book
        </button>
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No books found.</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className={book.quantity < 2 ? 'low-stock-row' : ''}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className="category-badge">{book.category}</span></td>
                  <td>{book.isbn}</td>
                  <td>
                    <span className={`quantity-badge ${book.quantity < 2 ? 'qty-low' : 'qty-ok'}`}>
                      {book.quantity}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(book)}
                    >
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

export default BooksPage
