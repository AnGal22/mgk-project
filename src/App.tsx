
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import categories from "./products.json"
import React, { useState } from 'react'
function App() {
  
  const [category, setCategory] = useState(0)

  return (
    <div className="bg-[url(/bg1.jpg)]">
      <Navbar/>  
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <section className='animate-slideInLeft min-h-screen w-full  text-white flex items-center justify-center bg-[url(/zgrada.png)]'><h1 className='text-7xl'>Sekcija 1</h1></section>
          <section className='animate-slideInLeft min-h-screen w-full text-white flex items-center justify-center bg-[url(/trake.jpg)] bg-cover'><h1 className='text-7xl'>Sekcija 2</h1></section>
          <section className='animate-slideInRight min-h-screen w-full bg-gray-800 text-white flex items-center justify-center bg-[url(/cans.jpg)] bg-cover'><h1 className='text-7xl'>Sekcija 3</h1></section>
      </div>
      <div className=" w-full flex  justify-between">
        <div className=" w-50 text-white flex flex-col justify-around text-3xl border ">

          
            {categories.map((category) => (
              <ul className='border h-full flex justify-center items-center'>
                <button className='cursor-pointer' onClick={() => setCategory(category.cat_id)}>{category.cat_name}</button>
              </ul>
            ))}
          
        </div>
        <div className=" w-full flex  justify-center">
          <ul className='flex flex-row gap-x-6 flex-wrap'>
            {categories[category].products.map((product) => (
              <Product key={product.prod_id} name={product.name} info={product.info} image={product.image}/>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
