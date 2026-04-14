import { useState } from 'react'

type ContactPageProps = {
  lang: 'hr' | 'en'
  info: {
    address: string
    phone: string
    location: string
    email: string
    email2: string
    email3: string
    certificates: string
  }
}

const ContactPage = ({ lang, info }: ContactPageProps) => {
  const text = {
    hr: {
      eyebrow: 'Kontakt i upiti',
      title: 'Pošaljite upit direktno kroz formu',
      desc: 'Ako trebate ponudu, tehničke informacije ili želite razgovor o suradnji, ispunite obrazac i javit ćemo vam se.',
      company: 'Naziv tvrtke',
      name: 'Ime i prezime',
      email: 'E-mail',
      sales: 'Prodaja',
      phone: 'Telefon',
      message: 'Poruka',
      submit: 'Pošalji upit',
      sending: 'Šaljem...',
      success: 'Upit je uspješno poslan.',
      error: 'Dogodila se greška pri slanju upita.',
      contactBlock: 'Kontakt podaci',
      address: 'Adresa',
      location: 'Lokacija',
    },
    en: {
      eyebrow: 'Contact & inquiries',
      title: 'Send your inquiry directly through the form',
      desc: 'If you need an offer, technical information or want to discuss cooperation, fill in the form and we will get back to you.',
      company: 'Company name',
      name: 'Full name',
      email: 'E-mail',
      sales: 'Sales',
      phone: 'Phone',
      message: 'Message',
      submit: 'Send inquiry',
      sending: 'Sending...',
      success: 'Inquiry sent successfully.',
      error: 'An error occurred while sending the inquiry.',
      contactBlock: 'Contact details',
      address: 'Address',
      location: 'Location',
    },
  }[lang]

  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await fetch('/api/contact-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setForm({ company: '', name: '', email: '', phone: '', message: '' })
      setStatus(text.success)
    } catch {
      setStatus(text.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4faff_0%,#e7f3fb_38%,#d7eaf7_100%)] px-4 pt-28 pb-14 text-slate-800 md:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-3xl border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(232,243,251,0.9))] p-8 shadow-[0_24px_70px_rgba(70,118,163,0.10)] backdrop-blur">
          <p className="mt-3 text-4xl font-black tracking-tight text-[#173f63] md:text-5xl">{text.eyebrow}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4d6f8e]">{text.desc}</p>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-[#cfe0ee] bg-white/70 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d8aa3]">{text.contactBlock}</p>
              <div className="mt-4 grid gap-4 text-sm text-[#355a79] md:grid-cols-2">
                <div><span className="block text-[#7a95ad]">{text.address}</span><span>{info.address}</span></div>
                <div><span className="block text-[#7a95ad]">{text.phone}</span><span>{info.phone}</span></div>
                <div><span className="block text-[#7a95ad]">{text.location}</span><span>{info.location}</span></div>
                <div className="md:col-span-2"><span className="block text-[#7a95ad]">{text.email}</span><span className="break-words">{info.email}</span></div>
                {(info.email2 || info.email3) && (
                  <div className="md:col-span-2">
                    <span className="block text-[#7a95ad]">{text.sales}</span>
                    <div className="mt-1 flex flex-col gap-1">
                      {info.email2 && <span>{info.email2}</span>}
                      {info.email3 && <span>{info.email3}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#c7dff0] bg-white/92 p-6 shadow-[0_24px_70px_rgba(70,118,163,0.12)] backdrop-blur md:p-8">
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block text-sm font-medium text-[#476b89]">
              <span className="mb-1 block">{text.company}</span>
              <input className="w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#66aee8] focus:ring-4 focus:ring-[#3ca2fa]/12" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </label>
            <label className="block text-sm font-medium text-[#476b89]">
              <span className="mb-1 block">{text.name}</span>
              <input className="w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#66aee8] focus:ring-4 focus:ring-[#3ca2fa]/12" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-[#476b89]">
                <span className="mb-1 block">{text.email}</span>
                <input type="email" className="w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#66aee8] focus:ring-4 focus:ring-[#3ca2fa]/12" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label className="block text-sm font-medium text-[#476b89]">
                <span className="mb-1 block">{text.phone}</span>
                <input className="w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#66aee8] focus:ring-4 focus:ring-[#3ca2fa]/12" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
            </div>
            <label className="block text-sm font-medium text-[#476b89]">
              <span className="mb-1 block">{text.message}</span>
              <textarea className="min-h-40 w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#66aee8] focus:ring-4 focus:ring-[#3ca2fa]/12" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </label>
            <button className="w-full rounded-xl bg-[#3ca2fa] px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#2f92e7] disabled:opacity-60" disabled={isSubmitting}>
              {isSubmitting ? text.sending : text.submit}
            </button>
            {status && <p className="text-sm text-[#547590]">{status}</p>}
          </form>
        </section>
      </div>
    </main>
  )
}

export default ContactPage
