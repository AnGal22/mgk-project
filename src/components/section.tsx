import React, { useEffect, useRef, useState } from 'react'
import SidePanel from './SidePanel'
import categories from "../products.json"

type SectionProps = {
  keyName: keyof typeof categories
  onInViewChange?: (keyName: keyof typeof categories, inView: boolean) => void
}

const section = ({ keyName, onInViewChange }: SectionProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

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
        threshold: 0.2,
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

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onInViewChange(keyName, entry.isIntersecting)
        })
      },
      { threshold: 0.2 }
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <h1
            data-animate
            className="animate-slideInLeftText text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-500 to-blue-700 drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] md:text-6xl"
          >
            {categories[keyName].name.hr}
          </h1>
          <p
            data-animate
            className="animate-slideInLeftText max-w-xl rounded-2xl bg-white/70 p-5 text-base leading-relaxed text-slate-800 md:text-lg"
          >
            {categories[keyName].short_description?.hr ?? categories[keyName].description.hr}
          </p>
          <button
            data-animate
            className="animate-slideInLeftText inline-flex items-center rounded-full bg-red-500/90 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/70"
            onClick={() => setIsPanelOpen(true)}
          >
            Specifikacije
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center md:justify-end">
          <img
            data-animate
            className="animate-slideInRightText w-full max-w-xs drop-shadow-[0_20px_50px_rgba(255,255,255,0.35)] md:max-w-lg"
            src={categories[keyName].images[0].url}
            alt={categories[keyName].images[0].alt.hr}
          />
        </div>
        </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={categories[keyName].name.hr}
        key={keyName}
      >
        <p className="max-w-prose text-sm leading-relaxed text-slate-700">
          {categories[keyName].description.hr}
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
              alt={categories[keyName].schema_image.alt.hr}
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
                      {key.replace(/_/g, ' ')}
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
