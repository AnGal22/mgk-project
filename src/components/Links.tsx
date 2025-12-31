import React from 'react'

const Links = () => {
  return (
    <div className='hidden flex-1 justify-around sm:flex'>
        <div className='cursor-pointer'>
            Home
        </div>
        <div className='cursor-pointer'> 
            About
        </div>
        <div className='cursor-pointer'>
            Services
        </div>
        <div className='cursor-pointer'>
            Contact
        </div>
    </div>
  )
}

export default Links