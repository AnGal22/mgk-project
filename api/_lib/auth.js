import { createClient } from '@supabase/supabase-js'

const COOKIE_NAME = 'cms_token'

function getSupabaseUrl() {
  return process.env.SUPABASE_URL
}

function getSupabaseAnonKey() {
  return process.env.SUPABASE_ANON_KEY
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

function getSupabaseAuthClient() {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()
  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function signInCmsUser(email, password) {
  const supabase = getSupabaseAuthClient()
  if (!supabase) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY for auth')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session?.access_token) {
    throw error || new Error('Sign in failed')
  }

  return data.session.access_token
}

export async function verifyAuthFromRequest(req) {
  const supabase = getSupabaseAuthClient()
  if (!supabase) return null

  const cookies = parseCookies(req)
  const token = cookies[COOKIE_NAME]
  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export function setAuthCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}${secure ? '; Secure' : ''}`
  )
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}
