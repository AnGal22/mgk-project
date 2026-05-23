import { sortProductEntries } from '../lib/products-order'
import type { ProductsData } from '../types/products'
import { NotchNav } from './ui/notch-nav'

type ItemNavBarProps = {
  lang: 'hr' | 'en'
  products: ProductsData
  mobile?: boolean
  activeValue?: string
}

const ItemNavBar = ({ lang, products, mobile = false, activeValue }: ItemNavBarProps) => {
  const entries = sortProductEntries(products)
  const itemCount = entries.length

  if (mobile) {
    return (
      <NotchNav
        className="max-w-[min(92vw,34rem)]"
        items={entries.map(([key, product]) => ({
          value: key,
          label: product.name[lang],
          iconSrc: product.icon.url,
          iconAlt: product.icon.alt[lang],
        }))}
        value={activeValue}
        onValueChange={(next) => document.getElementById(next)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />
    )
  }

  const navWidth = itemCount > 5 ? 'w-[clamp(6.75rem,11vw,9.75rem)]' : 'w-[clamp(8rem,14vw,13rem)]'
  const iconWidth = itemCount > 7 ? 'w-[clamp(4.7rem,6.8vw,6.2rem)]' : itemCount > 5 ? 'w-[clamp(5.3rem,7.6vw,7rem)]' : itemCount > 4 ? 'w-[clamp(5.8rem,8.8vw,8.6rem)]' : 'w-[clamp(7rem,12vw,11.5rem)]'
  const justifyClass = itemCount > 5 ? 'justify-between gap-2 py-2' : 'justify-evenly'

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
