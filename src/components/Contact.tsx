import Cans from "./cans"

type ContactProps = {
  lang: 'hr' | 'en'
}

const Contact = ({ lang }: ContactProps) => {
  const text = {
    hr: {
      title: 'Kontakt',
      subtitle: 'Informacije i podrška',
      address: 'Adresa',
      phone: 'Mobitel',
      location: 'Lokacija',
      email: 'E-mail',
      certificates: 'Certifikati',
      certificateHint: 'ISO 9001, HACCP, IFS (placeholder)',
    },
    en: {
      title: 'Contact',
      subtitle: 'Information and support',
      address: 'Address',
      phone: 'Mobile',
      location: 'Location',
      email: 'E-mail',
      certificates: 'Certificates',
      certificateHint: 'ISO 9001, HACCP, IFS (placeholder)',
    },
  }

  return (
    <section id="contact" className="w-full bg-white text-black">
      <Cans/>
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <header className="border-b border-black pb-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{text[lang].title}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-black/70">{text[lang].subtitle}</p>
        </header>

        <div className="grid grid-cols-1 border-b border-black md:grid-cols-2">
          <div className="border-b border-black py-6 md:border-r md:border-b-0 md:pr-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">{text[lang].address}</p>
            <p className="mt-2 text-lg font-medium">Ulica Primjer 12, 10000 Zagreb, Hrvatska</p>
          </div>
          <div className="py-6 md:pl-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">{text[lang].phone}</p>
            <p className="mt-2 text-lg font-medium">+385 99 123 4567</p>
          </div>
        </div>

        <div className="grid grid-cols-1 border-b border-black md:grid-cols-2">
          <div className="border-b border-black py-6 md:border-r md:border-b-0 md:pr-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">{text[lang].location}</p>
            <p className="mt-2 text-lg font-medium">Zagreb, Croatia</p>
          </div>
          <div className="py-6 md:pl-8">
            <p className="text-xs uppercase tracking-[0.2em] text-black/60">{text[lang].email}</p>
            <p className="mt-2 text-lg font-medium">info@mgk-pack.hr</p>
          </div>
        </div>

        <div className="py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/60">{text[lang].certificates}</p>
          <p className="mt-2 text-lg font-medium">{text[lang].certificateHint}</p>
        </div>
      </div>
    </section>
  )
}

export default Contact
