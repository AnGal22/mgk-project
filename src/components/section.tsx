import React, { useEffect, useRef, useState } from 'react'
import SidePanel from './SidePanel'
import categories from "../products.json"

type SectionProps = {
  keyName: keyof typeof categories
  onInViewChange?: (keyName: keyof typeof categories, inView: boolean) => void
}


const section = ({ keyName, onInViewChange }:SectionProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const targets = rootRef.current.querySelectorAll('[data-animate]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting)
        })
      },
      { threshold: 0.2,
        rootMargin: '13% 0px -13% 0px',
       }
    )

    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!rootRef.current || !onInViewChange) {
      return
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onInViewChange(keyName, entry.isIntersecting)
        })
      },
      { threshold: 0.2 }
    )

    sectionObserver.observe(rootRef.current)

    return () => {
      sectionObserver.disconnect()
    }
  }, [keyName, onInViewChange])

  return (
    <section id={keyName} ref={rootRef} data-section className=' relative  min-h-screen w-320 bg-gray-800 text-white bg-[url(/pate.png)] bg-[position:160%_center] bg-no-repeat '>
        <div className="absolute inset-0
  bg-[linear-gradient(90deg,#ffffff_60%,#ffffff_45%,rgba(255,255,255,0.5)_80%,rgba(255,255,255,0)_85%)]" />
        <h1 data-animate className='animate-slideInLeftText text-6xl font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-linear-to-r from-blue-400 via-sky-500 to-blue-700
            drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] absolute top-30 left-20'>
            {categories[keyName].name.hr}
        </h1>
        <img data-animate className='animate-slideInRightText w-170 absolute top-50 right-150' src="pate_can.png" alt="" />
        <button className='absolute text-red-500' onClick={() => setIsPanelOpen(true)}>Specifikacije</button>
        <h2 data-animate className='animate-slideInLeftText font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-linear-to-r from-gray-500 via-gray-600 to-gray-800
            drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] absolute top-150 left-20'>
                <h3 className='text-3xl'>About us:</h3>
                <br />
MGK-pack d.d. was founded back in 1947 in the city of Rijeka.<br />
Thanks to the constant development and growth,<br />
 in the past sixty year the company has grown to the biggest metal emballage producer in Croatia,<br />
reaching the annual plate processing capacity of more than 5 thousand tons.<br />

MGK-pack d.d. in our times is the factory equipped with modern high-performance machinery<br />
 operated by professional staff that is able to efficiently respond to the most complex clients' requirements.<br />

MGK-pack d.d. has been certified according to ISO 9001:2000 standard.</h2>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={categories[keyName].name.hr}
        key={keyName}
      > 
      <p>{categories[keyName].description.hr}</p>

      </SidePanel>
    </section>

    
  )
}

export default section
