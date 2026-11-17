import { useState, useEffect } from 'react'
import { getBooks } from '../api'
import BookCard from '../components/BookCard'
import LowStockAlert from '../components/LowStockAlert'
import '../styles/Dashboard.css'

function Dashboard() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const totalBooks = books.length
  const totalStock = books.reduce((sum, book) => sum + book.quantity, 0)
  const lowStockBooks = books.filter((book) => book.quantity < 2)

  if (loading) return <div className="page-loading">Loading dashboard...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      <div className="summary-cards">
        <div className="summary-card">
          <div>
            <h2>{totalBooks}</h2>
            <p>Total Books</p>
          </div>
        </div>
        <div className="summary-card">
          <div>
            <h2>{totalStock}</h2>
            <p>Total Stock</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div>
            <h2>{lowStockBooks.length}</h2>
            <p>Low Stock</p>
          </div>
        </div>
      </div>

      {lowStockBooks.length > 0 && (
        <LowStockAlert books={lowStockBooks} />
      )}

      <h2 className="section-title">All Books</h2>
      {books.length === 0 ? (
        <p className="no-data">No books in the library yet.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
