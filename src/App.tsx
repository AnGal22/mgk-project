
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import products from "./products.json"

function App() {
  

  return (
    <>
      <Navbar/>
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <section className='min-h-screen w-full bg-black text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 1</h1></section>
          <section className='min-h-screen w-full bg-slate-700 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 2</h1></section>
          <section className='min-h-screen w-full bg-gray-800 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 3</h1></section>
      </div>
      <div className=" w-full flex  justify-center">
        <ul className='flex flex-row gap-x-6 flex-wrap'>
          {products.map((product) => (
            <Product key={product.id} name={product.name} info={product.info} image={product.image}/>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
