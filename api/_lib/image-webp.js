import path from 'node:path'
import sharp from 'sharp'

export async function convertImageBufferToWebp({ fileName, contentType, buffer }) {
  const parsed = path.parse(fileName || `image-${Date.now()}`)
  const safeBase = (parsed.name || `image-${Date.now()}`).replace(/[^a-z0-9._-]/gi, '-').replace(/-+/g, '-')
  const outputFileName = `${safeBase}.webp`

  const image = sharp(buffer, { animated: contentType === 'image/gif' })
  const metadata = await image.metadata()
  const hasAlpha = Boolean(metadata.hasAlpha)

  const outputBuffer = await image.webp({
    quality: 85,
    alphaQuality: hasAlpha ? 100 : undefined,
    effort: 4,
  }).toBuffer()

  return {
    fileName: outputFileName,
    contentType: 'image/webp',
    buffer: outputBuffer,
  }
}
