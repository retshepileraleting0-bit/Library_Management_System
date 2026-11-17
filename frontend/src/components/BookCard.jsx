import '../styles/Dashboard.css'

function BookCard({ book }) {
  const isLow = book.quantity < 2

  return (
    <div className={`book-card ${isLow ? 'book-card-low' : ''}`}>
      <div className="book-card-header">
        <span className="category-badge">{book.category || 'Uncategorised'}</span>
        {isLow && <span className="low-badge">Low Stock</span>}
      </div>
      <h3 className="book-card-title">{book.title}</h3>
      <p className="book-card-author">by {book.author}</p>
      {book.isbn && <p className="book-card-isbn">ISBN: {book.isbn}</p>}
      {book.description && (
        <p className="book-card-desc">{book.description}</p>
      )}
      <div className="book-card-footer">
        <span className={`quantity-badge ${isLow ? 'qty-low' : 'qty-ok'}`}>
          {book.quantity} in stock
        </span>
      </div>
    </div>
  )
}

export default BookCard
