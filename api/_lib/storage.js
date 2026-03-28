import { list, put } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getSupabaseAdmin } from './supabase.js'

const PRODUCTS_BLOB_PATH = 'cms/products.json'
const INFO_BLOB_PATH = 'cms/info.json'
const SUPABASE_UPLOADS_BUCKET = process.env.SUPABASE_UPLOADS_BUCKET || 'cms-assets'

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function getLocalPath(fileName) {
  return path.join(process.cwd(), 'src', fileName)
}

function sanitizeFileName(name) {
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

async function readJsonFromBlob(blobPath) {
  const result = await list({ prefix: blobPath, limit: 1 })
  const exact = result.blobs.find((b) => b.pathname === blobPath) || result.blobs[0]
  if (!exact) return null

  const response = await fetch(exact.url)
  if (!response.ok) {
    throw new Error(`Ne mogu učitati ${blobPath} iz Blob storage`)
  }

  return response.json()
}

async function writeJsonToBlob(blobPath, data) {
  const body = JSON.stringify(data, null, 2)
  await put(blobPath, body, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
  })
}

async function writeImageAssetToSupabase({ cleanName, contentType, buffer }) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const ext = path.extname(cleanName)
  const base = path.basename(cleanName, ext)
  const filePath = `uploads/${base}-${Date.now()}${ext}`

  const { error } = await supabase.storage.from(SUPABASE_UPLOADS_BUCKET).upload(filePath, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(SUPABASE_UPLOADS_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

export async function writeImageAsset({ fileName, contentType, buffer }) {
  const cleanName = sanitizeFileName(fileName)
  const supabase = getSupabaseAdmin()

  if (supabase) {
    return writeImageAssetToSupabase({ cleanName, contentType, buffer })
  }

  if (hasBlob()) {
    const blob = await put(`cms/uploads/${cleanName}`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
    })
    return blob.url
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const ext = path.extname(cleanName)
  const base = path.basename(cleanName, ext)
  const uniqueName = `${base}-${Date.now()}${ext}`
  const targetPath = path.join(uploadsDir, uniqueName)

  await fs.writeFile(targetPath, buffer)
  return `/uploads/${uniqueName}`
}

export async function readProducts() {
  if (hasBlob()) {
    const fromBlob = await readJsonFromBlob(PRODUCTS_BLOB_PATH)
    if (fromBlob) return fromBlob
  }

  const raw = await fs.readFile(getLocalPath('products.json'), 'utf8')
  return JSON.parse(raw)
}

export async function writeProducts(data) {
  if (hasBlob()) {
    await writeJsonToBlob(PRODUCTS_BLOB_PATH, data)
    return
  }

  await fs.writeFile(getLocalPath('products.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

export async function readInfo() {
  if (hasBlob()) {
    const fromBlob = await readJsonFromBlob(INFO_BLOB_PATH)
    if (fromBlob) return fromBlob
  }

  const raw = await fs.readFile(getLocalPath('info.json'), 'utf8')
  return JSON.parse(raw)
}

export async function writeInfo(data) {
  if (hasBlob()) {
    await writeJsonToBlob(INFO_BLOB_PATH, data)
    return
  }

  await fs.writeFile(getLocalPath('info.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
