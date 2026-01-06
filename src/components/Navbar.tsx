import React, { useEffect, useState } from 'react'

import '../index.css'
import Links from "./Links.tsx"

type NavbarProps = {
  lang: 'hr' | 'en';
}

const Navbar = ({ lang }: NavbarProps) => {

    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        let prevScroll =  window.scrollY
        console.log(window.innerWidth)
        const scrollNavBar = () => {
            const currScroll=window.scrollY

            if(currScroll > prevScroll && currScroll > 200){ //trenutni scroll mora biti veci od 100 piksela
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }

            prevScroll = currScroll
    }

      window.addEventListener("scroll", scrollNavBar)

      return () => window.removeEventListener('scroll', scrollNavBar)
    }, [])
    




  return (
    <nav className={`fixed w-full bg-white/20 backdrop-blur-md shadow-md transition-transform duration-300 z-50 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className={`flex w-full  flex-wrap sm:justify-around items-center justify-between`}>
            <img src="logo.png" alt="logo" className='w-30' />
            <Links lang={lang}/>
            <div className='flex sm:hidden'>
                <img className='w-20 cursor-pointer' src="../public/burger_menu.png" alt="burger_menu" />
            </div>
        </div>
    </nav>
  )
}

export default Navbar
