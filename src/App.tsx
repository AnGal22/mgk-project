
import './App.css'
import Navbar from './components/Navbar.tsx'
import Section from './components/section.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import Cans from './components/cans.tsx'
import Contact from './components/Contact.tsx'
import categories from "./products.json"
import info from "./info.json"
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
function App() {
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
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
    }
  }

  const handleSectionInViewChange = useCallback((keyName: string, inView: boolean) => {
    const next = new Set(visibleSectionsRef.current)
    if (inView) {
      next.add(keyName)
    } else {
      next.delete(keyName)
    }
    visibleSectionsRef.current = next
  }, [])

  useEffect(() => {
    const firstSectionId = Object.keys(categories)[0]
    const showWhenFirstSectionTopIsAt = 0.25

    const updateItemNavVisibility = () => {
      const firstSectionEl = document.getElementById(firstSectionId)
      if (!firstSectionEl) {
        setShowItemNav(false)
        return
      }

      const firstSectionTop = firstSectionEl.getBoundingClientRect().top
      const triggerLine = window.innerHeight * showWhenFirstSectionTopIsAt
      setShowItemNav(firstSectionTop <= triggerLine)
    }

    updateItemNavVisibility()
    window.addEventListener('scroll', updateItemNavVisibility, { passive: true })
    window.addEventListener('resize', updateItemNavVisibility)

    return () => {
      window.removeEventListener('scroll', updateItemNavVisibility)
      window.removeEventListener('resize', updateItemNavVisibility)
    }
  }, [])

  return (
    <div className="bg-[url(/bg1.jpg)]"> 
      <Navbar lang={lang}/>  
      <div
        className="fixed top-20 left-0 z-50 h-[80vh] "
        style={{
          transform: showItemNav ? 'translateX(0)' : 'translateX(-100%)',
          opacity: showItemNav ? 1 : 0,
          transition: 'transform 400ms ease, opacity 400ms ease',
          pointerEvents: showItemNav ? 'auto' : 'none',
        }}//moram skuzit zasto ovo nece raditi u tailwind css a u inline sasvim dobro
      >
        <ItemNavBar lang={lang} />
      </div>
      <div className="pt-20 min-h-screen w-full flex flex-col items-center justify-center ">
          <section id="home-hero" className='hero-bg min-h-screen w-full text-white flex items-center justify-center'>
            <div className="hero-grid w-full max-w-6xl px-6 py-16">
              <div className="hero-text slide-in-left">
                <p className="hero-eyebrow">MGK-pack d.d.</p>
                <h1 className="hero-title">
                  {uiText[lang].heroTitle}
                </h1>
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
                <div className="hero-actions">
                  <button className="hero-cta primary">{uiText[lang].quoteCta}</button>
                  <button className="hero-cta ghost">{uiText[lang].productsCta}</button>
                </div>
              </div>
            </div>
          </section>
            
            {Object.entries(categories).map(([key], index, entries) => (
              <Fragment key={key}>
                <Section
                  keyName={key as keyof typeof categories}
                  lang={lang}
                  onInViewChange={handleSectionInViewChange}
                />
                {index < entries.length - 1 && <Cans />}
              </Fragment>
            ))}
            <Contact lang={lang} />
            
      </div>
      
      <div className="fixed bottom-6 right-6">
        <button
          className="bg-white text-black px-4 py-2 rounded-full shadow-md"
          onClick={() => setLang(lang === 'hr' ? 'en' : 'hr')}
        >
          {lang === 'hr' ? 'English' : 'Hrvatski'}
        </button>
      </div>
      <div className="fixed bottom-6 left-6">
      </div>
    </div>
  )
}

export default App
