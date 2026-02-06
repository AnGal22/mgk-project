
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import Section from './components/section.tsx'
import SidePanel from './components/SidePanel.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import Cans from './components/cans.tsx'
import categories from "./products.json"
import info from "./info.json"
import { Fragment, useCallback, useRef, useState } from 'react'
function App() {
  
  
  
  const [category, setCategory] = useState(0)
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
  const [showItemNav, setShowItemNav] = useState(false)
  const visibleSectionsRef = useRef<Set<string>>(new Set())
  

  const sectionText = {
    hr: {
      section1: 'Sekcija 1',
      section2: 'Spremnici',
      section3: 'Sekcija 3'
    },
    en: {
      section1: 'Section 1',
      section2: 'Containers',
      section3: 'Section 3'
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
    setShowItemNav(next.size > 0)
  }, [])

  return (
    <div className="bg-[url(/bg1.jpg)]"> 
      <Navbar lang={lang}/>  
      <div
        className="fixed top-20 right-0 z-50 h-[80vh] "
        style={{
          transform: showItemNav ? 'translateX(0)' : 'translateX(100%)',
          opacity: showItemNav ? 1 : 0,
          transition: 'transform 400ms ease, opacity 400ms ease',
          pointerEvents: showItemNav ? 'auto' : 'none',
        }}//moram skuzit zasto ovo nece raditi u tailwind css a u inline sasvim dobro
      >
        <ItemNavBar />
      </div>
      <div className="pt-20 min-h-screen w-full flex flex-col items-center justify-center ">
          <section className='hero-bg min-h-screen w-full text-white flex items-center justify-center'>
            <div className="hero-grid w-full max-w-6xl px-6 py-16">
              <div className="hero-text slide-in-left">
                <p className="hero-eyebrow">MGK-pack d.d.</p>
                <h1 className="hero-title">
                  Industrijska ambalaza koja drzi ritam proizvodnje
                </h1>
                <h1 className="hero-desc-title">{info.title_desc}</h1>
                <p className="hero-desc">{info.description}</p>
                <div className="hero-metrics">
                  <div>
                    <p className="hero-metric-title">Kontrola kvalitete</p>
                    <p className="hero-metric-sub">Stabilne serije, precizne tolerancije</p>
                  </div>
                  <div>
                    <p className="hero-metric-title">Pouzdana isporuka</p>
                    <p className="hero-metric-sub">Planirano, na vrijeme, bez zastoja</p>
                  </div>
                </div>
                <div className="hero-actions">
                  <button className="hero-cta primary">Zatrazi ponudu</button>
                  <button className="hero-cta ghost">Pogledaj proizvode</button>
                </div>
              </div>
              <div className="hero-media slide-in-right">
                <div className="hero-video-frame">
                  <video
                    className="hero-video"
                    src="loop.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  ></video>
                </div>
              </div>
            </div>
          </section>
            
            {Object.entries(categories).map(([key], index, entries) => (
              <Fragment key={key}>
                <Section
                  keyName={key as keyof typeof categories}
                  onInViewChange={handleSectionInViewChange}
                />
                {index < entries.length - 1 && <Cans />}
              </Fragment>
            ))}
            
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
