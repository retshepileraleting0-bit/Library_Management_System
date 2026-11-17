# Library Management System

Course: BIWA2110 - Web Application Development  
Assignment: Individual Take-Home Test

A full-stack web application for managing library books, stock transactions, and user accounts.

## Technology Stack

- Frontend: React (Vite, React Router, Hooks)
- Styling: CSS
- Backend: Express.js (Node.js)
- Database: MySQL
- Communication: Fetch API
- Authentication: JWT

## Features

- Dashboard: Book cards with low-stock warnings (less than 2 copies)
- Book Management: Add, edit, and delete books
- Transactions: Record stock additions and deductions, with transaction history
- User Management: Add, edit, and delete user accounts
- Authentication: Login form and protected routes

## Setup and Running

### 1. Database Setup

Run setup.sql in MySQL:

```bash
mysql -u root -p < backend/setup.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run seed
npm start
```

The backend server runs on http://localhost:5001

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173

## Default Accounts

- Admin: admin / admin123
- Librarian: librarian1 / lib123

## API Endpoints

- GET /api/health
- POST /api/auth/login
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id
- GET /api/transactions
- POST /api/transactions
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
