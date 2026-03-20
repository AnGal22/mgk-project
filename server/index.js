import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import { fileURLToPath } from 'node:url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const productsFilePath = path.join(rootDir, 'src', 'products.json')
const infoFilePath = path.join(rootDir, 'src', 'info.json')
const uploadsDir = path.join(rootDir, 'public', 'uploads')

const app = express()
const port = Number(process.env.CMS_PORT || 3001)
const cmsUsername = process.env.CMS_USERNAME || 'employee'
const cmsPassword = process.env.CMS_PASSWORD || 'mgk123'
const jwtSecret = process.env.CMS_JWT_SECRET || 'change-this-secret'
const resendApiKey = process.env.RESEND_API_KEY
const inquiryToEmail = process.env.INQUIRY_TO_EMAIL
const inquiryFromEmail = process.env.INQUIRY_FROM_EMAIL
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const maxUploadBytes = 5 * 1024 * 1024

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  })
)
app.use(express.json({ limit: '8mb' }))
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

const sanitizeFileName = (name) => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')

  if (!cleaned || /^[.-]+$/.test(cleaned)) {
    return `file-${Date.now()}`
  }

  return cleaned
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
    return res.json(JSON.parse(raw))
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
    await fs.writeFile(productsFilePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Greška pri spremanju products.json' })
  }
})

app.get('/api/info', async (_req, res) => {
  try {
    const raw = await fs.readFile(infoFilePath, 'utf8')
    return res.json(JSON.parse(raw))
  } catch {
    return res.status(500).json({ error: 'Ne mogu učitati info.json' })
  }
})

app.put('/api/info', requireAuth, async (req, res) => {
  const payload = req.body
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Payload mora biti JSON object' })
  }

  try {
    await fs.writeFile(infoFilePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Greška pri spremanju info.json' })
  }
})

app.post('/api/upload-image', requireAuth, async (req, res) => {
  const { fileName, dataUrl } = req.body ?? {}
  if (!fileName || !dataUrl || typeof fileName !== 'string' || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'fileName i dataUrl su obavezni' })
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return res.status(400).json({ error: 'Neispravan dataUrl format' })
  }

  try {
    const [, contentType, base64] = match
    if (!allowedImageTypes.has(contentType)) {
      return res.status(400).json({ error: 'Dozvoljene su samo slike (jpg, png, webp, gif)' })
    }

    const decodedSize = Buffer.byteLength(base64, 'base64')
    if (decodedSize > maxUploadBytes) {
      return res.status(413).json({ error: 'Datoteka je prevelika (max 5MB)' })
    }

    const buffer = Buffer.from(base64, 'base64')
    const cleanName = sanitizeFileName(fileName)
    const ext = path.extname(cleanName)
    const base = path.basename(cleanName, ext)
    const uniqueName = `${base}-${Date.now()}${ext}`

    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.writeFile(path.join(uploadsDir, uniqueName), buffer)

    return res.json({ url: `/uploads/${uniqueName}` })
  } catch {
    return res.status(500).json({ error: 'Greška pri uploadu slike' })
  }
})

app.post('/api/contact-inquiry', async (req, res) => {
  const { company, name, email, phone, message } = req.body ?? {}
  if (!company || !name || !email || !message) {
    return res.status(400).json({ error: 'Company, name, email i message su obavezni' })
  }

  if (!resendApiKey || !inquiryToEmail || !inquiryFromEmail) {
    return res.status(500).json({ error: 'Resend env varijable nisu postavljene' })
  }

  try {
    const resend = new Resend(resendApiKey)
    await resend.emails.send({
      from: inquiryFromEmail,
      to: inquiryToEmail,
      replyTo: String(email).trim(),
      subject: `Novi upit s weba – ${String(company).trim()}`,
      text: [
        `Tvrtka: ${String(company).trim()}`,
        `Ime: ${String(name).trim()}`,
        `Email: ${String(email).trim()}`,
        `Telefon: ${String(phone || '').trim() || '-'}`,
        '',
        'Poruka:',
        String(message).trim(),
      ].join('\n'),
    })

    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Greška pri slanju upita' })
  }
})

app.listen(port, () => {
  console.log(`CMS API running on http://localhost:${port}`)
})
