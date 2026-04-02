import { ZoomParallax } from './ui/zoom-parallax'

type LithographySectionProps = {
  lang: 'hr' | 'en'
}

const lithographyImages = [
  { src: '/home-can.webp', alt: 'Lithography can visual 1' },
  { src: '/home-pate-can.webp', alt: 'Lithography can visual 2' },
  { src: '/home-tin-can.webp', alt: 'Lithography can visual 3' },
  { src: '/powder.webp', alt: 'Lithography print sample 4' },
  { src: '/silver_cans.webp', alt: 'Lithography print sample 5' },
]

const LithographySection = ({ lang }: LithographySectionProps) => {
  const copy = {
    hr: {
      eyebrow: 'Litografija',
      title: 'Tisak i dorada ambalaže koji ostavljaju dojam na polici',
      body: 'Od osnovnih grafičkih rješenja do serijske litografije, MGK-pack može podržati vizualni identitet proizvoda kroz precizan tisak, usklađene boje i konzistentnu završnu obradu.',
      note: 'Kasnije ovdje samo zamijeni slike u nizu `lithographyImages` s finalnim vizualima koje želiš koristiti.',
    },
    en: {
      eyebrow: 'Lithography',
      title: 'Printing and finishing that makes packaging stand out on shelf',
      body: 'From initial artwork support to serial lithography, MGK-pack can support the visual identity of the product through precise print execution, color consistency and reliable finishing.',
      note: 'Later, just replace the entries in `lithographyImages` with the final visuals you want to use here.',
    },
  }[lang]

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-8 text-center md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">{copy.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">{copy.title}</h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{copy.body}</p>
      </div>

      <ZoomParallax images={lithographyImages} />

      <div className="mx-auto w-full max-w-5xl px-6 pb-16 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur-sm md:text-base">
          {copy.note}
        </div>
      </div>
    </section>
  )
}

export default LithographySection
