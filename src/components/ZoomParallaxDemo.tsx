'use client'

import { ZoomParallax } from '@/components/ui/zoom-parallax'
import { cn } from '@/lib/utils'

type ZoomParallaxDemoProps = {
  lang: 'hr' | 'en'
}

export default function ZoomParallaxDemo({ lang }: ZoomParallaxDemoProps) {
  const copy = {
    hr: {
      eyebrow: 'Limotisak',
      title: 'Tisak i zaštita metalne ambalaže',
      body: 'Ova sekcija spaja kontrolirani vizualni ulaz s konkretnim pregledom naših mogućnosti u limotisku, lakiranju i grafičkoj pripremi.',
      featureLabel: 'Više od 50 godina iskustva',
      paragraphs: [
        'Više od pola stoljeća iskustva u tisku lima povezano s modernom opremom za tisak i lakiranje čine nas vodećom litografskom tvornicom u regiji. Naša najveća snaga visoka je kvaliteta tiska i zaštite limenki, zatvarača i ostale metalne ambalaže lakom te fleksibilnost pri ispunjavanju zahtjeva naših kupaca. Našim proizvodnim linijama u mogućnosti smo pružiti usluge tiska i lakiranja na pokositrenom, kromiranom i aluminijskom limu debljina od 0,155 mm ili više.',
        'Visoku kvalitetu otiska jamči vlastiti laboratorij u kojemu se prati svaki pojedini nalog od definicije proizvoda, preko odabira optimalne tehnologije tiska i lakiranja, do proizvodnje i kompletne kontrole proizvoda. Za svaki pojedinačni tip proizvoda određuje se tehnologija unutarnjeg lakiranja sukladno sa sadržajem punjenja te pojedinačnim zahtjevima različitih tržišta za zaštitom konzerviranog sadržaja.',
        'Naša grafička priprema na raspolaganju je također prilikom razrade i usvajanja najsloženijih grafičkih rješenja. Osim za potrebe vlastite proizvodnje Pluto nudi cjelovitu uslugu limotiska ostalim proizvođačima metalne ambalaže, a posebno proizvođačima krunskih, navojnih i twist-off zatvarača.',
      ],
    },
    en: {
      eyebrow: 'Sheet metal printing',
      title: 'Printing and protection for metal packaging',
      body: 'This section now pairs the controlled visual entry with a concrete overview of our lithography, lacquering and graphic preparation capabilities.',
      featureLabel: 'More than 50 years of experience',
      paragraphs: [
        'More than half a century of experience in sheet metal printing with modern printing and lacquering equipment make us the leading lithographic factory in the region. Our strength lies in the high quality of print and lacquer protection of cans, caps and other metal packaging, and the flexibility at meeting our customers\' requests. Through our production lines we are able to offer the services of printing and lacquering on the tin-, chrome- and aluminium-coated sheet metal of the thickness of 0,155 mm or more.',
        'The high print quality is guaranteed by our own laboratory which follows every single demand - from the definition of product, over the selection of the optimal printing and lacquering technologies, to the production and complete product control. A particular technology of inside lacquering is determined for every individual type of product depending on the filling content and the specific demands for the protection of preserved content of various markets.',
        'Our graphic preparation is also at your disposal when developing and adopting the most complex graphic ideas. In addition to our own needs of production, Pluto offers the full service of sheet metal printing to other metal packaging manufacturers, and especially to those producing crown corks, screw and twist-off caps.',
      ],
    },
  }[lang]

  const images = [
    {
      src: '/cap_povrce.png',
      alt: 'Printed vegetable cap design',
    },
    {
      src: '/caps_unbranded.png',
      alt: 'Unbranded caps layout',
    },
    {
      src: '/caps_unbranded2.png',
      alt: 'Alternative unbranded caps layout',
    },
    {
      src: '/cap_unbranded.png',
      alt: 'Single unbranded cap design',
    },
  ]

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,#edf6fd_0%,#d9ebf8_35%,#b7d5ea_100%)] text-slate-900">
      <div className="relative flex h-[46vh] items-center justify-center px-6 text-center md:h-[52vh]">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,rgba(80,144,190,0.16),transparent_52%)]',
            'blur-[30px]'
          )}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3f6f96]">{copy.eyebrow}</p>
          <h2 className="mt-3 text-center text-4xl font-bold text-[#13466b] md:text-5xl">{copy.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#356287] md:text-lg">{copy.body}</p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-[#b7d5ea] via-[#b7d5ea]/50 to-transparent" />
        <ZoomParallax images={images} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-[#bdd9ed]/35 via-[#c9e1f1]/18 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:pt-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[calc(52vh+100svh)] bg-[linear-gradient(180deg,rgba(183,213,234,0)_0%,rgba(183,213,234,0.28)_18%,rgba(183,213,234,0.52)_100%)]" />
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-[#9ec4df]/45 bg-[linear-gradient(180deg,rgba(226,240,249,0.74),rgba(209,229,243,0.62))] p-6 shadow-[0_24px_60px_rgba(37,82,123,0.10)] backdrop-blur md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f6f96]">{copy.eyebrow}</p>
            <h3 className="mt-4 text-3xl font-bold leading-tight text-[#13466b] md:text-4xl">{copy.title}</h3>
            <div className="mt-6 inline-flex rounded-full border border-[#7fb1d3]/35 bg-[rgba(232,245,255,0.72)] px-4 py-2 text-sm font-medium text-[#23537b] shadow-sm">
              {copy.featureLabel}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-[#9ec4df]/45 bg-[linear-gradient(180deg,rgba(220,236,247,0.72),rgba(203,226,241,0.62))] p-6 shadow-[0_24px_60px_rgba(37,82,123,0.12)] backdrop-blur md:p-8">
            <div className="space-y-6 text-[15px] leading-7 text-[#356287] md:text-base md:leading-8">
              {copy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
