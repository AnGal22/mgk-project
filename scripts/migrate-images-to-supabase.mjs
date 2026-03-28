import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket = process.env.SUPABASE_UPLOADS_BUCKET || 'cms-assets'

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function sanitizeFileName(name) {
  const cleaned = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
  return cleaned || `file-${Date.now()}`
}

function extractFileName(url, fallback) {
  try {
    const parsed = new URL(url)
    const last = parsed.pathname.split('/').filter(Boolean).pop()
    return sanitizeFileName(last || fallback)
  } catch {
    return sanitizeFileName(fallback)
  }
}

function isAlreadySupabase(url) {
  return typeof url === 'string' && url.includes('/storage/v1/object/public/')
}

async function migrateUrl(url, fallbackName) {
  if (!url || isAlreadySupabase(url)) return url

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const fileName = extractFileName(url, fallbackName)
  const ext = path.extname(fileName)
  const base = path.basename(fileName, ext)
  const storagePath = `uploads/migrated-${Date.now()}-${base}${ext}`

  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  return data.publicUrl
}

const { data: row, error: readError } = await supabase
  .from('products_json')
  .select('*')
  .eq('id', 1)
  .single()

if (readError || !row?.data) {
  console.error('Failed to read products_json row', readError)
  process.exit(1)
}

const products = structuredClone(row.data)
let changed = 0

for (const [key, product] of Object.entries(products)) {
  if (Array.isArray(product.images)) {
    for (let i = 0; i < product.images.length; i += 1) {
      const image = product.images[i]
      if (image?.url && !isAlreadySupabase(image.url)) {
        const nextUrl = await migrateUrl(image.url, `${key}-image-${i}`)
        if (nextUrl !== image.url) {
          product.images[i].url = nextUrl
          changed += 1
          console.log(`Migrated image: ${key} -> images[${i}]`)
        }
      }
    }
  }

  if (product.icon?.url && !isAlreadySupabase(product.icon.url)) {
    const nextUrl = await migrateUrl(product.icon.url, `${key}-icon`)
    if (nextUrl !== product.icon.url) {
      product.icon.url = nextUrl
      changed += 1
      console.log(`Migrated icon: ${key}`)
    }
  }
}

if (!changed) {
  console.log('No image URLs needed migration.')
  process.exit(0)
}

const { error: writeError } = await supabase
  .from('products_json')
  .upsert({ id: 1, data: products, updated_at: new Date().toISOString() })

if (writeError) {
  console.error('Failed to update products_json row', writeError)
  process.exit(1)
}

console.log(`Migration complete. Updated ${changed} image references.`)
