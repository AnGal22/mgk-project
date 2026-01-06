import React from 'react'

type LinksProps = {
  lang: 'hr' | 'en';
}

const Links = ({ lang }: LinksProps) => {
  const labels = {
    hr: {
      home: 'Pocetna',
      about: 'O nama',
      services: 'Usluge',
      contact: 'Kontakt'
    },
    en: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact'
    }
  }

  return (
    <div className='hidden flex-1 justify-around sm:flex'>
        <button onClick={() => document.getElementById('odi')?.scrollIntoView({ behavior: 'smooth' })} className='cursor-pointer'>
            {labels[lang].home}
        </button>
        <div className='cursor-pointer'> 
            {labels[lang].about}
        </div>
        <div className='cursor-pointer'>
            {labels[lang].services}
        </div>
        <div className='cursor-pointer'>
            {labels[lang].contact}
        </div>
    </div>
  )
}

export default Links
