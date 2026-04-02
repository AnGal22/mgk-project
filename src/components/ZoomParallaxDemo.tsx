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
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Modern architecture building',
    },
    {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Urban cityscape at sunset',
    },
    {
      src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Abstract geometric pattern',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Mountain landscape',
    },
    {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Minimalist design elements',
    },
    {
      src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Ocean waves and beach',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Forest trees and sunlight',
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-[#e8f5ff] via-[#d9ebf8]/80 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:pt-14 md:pb-24">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-white/45 bg-white/60 p-6 shadow-[0_24px_60px_rgba(37,82,123,0.12)] backdrop-blur md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f6f96]">{copy.eyebrow}</p>
            <h3 className="mt-4 text-3xl font-bold leading-tight text-[#13466b] md:text-4xl">{copy.title}</h3>
            <div className="mt-6 inline-flex rounded-full border border-[#7fb1d3]/40 bg-[#e8f5ff] px-4 py-2 text-sm font-medium text-[#23537b] shadow-sm">
              {copy.featureLabel}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-white/45 bg-white/72 p-6 shadow-[0_24px_60px_rgba(37,82,123,0.14)] backdrop-blur md:p-8">
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
