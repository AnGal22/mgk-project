import { verifyAuthFromRequest } from './_lib/auth.js'
import { getSupabaseAdmin } from './_lib/supabase.js'
import { readInfo, writeInfo } from './_lib/storage.js'

function mapRowToSiteInfo(row) {
  return {
    title_desc: {
      hr: row?.title_desc_hr ?? '',
      en: row?.title_desc_en ?? '',
    },
    description: {
      hr: row?.description_hr ?? '',
      en: row?.description_en ?? '',
    },
    contact: {
      address: row?.contact_address ?? '',
      phone: row?.contact_phone ?? '',
      location: row?.contact_location ?? '',
      email: row?.contact_email ?? '',
      certificates: row?.contact_certificates ?? '',
    },
  }
}

function mapSiteInfoToRow(data) {
  return {
    id: 1,
    title_desc_hr: data?.title_desc?.hr ?? '',
    title_desc_en: data?.title_desc?.en ?? '',
    description_hr: data?.description?.hr ?? '',
    description_en: data?.description?.en ?? '',
    contact_address: data?.contact?.address ?? '',
    contact_phone: data?.contact?.phone ?? '',
    contact_location: data?.contact?.location ?? '',
    contact_email: data?.contact?.email ?? '',
    contact_certificates: data?.contact?.certificates ?? '',
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        const { data, error } = await supabase.from('site_info').select('*').eq('id', 1).single()
        if (!error && data) {
          return res.status(200).json(mapRowToSiteInfo(data))
        }
      }

      const fallback = await readInfo()
      return res.status(200).json(fallback)
    } catch {
      return res.status(500).json({ error: 'Ne mogu učitati info podatke' })
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
        const { error } = await supabase.from('site_info').upsert(mapSiteInfoToRow(payload))
        if (error) {
          throw error
        }
        return res.status(200).json({ ok: true, storedInSupabase: true })
      }

      await writeInfo(payload)
      return res.status(200).json({ ok: true, storedInSupabase: false })
    } catch {
      return res.status(500).json({ error: 'Greška pri spremanju info podataka' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
