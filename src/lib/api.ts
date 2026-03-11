import type { ProductsData } from '../types/products'

export type CmsCredentials = {
  username: string
  password: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.error || 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function fetchProducts(): Promise<ProductsData> {
  const response = await fetch('/api/products')
  return handleResponse<ProductsData>(response)
}

export async function loginCms(credentials: CmsCredentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })

  return handleResponse<{ ok: true }>(response)
}

export async function getCmsSession() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
  })

  return handleResponse<{ authenticated: boolean }>(response)
}

export async function saveProducts(data: ProductsData) {
  const response = await fetch('/api/products', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  return handleResponse<{ ok: true }>(response)
}

export async function logoutCms() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  return handleResponse<{ ok: true }>(response)
}
