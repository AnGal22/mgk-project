import { verifyAuthFromRequest } from './_lib/auth.js'
import { readInfo, writeInfo } from './_lib/storage.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await readInfo()
      return res.status(200).json(data)
    } catch {
      return res.status(500).json({ error: 'Ne mogu učitati info.json' })
    }
  }

  if (req.method === 'PUT') {
    const session = verifyAuthFromRequest(req)
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const payload = req.body
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ error: 'Payload mora biti JSON object' })
    }

    try {
      await writeInfo(payload)
      return res.status(200).json({ ok: true })
    } catch {
      return res.status(500).json({ error: 'Greška pri spremanju info.json' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
