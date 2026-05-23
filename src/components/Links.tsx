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
    const isHomeRoute = window.location.pathname === '/'

    if (!isHomeRoute) {
      window.location.href = id === 'home-hero' ? '/' : `/#${id}`
      return
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onNavigate?.()
  }

  const goToContactPage = () => {
    window.location.href = '/contact'
    onNavigate?.()
  }

  const goToQualityControlPage = () => {
    window.location.href = '/quality-control'
    onNavigate?.()
  }

  const labels = {
    hr: {
      home: 'Početna',
      about: 'O nama',
      services: 'Proizvodi',
      quality: 'Kontrola kvalitete',
      contact: 'Kontakt'
    },
    en: {
      home: 'Home',
      about: 'About',
      services: 'Products',
      quality: 'Quality Control',
      contact: 'Contact'
    }
  }

  if (mobile) {
    const mobileItems = [
      { label: labels[lang].home, onClick: () => scrollToSection('home-hero') },
      { label: labels[lang].about, onClick: () => scrollToSection('home-hero') },
      { label: labels[lang].services, onClick: () => firstProductId && scrollToSection(firstProductId) },
      { label: labels[lang].quality, onClick: goToQualityControlPage },
      { label: labels[lang].contact, onClick: goToContactPage },
    ]

    return (
      <div className="flex flex-col gap-1 p-1">
        {mobileItems.map((item, index) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="relative flex items-center justify-between gap-4 rounded-md border border-transparent px-4 py-3 text-left text-sm font-medium leading-4 text-gray-700 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-150 hover:bg-gray-900 hover:text-gray-50 active:scale-[0.985] active:bg-gray-900 active:text-gray-50 active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]"
          >
            <span>{item.label}</span>
            {index === 2 ? <span className="text-xs opacity-60">›</span> : null}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className='hidden flex-1 justify-around md:flex'>
      <button onClick={() => scrollToSection('home-hero')} className="cursor-pointer text-[1.3rem] font-medium transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].home}
      </button>
      <button onClick={() => scrollToSection('home-hero')} className="cursor-pointer text-[1.3rem] font-medium transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].about}
      </button>
      <button onClick={() => firstProductId && scrollToSection(firstProductId)} className="cursor-pointer text-[1.3rem] font-medium transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].services}
      </button>
      <button onClick={goToQualityControlPage} className="cursor-pointer text-[1.3rem] font-medium transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].quality}
      </button>
      <button onClick={goToContactPage} className="cursor-pointer text-[1.3rem] font-medium transition-transform duration-200 ease-out hover:scale-110">
        {labels[lang].contact}
      </button>
    </div>
  )
}

export default Links
