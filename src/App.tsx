import './App.css'
import Navbar from './components/Navbar.tsx'
import Section from './components/section.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import Cans from './components/cans.tsx'
import Contact from './components/Contact.tsx'
import info from './info.json'
import localProducts from './products.json'
import CmsPanel from './components/CmsPanel.tsx'
import HeroLanding from './components/home/HeroLanding.tsx'
import ProofStats from './components/home/ProofStats.tsx'
import ProcessRail from './components/home/ProcessRail.tsx'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { ProductsData } from './types/products.ts'
import { fetchProducts } from './lib/api.ts'

type StatItem = { target: number; suffix?: string; label: string }

function App() {
  const isCmsRoute = window.location.pathname.startsWith('/cms')
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
  const [products, setProducts] = useState<ProductsData>(localProducts as ProductsData)
  const [showItemNav, setShowItemNav] = useState(false)
  const visibleSectionsRef = useRef<Set<string>>(new Set())

  const uiText = {
    hr: {
      heroTitle: 'Industrijska ambalaza koja drzi ritam proizvodnje',
      aboutTitle: info.title_desc.hr,
      aboutDescription: info.description.hr,
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
      processTitle: 'Kako suradnja izgleda',
      processSteps: [
        { title: 'Upit i analiza', desc: 'Brzo definiramo potrebe, materijal i rokove prema tvojoj proizvodnji.' },
        { title: 'Specifikacija i uzorci', desc: 'Priprema tehničkih detalja, usklađenje i validacija prije serije.' },
        { title: 'Serijska proizvodnja', desc: 'Kontrolirana proizvodnja i planirana isporuka bez uskih grla.' },
      ],
    },
    en: {
      heroTitle: 'Industrial packaging that keeps production moving',
      aboutTitle: info.title_desc.en,
      aboutDescription: info.description.en,
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
      processTitle: 'How collaboration works',
      processSteps: [
        { title: 'Inquiry & analysis', desc: 'We define needs, material specs and delivery windows based on your line.' },
        { title: 'Specification & sampling', desc: 'Technical alignment and validation before full production starts.' },
        { title: 'Serial production', desc: 'Controlled manufacturing and reliable delivery planning.' },
      ],
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

    fetchProducts()
      .then(setProducts)
      .catch(() => {
        // fallback stays localProducts
      })
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
        <HeroLanding
          lang={lang}
          text={{
            heroTitle: uiText[lang].heroTitle,
            aboutTitle: uiText[lang].aboutTitle,
            aboutDescription: uiText[lang].aboutDescription,
            quoteCta: uiText[lang].quoteCta,
            productsCta: uiText[lang].productsCta,
          }}
        />

        <ProofStats title={uiText[lang].statsTitle} stats={uiText[lang].stats} />

        <ProcessRail title={uiText[lang].processTitle} steps={uiText[lang].processSteps} />

        {Object.entries(products).map(([key], index, entries) => (
          <Fragment key={key}>
            <Section keyName={key} products={products} lang={lang} onInViewChange={handleSectionInViewChange} />
            {index < entries.length - 1 && <Cans />}
          </Fragment>
        ))}
        <Contact lang={lang} />
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
