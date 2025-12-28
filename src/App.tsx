
import './App.css'
import Navbar from './components/Navbar.tsx'

function App() {
  

  return (
    <>
      <Navbar/>
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <section className='min-h-screen w-full bg-black text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 1</h1></section>
          <section className='min-h-screen w-full bg-slate-700 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 2</h1></section>
          <section className='min-h-screen w-full bg-gray-800 text-white flex items-center justify-center'><h1 className='text-7xl'>Sekcija 3</h1></section>
      </div>
    </>
  )
}

export default App
