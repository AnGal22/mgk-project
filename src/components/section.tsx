import React from 'react'

const section = () => {
  return (
    <section id='odi' className=' relative  min-h-screen w-320 bg-gray-800 text-white bg-[url(/pate.png)] bg-[position:160%_center] bg-no-repeat '>
        <div className="absolute inset-0
  bg-[linear-gradient(90deg,#ffffff_60%,#ffffff_45%,rgba(255,255,255,0.5)_80%,rgba(255,255,255,0)_85%)]" />
        <h1 className='animate-slideInLeftText text-6xl font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-linear-to-r from-blue-400 via-sky-500 to-blue-700
            drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] absolute top-30 left-20'>
            Vucene limenke za prehrambene proizvode
        </h1>
        <img className='animate-slideInRightText w-170 absolute top-50 right-150' src="pate_can.png" alt="" />
        <h2 className='animate-slideInLeftText font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-linear-to-r from-gray-500 via-gray-600 to-gray-800
            drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)] absolute top-150 left-20'>
                About us:
                <br />
MGK-pack d.d. was founded back in 1947 in the city of Rijeka.<br />
Thanks to the constant development and growth,<br />
 in the past sixty year the company has grown to the biggest metal emballage producer in Croatia,<br />
reaching the annual plate processing capacity of more than 5 thousand tons.<br />

MGK-pack d.d. in our times is the factory equipped with modern high-performance machinery<br /> operated by professional staff that is able to efficiently respond to the most complex clients' requirements.<br />

MGK-pack d.d. has been certified according to ISO 9001:2000 standard.</h2>
    </section>
  )
}

export default section
