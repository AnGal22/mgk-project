import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { convertImageBufferToWebp } from '../api/_lib/image-webp.js'
import { getSupabaseAdmin } from '../api/_lib/supabase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const BUCKET = process.env.SUPABASE_UPLOADS_BUCKET || 'cms-assets'
const DRY_RUN = process.argv.includes('--dry-run')

function isSupabaseStorageUrl(value) {
  return typeof value === 'string' && value.includes('/storage/v1/object/public/')
}

function replaceExtensionWithWebp(value) {
  return value.replace(/\.(png|jpe?g)(\?.*)?$/i, '.webp$2')
}

function extractStoragePath(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}

function collectProductImageRefs(products) {
  const refs = []

  for (const [productKey, product] of Object.entries(products || {})) {
    for (const [index, image] of (product.images || []).entries()) {
      if (isSupabaseStorageUrl(image?.url)) {
        refs.push({ kind: 'image', productKey, index, url: image.url })
      }
    }

    if (isSupabaseStorageUrl(product?.schema_image?.url)) {
      refs.push({ kind: 'schema', productKey, url: product.schema_image.url })
    }

    if (isSupabaseStorageUrl(product?.icon?.url)) {
      refs.push({ kind: 'icon', productKey, url: product.icon.url })
    }
  }

  return refs
}

function applyUpdatedUrl(products, ref, nextUrl) {
  if (ref.kind === 'image') {
    products[ref.productKey].images[ref.index].url = nextUrl
  }
  if (ref.kind === 'schema') {
    products[ref.productKey].schema_image.url = nextUrl
  }
  if (ref.kind === 'icon') {
    products[ref.productKey].icon.url = nextUrl
  }
}

async function migrateAsset(supabase, url) {
  const storagePath = extractStoragePath(url)
  if (!storagePath) {
    throw new Error(`Unsupported storage url: ${url}`)
  }

  if (/\.webp(\?.*)?$/i.test(url)) {
    return { nextUrl: url, changed: false }
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download asset: ${url}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = response.headers.get('content-type') || 'image/png'
  const inputName = path.basename(storagePath)
  const converted = await convertImageBufferToWebp({ fileName: inputName, contentType, buffer })
  const nextStoragePath = storagePath.replace(/\.(png|jpe?g)$/i, '.webp')

  if (!DRY_RUN) {
    const { error } = await supabase.storage.from(BUCKET).upload(nextStoragePath, converted.buffer, {
      contentType: converted.contentType,
      upsert: true,
    })

    if (error) throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nextStoragePath)
  return { nextUrl: data.publicUrl, changed: true }
}

async function main() {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    throw new Error('Missing Supabase admin credentials')
  }

  const { data: row, error } = await supabase.from('products_json').select('*').eq('id', 1).single()
  if (error) throw error

  const products = row?.data && typeof row.data === 'object' ? structuredClone(row.data) : {}
  const refs = collectProductImageRefs(products)

  console.log(`Found ${refs.length} Supabase image references in products_json`) 

  let changedCount = 0
  for (const ref of refs) {
    const result = await migrateAsset(supabase, ref.url)
    if (result.changed) {
      applyUpdatedUrl(products, ref, result.nextUrl)
      changedCount += 1
      console.log(`Converted: ${ref.url} -> ${result.nextUrl}`)
    }
  }

  if (!DRY_RUN && changedCount > 0) {
    const { error: updateError } = await supabase.from('products_json').upsert({
      id: 1,
      data: products,
      updated_at: new Date().toISOString(),
    })

    if (updateError) throw updateError
  }

  console.log(DRY_RUN ? `Dry run complete. ${changedCount} assets would be updated.` : `Done. Updated ${changedCount} assets.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
