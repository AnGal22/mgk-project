
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import Section from './components/section.tsx'
import SidePanel from './components/SidePanel.tsx'
import categories from "./products.json"
import { useState } from 'react'
function App() {
  
  const [category, setCategory] = useState(0)
  const [lang, setLang] = useState<'hr' | 'en'>('hr')
  const [isPanelOpen, setIsPanelOpen] = useState(false)

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

  return (
    <div className="bg-[url(/bg1.jpg)]">
      <Navbar lang={lang}/>  
      <div className="pt-20 min-h-screen w-full flex flex-col items-center justify-center">
          <section className=' min-h-screen w-full  text-white flex items-center justify-center bg-[url(/home.png)] bg-no-repeat bg-center bg-cover'><h1 className='text-7xl'></h1></section>
          <section className='section2-blur min-h-screen w-full text-white flex items-center justify-center bg-[url(/about.jpg)] bg-cover'>
            <h1 className='text-7xl animate-slideInLeftText'>
              {sectionText[lang].section2}
              <div className=' text-black border-2 rounded-2xl'>PORUKA PORUKA PORKUKA PIRRK</div>
            </h1>
          </section>
          <Section/>
      </div>
      <div className=" w-full flex  justify-between">
        <div className=" w-50 text-white flex flex-col justify-around text-3xl border ">

          
            {categories.map((category) => (
              <ul className='border  h-full flex justify-center items-center'>
                <button className='cursor-pointer text-black' onClick={() => setCategory(category.cat_id)}>{category.cat_name[lang]}</button>
              </ul>
            ))}
          
        </div>
        <div className=" w-full flex  justify-center">
          <ul className='flex flex-row gap-x-6 flex-wrap'>
            {categories[category].products.map((product) => (
              <Product key={product.prod_id} name={product.name} info={product.info} image={product.image} lang={lang}/>
            ))}
          </ul>
        </div>
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
        <button
          className="bg-white text-black px-4 py-2 rounded-full shadow-md"
          onClick={() => setIsPanelOpen(true)}
        >
          Info
        </button>
      </div>
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Informacije"
      >
        <p className="mb-3">
          Ovdje mozes staviti bilo kakav sadrzaj: opis, kontakt, linkove ili FAQ.
        </p>
        <p>
          Panel se zatvara klikom na X ili na tamni overlay izvan panela.
        </p>
      </SidePanel>
    </div>
  )
}

export default App
