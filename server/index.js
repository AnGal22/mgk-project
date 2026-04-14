import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import { convertImageBufferToWebp } from '../api/_lib/image-webp.js'
import { getSupabaseAdmin } from '../api/_lib/supabase.js'
import { readInfo, readProducts, writeImageAsset, writeInfo, writeProducts } from '../api/_lib/storage.js'

dotenv.config()

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

function mapRowToProducts(row) {
  return row?.data && typeof row.data === 'object' ? row.data : {}
}

app.get('/api/products', async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { data, error } = await supabase.from('products_json').select('*').eq('id', 1).single()
      if (!error && data) {
        return res.json(mapRowToProducts(data))
      }
    }

    const fallback = await readProducts()
    return res.json(fallback)
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
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { error } = await supabase.from('products_json').upsert({
        id: 1,
        data: payload,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      return res.json({ ok: true, storedInSupabase: true })
    }

    await writeProducts(payload)
    return res.json({ ok: true, storedInSupabase: false })
  } catch {
    return res.status(500).json({ error: 'Greška pri spremanju products.json' })
  }
})

function mapRowToSiteInfo(row) {
  return {
    title_desc: {
      hr: row?.title_desc_hr ?? '',
      en: row?.title_desc_en ?? '',
    },
    description: {
      hr: row?.description_hr ?? '',
      en: row?.description_en ?? '',
    },
    contact: {
      address: row?.contact_address ?? '',
      phone: row?.contact_phone ?? '',
      location: row?.contact_location ?? '',
      email: row?.contact_email ?? '',
      email2: row?.contact_email_2 ?? '',
      email3: row?.contact_email_3 ?? '',
      certificates: row?.contact_certificates ?? '',
    },
  }
}

function mapSiteInfoToRow(data) {
  return {
    id: 1,
    title_desc_hr: data?.title_desc?.hr ?? '',
    title_desc_en: data?.title_desc?.en ?? '',
    description_hr: data?.description?.hr ?? '',
    description_en: data?.description?.en ?? '',
    contact_address: data?.contact?.address ?? '',
    contact_phone: data?.contact?.phone ?? '',
    contact_location: data?.contact?.location ?? '',
    contact_email: data?.contact?.email ?? '',
    contact_email_2: data?.contact?.email2 ?? '',
    contact_email_3: data?.contact?.email3 ?? '',
    contact_certificates: data?.contact?.certificates ?? '',
  }
}

function hasMeaningfulSiteInfo(row) {
  return Boolean(
    row?.title_desc_hr?.trim() ||
      row?.title_desc_en?.trim() ||
      row?.description_hr?.trim() ||
      row?.description_en?.trim() ||
      row?.contact_address?.trim() ||
      row?.contact_phone?.trim() ||
      row?.contact_location?.trim() ||
      row?.contact_email?.trim() ||
      row?.contact_email_2?.trim() ||
      row?.contact_email_3?.trim() ||
      row?.contact_certificates?.trim()
  )
}

app.get('/api/info', async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { data, error } = await supabase.from('site_info').select('*').eq('id', 1).single()
      if (!error && data && hasMeaningfulSiteInfo(data)) {
        return res.json(mapRowToSiteInfo(data))
      }
    }

    const fallback = await readInfo()
    return res.json(fallback)
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
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { error } = await supabase.from('site_info').upsert(mapSiteInfoToRow(payload))
      if (error) {
        throw error
      }
      return res.json({ ok: true, storedInSupabase: true })
    }

    await writeInfo(payload)
    return res.json({ ok: true, storedInSupabase: false })
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
    const webpImage = await convertImageBufferToWebp({ fileName, contentType, buffer })
    const url = await writeImageAsset(webpImage)

    return res.json({ url })
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
