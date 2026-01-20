import React from 'react'
import categories from "../products.json"



const ItemNavBar = () => {
  return (
    <nav className="h-full w-full">
        <div className="flex h-full flex-col items-end justify-evenly">
      {Object.entries(categories).map(([key]) => (
        <button className='cursor-pointer' key={key} onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })}>
            <img className="w-32" src={categories[key].icon.url} alt="" />
        </button>
      ))}
        </div>
    </nav>
  )
}

export default ItemNavBar
