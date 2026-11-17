function LowStockAlert({ books }) {
  return (
    <div className="low-stock-alert">
      <strong>Low Stock Warning</strong>
      <p>The following books have fewer than 2 copies remaining:</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> - {book.quantity} left
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LowStockAlert
