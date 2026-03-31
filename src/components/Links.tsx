import type { ProductsData } from '../types/products'

type LinksProps = {
  lang: 'hr' | 'en';
  products: ProductsData;
  mobile?: boolean;
  onNavigate?: () => void;
}

const Links = ({ lang, products, mobile = false, onNavigate }: LinksProps) => {
  const firstProductId = Object.keys(products)[0]

  const scrollToSection = (id: string) => {
    if (window.location.pathname === '/contact') {
      window.location.href = `/${id === 'home-hero' ? '' : `#${id}`}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onNavigate?.()
  }

  const goToContactPage = () => {
    window.location.href = '/contact'
    onNavigate?.()
  }

  const labels = {
    hr: {
      home: 'Početna',
      about: 'O nama',
      services: 'Proizvodi',
      contact: 'Kontakt'
    },
    en: {
      home: 'Home',
      about: 'About',
      services: 'Products',
      contact: 'Contact'
    }
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <button onClick={() => scrollToSection('home-hero')} className="rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition-colors hover:bg-slate-100">
          {labels[lang].home}
        </button>
        <button onClick={() => scrollToSection('home-hero')} className="rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition-colors hover:bg-slate-100">
          {labels[lang].about}
        </button>
        <button onClick={() => firstProductId && scrollToSection(firstProductId)} className="rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition-colors hover:bg-slate-100">
          {labels[lang].services}
        </button>
        <button onClick={goToContactPage} className="rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition-colors hover:bg-slate-100">
          {labels[lang].contact}
        </button>
      </div>
    )
  }

  return (
    <div className='hidden flex-1 justify-around md:flex'>
      <button onClick={() => scrollToSection('home-hero')} className="cursor-pointer transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].home}
      </button>
      <button onClick={() => scrollToSection('home-hero')} className="cursor-pointer transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].about}
      </button>
      <button onClick={() => firstProductId && scrollToSection(firstProductId)} className="cursor-pointer transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].services}
      </button>
      <button onClick={goToContactPage} className="cursor-pointer transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].contact}
      </button>
    </div>
  )
}

export default Links
