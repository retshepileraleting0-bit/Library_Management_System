import { useState, useEffect } from 'react'
import { getTransactions, getBooks } from '../api'
import TransactionForm from '../components/TransactionForm'
import '../styles/Transactions.css'

function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    Promise.all([
      getTransactions().then(setTransactions),
      getBooks().then(setBooks),
    ])
      .catch(() => setError('Could not load data.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleFormSuccess() {
    setShowForm(false)
    try {
      const data = await getTransactions()
      setTransactions(data)
    } catch (err) {
      console.error(err)
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="page-loading">Loading transactions...</div>
  if (error) return <div className="page-error">{error}</div>

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Record Transaction'}
        </button>
      </div>

      {showForm && (
        <TransactionForm
          books={books}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No transactions recorded yet.</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.book_title || tx.bookTitle || 'Unknown'}</td>
                  <td>
                    <span className={`type-badge ${tx.type === 'add' ? 'type-add' : 'type-deduct'}`}>
                      {tx.type === 'add' ? '+ Add' : '- Deduct'}
                    </span>
                  </td>
                  <td>{tx.quantity}</td>
                  <td>{tx.notes || '-'}</td>
                  <td>{formatDate(tx.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionsPage
