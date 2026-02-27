import categories from "../products.json"

type ItemNavBarProps = {
  lang: 'hr' | 'en'
}

const ItemNavBar = ({ lang }: ItemNavBarProps) => {
  return (
    <nav className="h-full w-[clamp(8rem,14vw,13rem)]">
        <div className="flex h-full flex-col items-end justify-evenly pr-2">
      {Object.entries(categories).map(([key]) => (
        <button className='cursor-pointer' key={key} onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })}>
            <img
              className="h-auto w-[clamp(7rem,12vw,11.5rem)] object-contain"
              src={categories[key as keyof typeof categories].icon.url}
              alt={categories[key as keyof typeof categories].icon.alt[lang]}
            />
        </button>
      ))}
        </div>
    </nav>
  )
}

export default ItemNavBar
