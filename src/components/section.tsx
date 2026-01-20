import React, { useEffect, useRef, useState } from 'react'
import SidePanel from './SidePanel'
import categories from "../products.json"

type SectionProps = {
  keyName: keyof typeof categories
  onInViewChange?: (keyName: keyof typeof categories, inView: boolean) => void
}


const section = ({ keyName, onInViewChange }:SectionProps) => {
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
      { threshold: 0.2,
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

  return (
    <section id={keyName} ref={rootRef} data-section className=' relative  min-h-screen w-320 bg-gray-800 text-white bg-[url(/pate.png)] bg-[position:160%_center] bg-no-repeat '>
        <div className="absolute inset-0
  bg-[linear-gradient(90deg,#ffffff_60%,#ffffff_45%,rgba(255,255,255,0.5)_80%,rgba(255,255,255,0)_85%)]" />
        <h1 data-animate className='animate-slideInLeftText text-6xl font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-linear-to-r from-blue-400 via-sky-500 to-blue-700
            drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] absolute top-30 left-20'>
            {categories[keyName].name.hr}
        </h1>
        <img data-animate className='animate-slideInRightText w-170 absolute top-50 right-150' src={categories[keyName].images[0].url} alt={categories[keyName].images[0].alt.hr} />
        <button
          data-animate
          className='absolute animate-slideInLeftText top-2/5 left-6/12 rounded-full bg-red-500/90 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/70'
          onClick={() => setIsPanelOpen(true)}
        >
          Specifikacije
        </button>
        <div
          data-animate
          className='animate-slideInLeftText absolute top-157 left-20 max-w-[40rem] rounded-2xl bg-white/70 p-6 text-slate-800 shadow-lg backdrop-blur-md'
        >
          <p className="text-lg leading-relaxed">
            {categories[keyName].short_description?.hr ?? categories[keyName].description.hr}
          </p>
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
