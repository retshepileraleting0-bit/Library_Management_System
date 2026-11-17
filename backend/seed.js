const bcrypt = require('bcryptjs');
const { pool, query } = require('./config/db');
require('dotenv').config();

async function seed() {
  console.log('Seeding database...');

  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const libHash = await bcrypt.hash('lib123', 10);

    await query('DELETE FROM transactions');
    await query('DELETE FROM books');
    await query('DELETE FROM users');

    await query('ALTER TABLE transactions AUTO_INCREMENT = 1');
    await query('ALTER TABLE books AUTO_INCREMENT = 1');
    await query('ALTER TABLE users AUTO_INCREMENT = 1');

    await query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['admin', adminHash, 'admin']
    );
    await query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['librarian1', libHash, 'librarian']
    );
    await query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['librarian2', libHash, 'librarian']
    );

    console.log('Users seeded (admin, librarian1, librarian2)');

    const books = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Fiction',
        isbn: '978-0061935466',
        quantity: 5,
        description: 'A story about racial injustice and childhood innocence in the American South.'
      },
      {
        title: '1984',
        author: 'George Orwell',
        category: 'Fiction',
        isbn: '978-0451524935',
        quantity: 8,
        description: 'A dystopian novel about a totalitarian society under constant government surveillance.'
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Fiction',
        isbn: '978-0743273565',
        quantity: 4,
        description: 'A story about wealth, class, and the American dream set in the 1920s.'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        category: 'Non-Fiction',
        isbn: '978-0062316097',
        quantity: 6,
        description: 'An exploration of how Homo sapiens came to dominate the planet.'
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        category: 'Non-Fiction',
        isbn: '978-0399590504',
        quantity: 3,
        description: 'A memoir about a woman who grew up in a survivalist family and educated herself.'
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        category: 'Science',
        isbn: '978-0553380163',
        quantity: 7,
        description: 'An accessible introduction to cosmology, black holes, and the nature of time.'
      },
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        category: 'Science',
        isbn: '978-0198788607',
        quantity: 5,
        description: "Dawkins' explanation of evolution from the gene's-eye view."
      },
      {
        title: 'The Diary of a Young Girl',
        author: 'Anne Frank',
        category: 'History',
        isbn: '978-0553577129',
        quantity: 10,
        description: 'The wartime diary of a Jewish teenager hiding in Amsterdam during the Holocaust.'
      }
    ];

    for (const book of books) {
      await query(
        'INSERT INTO books (title, author, category, isbn, quantity, description) VALUES (?, ?, ?, ?, ?, ?)',
        [book.title, book.author, book.category, book.isbn, book.quantity, book.description]
      );
    }

    console.log('8 books seeded');
    console.log('Admin: admin / admin123');
    console.log('Librarian: librarian1 / lib123');

  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
