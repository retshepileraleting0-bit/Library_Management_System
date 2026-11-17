const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const books = await query('SELECT * FROM books ORDER BY title ASC');
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const books = await query('SELECT * FROM books WHERE id = ?', [req.params.id]);

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(books[0]);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { title, author, category, isbn, quantity, description } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  try {
    const result = await query(
      'INSERT INTO books (title, author, category, isbn, quantity, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, category || null, isbn || null, quantity || 0, description || null]
    );

    const newBook = await query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    res.status(201).json(newBook[0]);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const { title, author, category, isbn, quantity, description } = req.body;

  try {
    const existing = await query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = existing[0];
    await query(
      'UPDATE books SET title=?, author=?, category=?, isbn=?, quantity=?, description=? WHERE id=?',
      [
        title || book.title,
        author || book.author,
        category !== undefined ? category : book.category,
        isbn !== undefined ? isbn : book.isbn,
        quantity !== undefined ? quantity : book.quantity,
        description !== undefined ? description : book.description,
        req.params.id
      ]
    );

    const updated = await query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const existing = await query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
