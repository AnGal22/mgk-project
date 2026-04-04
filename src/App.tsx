import './App.css'
import Navbar from './components/Navbar.tsx'
import Section from './components/section.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import Cans from './components/cans.tsx'
import Contact from './components/Contact.tsx'
import ContactPage from './components/ContactPage.tsx'
import ZoomParallaxDemo from './components/ZoomParallaxDemo.tsx'
import CmsPanel from './components/CmsPanel.tsx'
import AppLoadingScreen from './components/ui/AppLoadingScreen.tsx'
import StatsDefault from './components/ui/stats-default.tsx'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { ProductsData } from './types/products.ts'
import { fetchProducts, fetchSiteInfo, type SiteInfo } from './lib/api.ts'

type StatItem = { target: number; suffix?: string; label: string }

function App() {
  const isCmsRoute = window.location.pathname.startsWith('/cms')
  const isContactRoute = window.location.pathname === '/contact'
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
  const [products, setProducts] = useState<ProductsData>({})
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    title_desc: { hr: '', en: '' },
    description: { hr: '', en: '' },
    contact: { address: '', phone: '', location: '', email: '', certificates: '' },
  })
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [showItemNav, setShowItemNav] = useState(false)
  const [heroCanVisible, setHeroCanVisible] = useState(false)
  const [heroPateCanVisible, setHeroPateCanVisible] = useState(false)
  const [heroTinCanVisible, setHeroTinCanVisible] = useState(false)
  const [heroCapVisible, setHeroCapVisible] = useState(false)
  const [heroWineCapVisible, setHeroWineCapVisible] = useState(false)
  const [isZoomParallaxLocked, setIsZoomParallaxLocked] = useState(false)
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
      statsDescription: 'Više od pola stoljeća industrijskog iskustva pretvoreno je u konkretne proizvodne rezultate, izvoznu širinu i pouzdanu isporuku.',
      statsIntro: 'Od domaće proizvodnje do međunarodnih tržišta, gradimo sustav koji kupcima daje stabilnost, fleksibilnost i kvalitetu u velikim serijama.',
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
      statsDescription: 'More than half a century of industrial experience has been turned into measurable production output, export reach and dependable delivery.',
      statsIntro: 'From local manufacturing to international markets, we build a system that gives customers stability, flexibility and quality at scale.',
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
    if (isCmsRoute) {
      setIsAppLoading(false)
      return
    }

    setIsAppLoading(true)
    Promise.allSettled([fetchProducts(), fetchSiteInfo()])
      .then(([productsResult, infoResult]) => {
        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value)
        }
        if (infoResult.status === 'fulfilled') {
          setSiteInfo(infoResult.value)
        }
      })
      .finally(() => {
        setIsAppLoading(false)
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

  useEffect(() => {
    if (isCmsRoute || isAppLoading) return

    setHeroCanVisible(false)
    setHeroPateCanVisible(false)
    setHeroTinCanVisible(false)
    setHeroCapVisible(false)
    setHeroWineCapVisible(false)

    const id = setTimeout(() => setHeroCanVisible(true), 500)
    const idPate = setTimeout(() => setHeroPateCanVisible(true), 900)
    const idTin = setTimeout(() => setHeroTinCanVisible(true), 1250)
    const idCap = setTimeout(() => {
      setHeroCapVisible(true)
      setHeroWineCapVisible(true)
    }, 1650)
    return () => {
      clearTimeout(id)
      clearTimeout(idPate)
      clearTimeout(idTin)
      clearTimeout(idCap)
    }
  }, [isCmsRoute, isAppLoading])

  useEffect(() => {
    const onZoomParallaxLock = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>
      setIsZoomParallaxLocked(Boolean(customEvent.detail?.locked))
    }

    window.addEventListener('zoom-parallax-lock', onZoomParallaxLock as EventListener)
    return () => window.removeEventListener('zoom-parallax-lock', onZoomParallaxLock as EventListener)
  }, [])

  if (isCmsRoute) {
    return <CmsPanel />
  }

  if (isAppLoading) {
    return <AppLoadingScreen dark={isContactRoute} label={isContactRoute ? 'Učitavanje kontakt stranice...' : 'Učitavanje stranice...'} />
  }

  if (isContactRoute) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f4faff_0%,#e7f3fb_38%,#d7eaf7_100%)]">
        <Navbar lang={lang} products={products} />
        <ContactPage lang={lang} info={siteInfo.contact} />
        <div className="fixed bottom-6 right-6">
          <button className="bg-white text-black px-4 py-2 rounded-full shadow-md transition-transform duration-200 ease-out hover:scale-110" onClick={() => setLang(lang === 'hr' ? 'en' : 'hr')}>
            {lang === 'hr' ? 'English' : 'Hrvatski'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[url(/bg1.webp)]">
      {!isZoomParallaxLocked && <Navbar lang={lang} products={products} />}
      <div
        className="fixed top-20 left-0 z-50 hidden h-[80vh] lg:block"
        style={{
          transform: showItemNav && !isZoomParallaxLocked ? 'translateX(0)' : 'translateX(-100%)',
          opacity: showItemNav && !isZoomParallaxLocked ? 1 : 0,
          transition: 'transform 400ms ease, opacity 400ms ease',
          pointerEvents: showItemNav && !isZoomParallaxLocked ? 'auto' : 'none',
        }}
      >
        <ItemNavBar lang={lang} products={products} />
      </div>

      <div
        className="fixed right-3 left-3 z-50 md:hidden"
        style={{
          bottom: showItemNav && !isZoomParallaxLocked ? '72px' : '-180px',
          opacity: showItemNav && !isZoomParallaxLocked ? 1 : 0,
          transition: 'bottom 350ms ease, opacity 300ms ease',
          pointerEvents: showItemNav && !isZoomParallaxLocked ? 'auto' : 'none',
        }}
      >
        <ItemNavBar lang={lang} products={products} mobile />
      </div>

      <div className="pt-20 min-h-screen w-full flex flex-col items-center">
        <section id="home-hero" className="hero-bg min-h-[88svh] md:min-h-screen w-screen text-white flex items-center justify-center relative left-1/2 -translate-x-1/2 overflow-hidden">
          <div className="hero-grid relative z-10 w-full max-w-6xl px-6 pt-16 pb-64 md:pb-28 md:py-16">
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

          <img src="home-tin-can.webp" className={`hidden md:block w-[35%] fixed bottom-0 left-[65%] translate-y-[-450px] rotate-340 animate-slideInRightText ${heroTinCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
          <img src="home-pate-can.webp" className={`hidden md:block w-[49%] fixed bottom-0 left-[37%] translate-y-[-150px] rotate-45 animate-slideInLeftText ${heroPateCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
          <img src="home-can.webp" className={`hidden md:block fixed bottom-0 left-[55%] w-[70%] md:left-[69%] md:w-[49%] scale-x-[-1] translate-y-[20%] pointer-events-none select-none animate-slideInLeftText z-0 ${heroCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
          <img src="cap.webp" className={`hidden md:block w-[19%] fixed bottom-0 left-[68%] translate-y-[-60px] rotate-340 animate-slideInLeftText ${heroCapVisible ? 'is-in-view' : ''}`} alt="cap" loading="eager" fetchPriority="high" decoding="async" />
          <img src="wine_cap.webp" className={`hidden md:block w-[20%] fixed bottom-0 left-[85%] translate-y-[-200px] rotate-290 animate-slideInRightText ${heroWineCapVisible ? 'is-in-view' : ''}`} alt="wine cap" loading="eager" fetchPriority="high" decoding="async" />

          <div className="absolute inset-x-0 bottom-8 z-10 mx-auto h-[250px] w-full max-w-[360px] px-4 md:hidden pointer-events-none">
            <img src="home-pate-can.webp" className={`absolute bottom-2 left-0 w-[118px] rotate-[10deg] animate-slideInLeftText ${heroPateCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
            <img src="home-can.webp" className={`absolute bottom-0 left-1/2 z-10 w-[154px] -translate-x-1/2 scale-x-[-1] animate-slideInLeftText ${heroCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
            <img src="home-tin-can.webp" className={`absolute bottom-5 right-1 w-[100px] rotate-[-8deg] animate-slideInRightText ${heroTinCanVisible ? 'is-in-view' : ''}`} alt="can" loading="eager" fetchPriority="high" decoding="async" />
            <img src="cap.webp" className={`absolute bottom-[118px] left-[22px] z-20 w-[74px] rotate-[-18deg] animate-slideInLeftText ${heroCapVisible ? 'is-in-view' : ''}`} alt="cap" loading="eager" fetchPriority="high" decoding="async" />
            <img src="wine_cap.webp" className={`absolute bottom-[128px] right-[12px] z-20 w-[84px] rotate-[-24deg] animate-slideInRightText ${heroWineCapVisible ? 'is-in-view' : ''}`} alt="wine cap" loading="eager" fetchPriority="high" decoding="async" />
          </div>
        </section>

        <div className="relative z-10 -mt-10 w-full max-w-6xl px-4 pb-10 md:-mt-18 md:px-6">
          <StatsDefault
            title={uiText[lang].statsTitle}
            description={uiText[lang].statsDescription}
            intro={uiText[lang].statsIntro}
            stats={uiText[lang].stats}
          />
        </div>

        {Object.entries(products).map(([key], index, entries) => (
          <Fragment key={key}>
            <Section keyName={key} products={products} lang={lang} onInViewChange={handleSectionInViewChange} />
            {index < entries.length - 1 && <Cans />}
          </Fragment>
        ))}
        <ZoomParallaxDemo lang={lang} />
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
