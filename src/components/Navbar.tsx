import React, { useEffect, useState } from 'react'

import '../index.css'

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        let prevScroll =  window.scrollY
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
    <nav className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className={`flex flex-wrap justify-around items-center`}>
            <img src="logo.jpeg" alt="logo" className='w-35' />

            <div className='flex flex-1 justify-around'>
                <div>
                    Home
                </div>
                <div>
                    About
                </div>
                <div>
                    Services
                </div>
                <div>
                    Contact
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar