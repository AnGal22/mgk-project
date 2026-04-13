type QualityControlPageProps = {
  lang: 'hr' | 'en'
}

const QualityControlPage = ({ lang }: QualityControlPageProps) => {
  const text = {
    hr: {
      eyebrow: 'Kontrola kvalitete',
      title: 'Quality Control',
      desc: 'Ova stranica je zasad namjerno prazna i služi kao početni placeholder za budući sadržaj o kontroli kvalitete.',
    },
    en: {
      eyebrow: 'Quality Control',
      title: 'Quality Control',
      desc: 'This page is intentionally empty for now and acts as a starting placeholder for future quality control content.',
    },
  }[lang]

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4faff_0%,#e7f3fb_38%,#d7eaf7_100%)] px-4 pt-32 pb-16 text-slate-800 md:px-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(232,243,251,0.9))] p-8 shadow-[0_24px_70px_rgba(70,118,163,0.10)] backdrop-blur md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f83ab]">{text.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#173f63] md:text-5xl">{text.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4d6f8e]">{text.desc}</p>
      </div>
    </main>
  )
}

export default QualityControlPage
