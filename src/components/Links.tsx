
import categories from "../products.json"

type LinksProps = {
  lang: 'hr' | 'en';
}

const Links = ({ lang }: LinksProps) => {
  const firstProductId = Object.keys(categories)[0]

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const labels = {
    hr: {
      home: 'Pocetna',
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

  return (
    <div className='hidden flex-1 justify-around sm:flex'>
        <button onClick={() => scrollToSection('home-hero')} className='cursor-pointer'>
            {labels[lang].home}
        </button>
        <button onClick={() => scrollToSection('home-hero')} className='cursor-pointer'> 
            {labels[lang].about}
        </button>
        <button onClick={() => scrollToSection(firstProductId)} className='cursor-pointer'>
            {labels[lang].services}
        </button>
        <button onClick={() => scrollToSection('contact')} className='cursor-pointer'>
            {labels[lang].contact}
        </button>
    </div>
  )
}

export default Links
