type HeroLandingProps = {
  lang: 'hr' | 'en'
  text: {
    heroTitle: string
    aboutTitle: string
    aboutDescription: string
    quoteCta: string
    productsCta: string
  }
}

const HeroLanding = ({ text }: HeroLandingProps) => {
  return (
    <section id="home-hero" className="hero-bg relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 pt-24 pb-14 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative z-10 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">MGK-pack d.d.</p>
          <h1 className="max-w-3xl text-4xl leading-tight font-black text-white md:text-6xl">{text.heroTitle}</h1>
          <p className="max-w-xl text-2xl leading-tight font-semibold text-sky-100">{text.aboutTitle}</p>
          <p className="max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">{text.aboutDescription}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-bold tracking-wide text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100">
              {text.quoteCta}
            </button>
            <button className="rounded-full border border-slate-400/60 bg-slate-900/35 px-6 py-3 text-sm font-semibold tracking-wide text-white backdrop-blur transition hover:bg-slate-800/55">
              {text.productsCta}
            </button>
          </div>
        </div>

        <div className="relative z-10 hidden h-[72vh] min-h-[560px] items-end justify-center lg:flex">
          <img src="home-tin-can.webp" className="absolute right-[20%] bottom-[58%] w-[34%] -rotate-[18deg] drop-shadow-2xl" alt="can" loading="eager" />
          <img src="home-pate-can.webp" className="absolute right-[4%] bottom-[26%] w-[56%] rotate-[14deg] drop-shadow-2xl" alt="can" loading="eager" />
          <img src="home-can.webp" className="absolute right-[-4%] bottom-[-4%] w-[72%] scale-x-[-1] drop-shadow-2xl" alt="can" loading="eager" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.24),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.18),transparent_42%)]" />
    </section>
  )
}

export default HeroLanding
