import { list, put } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

const BLOB_PATH = 'cms/products.json'

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function getLocalPath() {
  return path.join(process.cwd(), 'src', 'products.json')
}

async function readFromBlob() {
  const result = await list({ prefix: BLOB_PATH, limit: 1 })
  const exact = result.blobs.find((b) => b.pathname === BLOB_PATH) || result.blobs[0]
  if (!exact) {
    return null
  }

  const response = await fetch(exact.url)
  if (!response.ok) {
    throw new Error('Ne mogu učitati products.json iz Blob storage')
  }

  return response.json()
}

async function writeToBlob(data) {
  const body = JSON.stringify(data, null, 2)
  await put(BLOB_PATH, body, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
  })
}

export async function readProducts() {
  if (hasBlob()) {
    const fromBlob = await readFromBlob()
    if (fromBlob) return fromBlob
  }

  const raw = await fs.readFile(getLocalPath(), 'utf8')
  return JSON.parse(raw)
}

export async function writeProducts(data) {
  if (hasBlob()) {
    await writeToBlob(data)
    return
  }

  await fs.writeFile(getLocalPath(), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
