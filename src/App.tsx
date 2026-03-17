import './App.css'
import Navbar from './components/Navbar.tsx'
import Section from './components/section.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import Cans from './components/cans.tsx'
import Contact from './components/Contact.tsx'
import info from './info.json'
import localProducts from './products.json'
import CmsPanel from './components/CmsPanel.tsx'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { ProductsData } from './types/products.ts'
import { fetchProducts, fetchSiteInfo, type SiteInfo } from './lib/api.ts'

type StatItem = { target: number; suffix?: string; label: string }

function App() {
  const isCmsRoute = window.location.pathname.startsWith('/cms')
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
  const [products, setProducts] = useState<ProductsData>(localProducts as ProductsData)
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(info as SiteInfo)
  const [showItemNav, setShowItemNav] = useState(false)
  const visibleSectionsRef = useRef<Set<string>>(new Set())

  const uiText = {
    hr: {
      heroTitle: 'Industrijska ambalaza koja drzi ritam proizvodnje',
      aboutTitle: siteInfo.title_desc.hr,
      aboutDescription: siteInfo.description.hr,
      qualityTitle: 'Kontrola kvalitete',
      qualitySub: 'Stabilne serije, precizne tolerancije',
      deliveryTitle: 'Pouzdana isporuka',
      deliverySub: 'Planirano, na vrijeme, bez zastoja',
      quoteCta: 'Zatrazi ponudu',
      productsCta: 'Pogledaj proizvode',
      statsTitle: 'Brojevi koji govore za nas',
      stats: [
        { target: 30, suffix: '+', label: 'Godina iskustva' },
        { target: 40, suffix: '+', label: 'Tržišta izvoza' },
        { target: 120, suffix: 'M+', label: 'Komada godišnje' },
        { target: 3, label: 'Proizvodna pogona' },
      ] as StatItem[],
    },
    en: {
      heroTitle: 'Industrial packaging that keeps production moving',
      aboutTitle: siteInfo.title_desc.en,
      aboutDescription: siteInfo.description.en,
      qualityTitle: 'Quality control',
      qualitySub: 'Stable production runs, precise tolerances',
      deliveryTitle: 'Reliable delivery',
      deliverySub: 'Planned, on time, without downtime',
      quoteCta: 'Request a quote',
      productsCta: 'View products',
      statsTitle: 'Numbers that build trust',
      stats: [
        { target: 30, suffix: '+', label: 'Years of experience' },
        { target: 40, suffix: '+', label: 'Export markets' },
        { target: 120, suffix: 'M+', label: 'Units yearly' },
        { target: 3, label: 'Production plants' },
      ] as StatItem[],
    },
  }

  const handleSectionInViewChange = useCallback((keyName: string, inView: boolean) => {
    const next = new Set(visibleSectionsRef.current)
    if (inView) next.add(keyName)
    else next.delete(keyName)
    visibleSectionsRef.current = next
  }, [])

  useEffect(() => {
    if (isCmsRoute) return

    fetchProducts().then(setProducts).catch(() => {})
    fetchSiteInfo().then(setSiteInfo).catch(() => {})
  }, [isCmsRoute])

  useEffect(() => {
    if (isCmsRoute) return

    const firstSectionId = Object.keys(products)[0]
    if (!firstSectionId) return

    const showWhenFirstSectionTopIsAt = 0.25

    const updateItemNavVisibility = () => {
      const firstSectionEl = document.getElementById(firstSectionId)
      const contactEl = document.getElementById('contact')
      if (!firstSectionEl) {
        setShowItemNav(false)
        return
      }

      const firstSectionTop = firstSectionEl.getBoundingClientRect().top
      const triggerLine = window.innerHeight * showWhenFirstSectionTopIsAt

      const contactInView = (() => {
        if (!contactEl) return false
        const rect = contactEl.getBoundingClientRect()
        return rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.2
      })()

      setShowItemNav(firstSectionTop <= triggerLine && !contactInView)
    }

    updateItemNavVisibility()
    window.addEventListener('scroll', updateItemNavVisibility, { passive: true })
    window.addEventListener('resize', updateItemNavVisibility)

    return () => {
      window.removeEventListener('scroll', updateItemNavVisibility)
      window.removeEventListener('resize', updateItemNavVisibility)
    }
  }, [products, isCmsRoute])

  if (isCmsRoute) {
    return <CmsPanel />
  }

  return (
    <div className="bg-[url(/bg1.webp)]">
      <Navbar lang={lang} products={products} />
      <div
        className="fixed top-20 left-0 z-50 hidden h-[80vh] lg:block"
        style={{
          transform: showItemNav ? 'translateX(0)' : 'translateX(-100%)',
          opacity: showItemNav ? 1 : 0,
          transition: 'transform 400ms ease, opacity 400ms ease',
          pointerEvents: showItemNav ? 'auto' : 'none',
        }}
      >
        <ItemNavBar lang={lang} products={products} />
      </div>

      <div
        className="fixed right-3 left-3 z-50 md:hidden"
        style={{
          bottom: showItemNav ? '72px' : '-180px',
          opacity: showItemNav ? 1 : 0,
          transition: 'bottom 350ms ease, opacity 300ms ease',
          pointerEvents: showItemNav ? 'auto' : 'none',
        }}
      >
        <ItemNavBar lang={lang} products={products} mobile />
      </div>

      <div className="pt-20 min-h-screen w-full flex flex-col items-center justify-center ">
        <section id="home-hero" className="hero-bg min-h-screen w-screen text-white flex items-center justify-center relative left-1/2 -translate-x-1/2">
          <div className="hero-grid relative z-10 w-full max-w-6xl px-6 pt-16 pb-36 md:py-16">
            <div className="hero-text slide-in-left relative z-10">
              <p className="hero-title">MGK-pack d.d.</p>
              <h1 className="hero-eyebrow">{uiText[lang].heroTitle}</h1>
              <h1 className="hero-desc-title">{uiText[lang].aboutTitle}</h1>
              <p className="hero-desc">{uiText[lang].aboutDescription}</p>
              <div className="hero-metrics">
                <div>
                  <p className="hero-metric-title">{uiText[lang].qualityTitle}</p>
                  <p className="hero-metric-sub">{uiText[lang].qualitySub}</p>
                </div>
                <div>
                  <p className="hero-metric-title">{uiText[lang].deliveryTitle}</p>
                  <p className="hero-metric-sub">{uiText[lang].deliverySub}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 w-full max-w-6xl px-4 pb-10 md:px-6">
          <div className="rounded-2xl border border-white/20 bg-white/90 p-5 shadow-xl backdrop-blur md:p-7">
            <h2 className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">{uiText[lang].statsTitle}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {uiText[lang].stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-2xl font-extrabold text-blue-700 md:text-3xl">
                    {stat.target}
                    {stat.suffix ?? ''}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-600 md:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {Object.entries(products).map(([key], index, entries) => (
          <Fragment key={key}>
            <Section keyName={key} products={products} lang={lang} onInViewChange={handleSectionInViewChange} />
            {index < entries.length - 1 && <Cans />}
          </Fragment>
        ))}
        <Contact lang={lang} info={siteInfo.contact} />
      </div>

      <div className="fixed bottom-6 right-6">
        <button className="bg-white text-black px-4 py-2 rounded-full shadow-md transition-transform duration-200 ease-out hover:scale-110" onClick={() => setLang(lang === 'hr' ? 'en' : 'hr')}>
          {lang === 'hr' ? 'English' : 'Hrvatski'}
        </button>
      </div>
    </div>
  )
}

export default App
