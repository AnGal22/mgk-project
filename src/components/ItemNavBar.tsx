import type { ProductsData } from '../types/products'

type ItemNavBarProps = {
  lang: 'hr' | 'en'
  products: ProductsData
  mobile?: boolean
}

const ItemNavBar = ({ lang, products, mobile = false }: ItemNavBarProps) => {
  const entries = Object.entries(products)
  const itemCount = entries.length

  if (mobile) {
    return (
      <nav className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {entries.map(([key, product]) => (
            <button
              className="min-w-[3rem] flex-1 cursor-pointer rounded-xl p-1 transition-transform duration-200 ease-out hover:scale-105"
              key={key}
              onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <img
                className="mx-auto h-auto w-[clamp(1.7rem,7vw,2.2rem)] object-contain"
                src={product.icon.url}
                alt={product.icon.alt[lang]}
              />
            </button>
          ))}
        </div>
      </nav>
    )
  }

  const navWidth = itemCount > 5 ? 'w-[clamp(6rem,10vw,9rem)]' : 'w-[clamp(8rem,14vw,13rem)]'
  const iconWidth = itemCount > 6 ? 'w-[clamp(4.5rem,7vw,6.5rem)]' : itemCount > 4 ? 'w-[clamp(5.2rem,8vw,8rem)]' : 'w-[clamp(7rem,12vw,11.5rem)]'
  const justifyClass = itemCount > 5 ? 'justify-start gap-2 overflow-y-auto py-2' : 'justify-evenly'

  return (
    <nav className={`h-full ${navWidth}`}>
      <div className={`flex h-full flex-col items-end pr-2 ${justifyClass}`}>
        {entries.map(([key, product]) => (
          <button className="cursor-pointer" key={key} onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })}>
            <img
              className={`h-auto ${iconWidth} object-contain transition-transform duration-200 ease-out hover:scale-110`}
              src={product.icon.url}
              alt={product.icon.alt[lang]}
            />
          </button>
        ))}
      </div>
    </nav>
  )
}

export default ItemNavBar
