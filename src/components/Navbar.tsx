import { useEffect, useState } from 'react'

import '../index.css'
import Links from './Links.tsx'
import type { ProductsData } from '../types/products.ts'
import { Button } from './ui/button.tsx'

type NavbarProps = {
  lang: 'hr' | 'en'
  products: ProductsData
  onToggleLanguage: () => void
}

const Navbar = ({ lang, products, onToggleLanguage }: NavbarProps) => {
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
      <nav className={`fixed w-full border-b border-white/30 bg-[rgba(234,244,251,0.88)] backdrop-blur-xl shadow-[0_10px_30px_rgba(23,63,99,0.14)] transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex min-h-[84px] w-full flex-wrap items-center justify-between px-4 py-4 md:px-5">
          <Links lang={lang} products={products} />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="group flex h-12 w-12 rounded-2xl border-white/25 bg-white/24 text-[#123d63] shadow-[0_10px_24px_rgba(18,61,99,0.12)] backdrop-blur-md md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              className="pointer-events-none"
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
              />
            </svg>
          </Button>

          <button
            type="button"
            className="rounded-full bg-[#123d63] px-5 py-2.5 text-[1.05rem] font-semibold text-white shadow-md transition-transform duration-200 ease-out hover:scale-105 hover:bg-[#0e3150]"
            onClick={onToggleLanguage}
          >
            {lang === 'hr' ? 'English' : 'Hrvatski'}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/5 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute left-4 top-[5.35rem] w-[min(16rem,82vw)] origin-top-left animate-[menuPopIn_180ms_cubic-bezier(.2,.9,.2,1)_both] rounded-md bg-[canvas] py-2 text-gray-900 shadow-[0_22px_50px_rgba(0,0,0,0.18)] outline outline-1 outline-gray-200/90 ring-1 ring-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <Links lang={lang} products={products} mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
