const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const transactions = await query(`
      SELECT 
        t.id,
        t.type,
        t.quantity,
        t.notes,
        t.created_at,
        b.title AS book_title,
        b.id AS book_id,
        u.username AS created_by
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { bookId, type, quantity, notes } = req.body;

  if (!bookId || !type || !quantity) {
    return res.status(400).json({ message: 'bookId, type, and quantity are required' });
  }

  if (type !== 'add' && type !== 'deduct') {
    return res.status(400).json({ message: 'type must be "add" or "deduct"' });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: 'quantity must be a positive number' });
  }

  try {
    const books = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = books[0];

    if (type === 'deduct' && book.quantity < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Current quantity is ${book.quantity}`
      });
    }

    const newQty = type === 'add' ? book.quantity + quantity : book.quantity - quantity;
    await query('UPDATE books SET quantity = ? WHERE id = ?', [newQty, bookId]);

    const result = await query(
      'INSERT INTO transactions (book_id, type, quantity, notes, created_by) VALUES (?, ?, ?, ?, ?)',
      [bookId, type, quantity, notes || null, req.user.id]
    );

    res.status(201).json({
      message: `Stock ${type === 'add' ? 'added' : 'deducted'} successfully`,
      transactionId: result.insertId,
      newQuantity: newQty
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
