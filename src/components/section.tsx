import { useEffect, useRef, useState } from 'react'
import SidePanel from './SidePanel'
import categories from "../products.json"

type SectionProps = {
  keyName: keyof typeof categories
  lang: 'hr' | 'en'
  onInViewChange?: (keyName: keyof typeof categories, inView: boolean) => void
}

const section = ({ keyName, lang, onInViewChange }: SectionProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const sectionText = {
    hr: {
      specs: 'Specifikacije',
      closePanel: 'Zatvori panel',
      specHeaders: {
        internal_diameter: 'Unutarnji promjer',
        height_mm: 'Visina (mm)',
        capacity_ml: 'Kapacitet (ml)',
        dimensions_mm: 'Dimenzije (mm)',
        beaded: 'Perlirano',
        description: 'Opis',
      },
    },
    en: {
      specs: 'Specifications',
      closePanel: 'Close panel',
      specHeaders: {
        internal_diameter: 'Internal diameter',
        height_mm: 'Height (mm)',
        capacity_ml: 'Capacity (ml)',
        dimensions_mm: 'Dimensions (mm)',
        beaded: 'Beaded',
        description: 'Description',
      },
    },
  }

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const targets = rootRef.current.querySelectorAll('[data-animate]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting)
        })
      },
      {
        threshold: 0.5,
        rootMargin: '13% 0px -13% 0px',
      }
    )

    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!rootRef.current || !onInViewChange) {
      return
    }

    const navShowRatio = 0.75
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting && entry.intersectionRatio >= navShowRatio
          onInViewChange(keyName, inView)
        })
      },
      {
        threshold: [0, navShowRatio, 1],
        rootMargin: '0px 0px -5% 0px',
      }
    )

    sectionObserver.observe(rootRef.current)

    return () => {
      sectionObserver.disconnect()
    }
  }, [keyName, onInViewChange])

  const backgroundUrl = categories[keyName].images?.[1]?.url ?? categories[keyName].images?.[0]?.url

  return (
    <section
      id={keyName}
      ref={rootRef}
      data-section
      style={{ ['--section-bg' as never]: `url(${backgroundUrl})` }}
      className="relative min-h-screen w-full bg-[image:var(--section-bg)] bg-cover bg-center text-white"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/10 to-transparent backdrop-blur-xl backdrop-saturate-150"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 62%, transparent 82%)',
          maskImage: 'linear-gradient(to right, black 0%, black 62%, transparent 82%)',
        }}
      />
      <div className="relative mr-auto flex w-full max-w-none flex-col gap-10 py-20 pr-6 pl-[clamp(8.5rem,14.5vw,13.75rem)] transition-[padding] duration-300 md:flex-row md:items-center md:pr-10 md:pl-[clamp(9rem,15vw,14.5rem)]">
        <div className="flex-1 space-y-6">
          <h1
            data-animate
            className="animate-slideInLeftText text-[clamp(2.2rem,4.5vw,5.25rem)] font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-500 to-blue-700 drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)]"
          >
            {categories[keyName].name[lang]}
          </h1>
          
          <button
            data-animate
            className=" animate-slideInLeftText inline-flex items-center rounded-full bg-red-500/90 px-[clamp(1.1rem,1.6vw,1.8rem)] py-[clamp(0.55rem,0.8vw,0.8rem)] text-[clamp(0.95rem,1.15vw,1.25rem)] font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/70"
            onClick={() => setIsPanelOpen(true)}
          >
            {sectionText[lang].specs}
          </button>
        </div>
        
        </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={categories[keyName].name[lang]}
        closeLabel={sectionText[lang].closePanel}
        key={keyName}
      >
        <p className="max-w-prose text-sm leading-relaxed text-slate-700">
          {categories[keyName].description[lang]}
        </p>
        {categories[keyName].schema_image && (
          <div className="mt-4">
            <img
              className={`w-full rounded-lg border border-slate-200 shadow-sm ${
                keyName === 'drawn_rectangular_cans_1_4_club'
                  ? 'max-w-md'
                  : 'max-w-xs'
              }`}
              src={categories[keyName].schema_image.url}
              alt={categories[keyName].schema_image.alt[lang]}
            />
          </div>
        )}
        {categories[keyName].specs && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  {Object.keys(categories[keyName].specs).map((key) => (
                    <th key={key} className="px-3 py-2 font-semibold">
                      {sectionText[lang].specHeaders[key as keyof typeof sectionText.hr.specHeaders] ?? key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.max(
                    ...Object.values(categories[keyName].specs).map((value) =>
                      Array.isArray(value) ? value.length : 1
                    )
                  ),
                }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100">
                    {Object.entries(categories[keyName].specs).map(([key, value]) => (
                      <td key={key} className="px-3 py-2 text-slate-700">
                        {Array.isArray(value) ? value[rowIndex] ?? '' : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SidePanel>
    </section>
  )
}

export default section
