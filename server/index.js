import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'node:url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const productsFilePath = path.join(rootDir, 'src', 'products.json')

const app = express()
const port = Number(process.env.CMS_PORT || 3001)
const cmsUsername = process.env.CMS_USERNAME || 'employee'
const cmsPassword = process.env.CMS_PASSWORD || 'mgk123'
const jwtSecret = process.env.CMS_JWT_SECRET || 'change-this-secret'

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '3mb' }))
app.use(cookieParser())

const requireAuth = (req, res, next) => {
  const token = req.cookies.cms_token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    jwt.verify(token, jwtSecret)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid session' })
  }
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}

  if (username !== cmsUsername || password !== cmsPassword) {
    return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka' })
  }

  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '8h' })

  res.cookie('cms_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 8 * 60 * 60 * 1000,
  })

  return res.json({ ok: true })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('cms_token')
  return res.json({ ok: true })
})

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies.cms_token
  if (!token) return res.json({ authenticated: false })

  try {
    jwt.verify(token, jwtSecret)
    return res.json({ authenticated: true })
  } catch {
    return res.json({ authenticated: false })
  }
})

app.get('/api/products', async (_req, res) => {
  try {
    const raw = await fs.readFile(productsFilePath, 'utf8')
    const parsed = JSON.parse(raw)
    return res.json(parsed)
  } catch {
    return res.status(500).json({ error: 'Ne mogu učitati products.json' })
  }
})

app.put('/api/products', requireAuth, async (req, res) => {
  const payload = req.body

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Payload mora biti JSON object' })
  }

  try {
    const serialized = `${JSON.stringify(payload, null, 2)}\n`
    await fs.writeFile(productsFilePath, serialized, 'utf8')
    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Greška pri spremanju products.json' })
  }
})

app.listen(port, () => {
  console.log(`CMS API running on http://localhost:${port}`)
})
