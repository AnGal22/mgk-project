import { Resend } from 'resend'
import { getSupabaseAdmin } from './_lib/supabase.js'

const resendApiKey = process.env.RESEND_API_KEY
const inquiryToEmail = process.env.INQUIRY_TO_EMAIL
const inquiryFromEmail = process.env.INQUIRY_FROM_EMAIL

function getResend() {
  if (!resendApiKey) return null
  return new Resend(resendApiKey)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { company, name, email, phone, message } = req.body ?? {}
  if (!company || !name || !email || !message) {
    return res.status(400).json({ error: 'Company, name, email i message su obavezni' })
  }

  if (!inquiryToEmail || !inquiryFromEmail) {
    return res.status(500).json({ error: 'Inquiry mail env varijable nisu postavljene' })
  }

  const payload = {
    company: String(company).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    message: String(message).trim(),
    created_at: new Date().toISOString(),
  }

  try {
    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { error } = await supabase.from('contact_inquiries').insert(payload)
      if (error) {
        throw error
      }
    }

    const resend = getResend()
    if (!resend) {
      return res.status(500).json({ error: 'RESEND_API_KEY nije postavljen' })
    }

    await resend.emails.send({
      from: inquiryFromEmail,
      to: inquiryToEmail,
      replyTo: payload.email,
      subject: `Novi upit s weba – ${payload.company}`,
      text: [
        `Vrijeme: ${payload.created_at}`,
        `Tvrtka: ${payload.company}`,
        `Ime: ${payload.name}`,
        `Email: ${payload.email}`,
        `Telefon: ${payload.phone || '-'}`,
        '',
        'Poruka:',
        payload.message,
      ].join('\n'),
      html: `
        <h2>Novi upit s web stranice</h2>
        <p><strong>Vrijeme:</strong> ${payload.created_at}</p>
        <p><strong>Tvrtka:</strong> ${payload.company}</p>
        <p><strong>Ime:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Telefon:</strong> ${payload.phone || '-'}</p>
        <p><strong>Poruka:</strong></p>
        <p>${payload.message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return res.status(200).json({ ok: true, storedInSupabase: Boolean(supabase) })
  } catch {
    return res.status(500).json({ error: 'Greška pri slanju upita' })
  }
}
