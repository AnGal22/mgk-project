import { put } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function sanitizePart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { company, name, email, phone, message } = req.body ?? {}
  if (!company || !name || !email || !message) {
    return res.status(400).json({ error: 'Company, name, email i message su obavezni' })
  }

  const payload = {
    company: String(company).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  }

  try {
    const stamp = Date.now()
    const fileName = `${stamp}-${sanitizePart(payload.company || payload.name || 'inquiry')}.json`

    if (hasBlob()) {
      await put(`cms/inquiries/${fileName}`, JSON.stringify(payload, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json; charset=utf-8',
      })
    } else {
      const targetDir = path.join(process.cwd(), 'data', 'inquiries')
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(path.join(targetDir, fileName), `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Greška pri slanju upita' })
  }
}
