import { verifyAuthFromRequest } from './_lib/auth.js'
import { getSupabaseAdmin } from './_lib/supabase.js'
import { readProducts, writeProducts } from './_lib/storage.js'

function mapRowToProducts(row) {
  return row?.data && typeof row.data === 'object' ? row.data : {}
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase.from('products_json').select('*').eq('id', 1).single()
        if (!error && data) {
          return res.status(200).json(mapRowToProducts(data))
        }
      }

      const fallback = await readProducts()
      return res.status(200).json(fallback)
    } catch {
      return res.status(500).json({ error: 'Ne mogu učitati products.json' })
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

        return res.status(200).json({ ok: true, storedInSupabase: true })
      }

      await writeProducts(payload)
      return res.status(200).json({ ok: true, storedInSupabase: false })
    } catch {
      return res.status(500).json({ error: 'Greška pri spremanju products.json' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
