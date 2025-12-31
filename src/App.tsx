
import './App.css'
import Navbar from './components/Navbar.tsx'
import Product from './components/Product.tsx'
import products from "./products.json"

function App() {
  

  return (
    <div className="bg-[url('/bg.webp')]">
      <Navbar/>  
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <section className='animate-slideInLeft min-h-screen w-full bg-black text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 1</h1></section>
          <section className='animate-slideInLeft min-h-screen w-full bg-slate-700 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 2</h1></section>
          <section className='animate-slideInRight min-h-screen w-full bg-gray-800 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 3</h1></section>
      </div>
      <div className=" w-full flex  justify-between">
        <div className=" w-50 text-white flex flex-col justify-around text-3xl border ">
          <ul className='border h-full flex justify-center items-center'>Kategorija1</ul>
          <ul className='border h-full flex justify-center items-center'>Kategorija2</ul>
          <ul className='border h-full flex justify-center items-center'>Kategorija3</ul>
          <ul className='border h-full flex justify-center items-center'>Kategorija4</ul>
        </div>
        <div className=" w-full flex  justify-center">
          <ul className='flex flex-row gap-x-6 flex-wrap'>
            {products.map((product) => (
              <Product key={product.id} name={product.name} info={product.info} image={product.image}/>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
