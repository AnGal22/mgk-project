import { useEffect, useState } from 'react'

import '../index.css'
import Links from './Links.tsx'
import type { ProductsData } from '../types/products.ts'

type NavbarProps = {
  lang: 'hr' | 'en';
  products: ProductsData;
}

const Navbar = ({ lang, products }: NavbarProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    let prevScroll = window.scrollY

    const scrollNavBar = () => {
      const currScroll = window.scrollY

      if (currScroll > prevScroll && currScroll > 200) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      prevScroll = currScroll
    }

    window.addEventListener('scroll', scrollNavBar, { passive: true })

    return () => window.removeEventListener('scroll', scrollNavBar)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileMenuOpen])

  return (
    <>
      <nav className={`fixed w-full bg-white/20 backdrop-blur-md shadow-md transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex w-full flex-wrap items-center justify-between px-3 py-1 sm:justify-around">
          <img
            src="logo-mgkpack-new.jpg"
            alt="MGK Pack logo"
            className="w-[clamp(8.5rem,16vw,14rem)] origin-left transition-transform duration-200 ease-out hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <Links lang={lang} products={products} />

          <button
            type="button"
            className="flex md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <img
              className="w-12 cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
              src="burger_menu.webp"
              alt="burger_menu"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-3 top-20 w-[min(88vw,22rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Links lang={lang} products={products} mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
