import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'cms_token'

export function getJwtSecret() {
  return process.env.CMS_JWT_SECRET || 'change-this-secret'
}

export function parseCookies(req) {
  const raw = req.headers.cookie || ''
  return Object.fromEntries(
    raw
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const idx = part.indexOf('=')
        const key = idx >= 0 ? part.slice(0, idx) : part
        const value = idx >= 0 ? decodeURIComponent(part.slice(idx + 1)) : ''
        return [key, value]
      })
  )
}

export function signAuthToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '8h' })
}

export function verifyAuthFromRequest(req) {
  const cookies = parseCookies(req)
  const token = cookies[COOKIE_NAME]
  if (!token) return null

  try {
    return jwt.verify(token, getJwtSecret())
  } catch {
    return null
  }
}

export function setAuthCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}`
  )
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}
