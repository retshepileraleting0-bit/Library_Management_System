const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const defaultData = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'librarian1',
      password: bcrypt.hashSync('lib123', 10),
      role: 'librarian',
      created_at: new Date().toISOString()
    }
  ],
  books: [
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      category: 'Fiction',
      isbn: '978-0061935466',
      quantity: 5,
      description: 'A story about racial injustice and childhood innocence in the American South.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      category: 'Fiction',
      isbn: '978-0451524935',
      quantity: 1,
      description: 'A dystopian novel about totalitarianism and government surveillance.',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      category: 'Science',
      isbn: '978-0553380163',
      quantity: 4,
      description: 'An exploration of cosmology, black holes, and the universe.',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      category: 'Non-Fiction',
      isbn: '978-0062316097',
      quantity: 7,
      description: 'The journey of how our species came to dominate the world.',
      created_at: new Date().toISOString()
    }
  ],
  transactions: []
};

const dataDir = path.join(__dirname, '../data');
const dataFilePath = path.join(dataDir, 'local_db.json');

function getLocalData() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch (e) {
    return defaultData;
  }
}

function saveLocalData(data) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let useLocalFallback = false;

pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL database');
    conn.release();
  })
  .catch(() => {
    useLocalFallback = true;
    console.log('Using local file storage (data/local_db.json)');
  });

async function query(sql, params = []) {
  if (!useLocalFallback) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_ACCESS_DENIED_ERROR') {
        useLocalFallback = true;
        return runLocalQuery(sql, params);
      }
      throw err;
    }
  } else {
    return runLocalQuery(sql, params);
  }
}

function runLocalQuery(sql, params) {
  const data = getLocalData();
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  if (cleanSql.includes('FROM books') && cleanSql.startsWith('SELECT')) {
    if (cleanSql.includes('WHERE id = ?')) {
      const id = Number(params[0]);
      return data.books.filter(b => b.id === id);
    }
    return [...data.books].sort((a, b) => a.title.localeCompare(b.title));
  }

  if (cleanSql.startsWith('INSERT INTO books')) {
    const newId = data.books.length > 0 ? Math.max(...data.books.map(b => b.id)) + 1 : 1;
    const newBook = {
      id: newId,
      title: params[0],
      author: params[1],
      category: params[2] || 'Other',
      isbn: params[3] || '',
      quantity: Number(params[4]) || 0,
      description: params[5] || '',
      created_at: new Date().toISOString()
    };
    data.books.push(newBook);
    saveLocalData(data);
    return { insertId: newId };
  }

  if (cleanSql.startsWith('UPDATE books')) {
    if (cleanSql.includes('SET quantity = ? WHERE id = ?')) {
      const qty = Number(params[0]);
      const id = Number(params[1]);
      const book = data.books.find(b => b.id === id);
      if (book) book.quantity = qty;
      saveLocalData(data);
      return { affectedRows: 1 };
    }
    const id = Number(params[6]);
    const bookIndex = data.books.findIndex(b => b.id === id);
    if (bookIndex !== -1) {
      data.books[bookIndex] = {
        ...data.books[bookIndex],
        title: params[0],
        author: params[1],
        category: params[2],
        isbn: params[3],
        quantity: Number(params[4]),
        description: params[5]
      };
      saveLocalData(data);
    }
    return { affectedRows: 1 };
  }

  if (cleanSql.startsWith('DELETE FROM books')) {
    const id = Number(params[0]);
    data.books = data.books.filter(b => b.id !== id);
    saveLocalData(data);
    return { affectedRows: 1 };
  }

  if (cleanSql.includes('FROM users') && cleanSql.startsWith('SELECT')) {
    if (cleanSql.includes('WHERE username = ?')) {
      return data.users.filter(u => u.username === params[0]);
    }
    if (cleanSql.includes('WHERE id = ?')) {
      return data.users.filter(u => u.id === Number(params[0]));
    }
    return data.users.map(u => ({ id: u.id, username: u.username, role: u.role, created_at: u.created_at }));
  }

  if (cleanSql.startsWith('INSERT INTO users')) {
    const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: params[0],
      password: params[1],
      role: params[2] || 'librarian',
      created_at: new Date().toISOString()
    };
    data.users.push(newUser);
    saveLocalData(data);
    return { insertId: newId };
  }

  if (cleanSql.startsWith('UPDATE users')) {
    const id = Number(params[3]);
    const user = data.users.find(u => u.id === id);
    if (user) {
      user.username = params[0];
      if (params[1]) user.password = params[1];
      user.role = params[2];
      saveLocalData(data);
    }
    return { affectedRows: 1 };
  }

  if (cleanSql.startsWith('DELETE FROM users')) {
    const id = Number(params[0]);
    data.users = data.users.filter(u => u.id !== id);
    saveLocalData(data);
    return { affectedRows: 1 };
  }

  if (cleanSql.includes('FROM transactions') && cleanSql.startsWith('SELECT')) {
    return [...data.transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (cleanSql.startsWith('INSERT INTO transactions')) {
    const book = data.books.find(b => b.id === Number(params[0]));
    const user = data.users.find(u => u.id === Number(params[4]));
    const newTx = {
      id: data.transactions.length + 1,
      book_id: Number(params[0]),
      book_title: book ? book.title : 'Unknown Book',
      type: params[1],
      quantity: Number(params[2]),
      notes: params[3] || '',
      created_by: user ? user.username : 'admin',
      created_at: new Date().toISOString()
    };
    data.transactions.push(newTx);
    saveLocalData(data);
    return { insertId: newTx.id };
  }

  return [];
}

module.exports = { pool, query };
