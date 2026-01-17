
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import Section from './components/section.tsx'
import SidePanel from './components/SidePanel.tsx'
import ItemNavBar from './components/ItemNavBar.tsx'
import categories from "./products.json"
import { useCallback, useRef, useState } from 'react'
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
        className="fixed top-20 right-0 z-50 h-[80vh] w-[80vw]"
        style={{
          transform: showItemNav ? 'translateX(0)' : 'translateX(100%)',
          opacity: showItemNav ? 1 : 0,
          transition: 'transform 400ms ease, opacity 400ms ease',
          pointerEvents: showItemNav ? 'auto' : 'none',
        }}//moram skuzit zasto ovo nece raditi u tailwind css a u inline sasvim dobro
      >
        <ItemNavBar />
      </div>
      <div className="pt-20 min-h-screen w-full flex flex-col items-center justify-center">
          <section className=' min-h-screen w-full  text-white flex items-center justify-center bg-[url(/home.png)] bg-no-repeat bg-center bg-cover'><h1 className='text-7xl'></h1></section>
          <section className='section2-blur min-h-screen w-full text-white flex items-center justify-center bg-[url(/about.jpg)] bg-cover'>
            <video className='w-45 h-80 object-cover' src="loop.mp4" autoPlay muted loop playsInline></video>
            <h1 className='text-7xl animate-slideInLeftText'>
            </h1>
          </section>
            {Object.entries(categories).map(([key]) => (
              <Section
                key={key}
                keyName={key as keyof typeof categories}
                onInViewChange={handleSectionInViewChange}
              /> //ovo promjeni, nesto cudno
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
