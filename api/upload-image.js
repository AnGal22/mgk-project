import { verifyAuthFromRequest } from './_lib/auth.js'
import { convertImageBufferToWebp } from './_lib/image-webp.js'
import { writeImageAsset } from './_lib/storage.js'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await verifyAuthFromRequest(req)
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

    if (!ALLOWED_TYPES.has(contentType)) {
      return res.status(400).json({ error: 'Dozvoljene su samo slike (jpg, png, webp, gif)' })
    }

    const decodedSize = Buffer.byteLength(base64, 'base64')
    if (decodedSize > MAX_UPLOAD_BYTES) {
      return res.status(413).json({ error: 'Datoteka je prevelika (max 5MB)' })
    }

    const buffer = Buffer.from(base64, 'base64')
    const webpImage = await convertImageBufferToWebp({ fileName, contentType, buffer })
    const url = await writeImageAsset(webpImage)
    return res.status(200).json({ url })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Greška pri uploadu slike' })
  }
}
