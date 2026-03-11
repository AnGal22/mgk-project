import { verifyAuthFromRequest } from './_lib/auth.js'
import { writeImageAsset } from './_lib/storage.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = verifyAuthFromRequest(req)
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

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
    const buffer = Buffer.from(base64, 'base64')
    const url = await writeImageAsset({ fileName, contentType, buffer })
    return res.status(200).json({ url })
  } catch {
    return res.status(500).json({ error: 'Greška pri uploadu slike' })
  }
}
