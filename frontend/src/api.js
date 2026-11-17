const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

function getToken() {
  return localStorage.getItem('token')
}

function makeHeaders(isJson = true) {
  const headers = {}
  if (isJson) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(res)
}

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`, {
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}

export async function getBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}

export async function createBook(data) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateBook(id, data) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'DELETE',
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}

export async function getTransactions() {
  const res = await fetch(`${BASE_URL}/transactions`, {
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}

export async function createTransaction(data) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: makeHeaders(false),
  })
  return handleResponse(res)
}
