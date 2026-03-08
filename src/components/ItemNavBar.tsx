import categories from "../products.json"

type ItemNavBarProps = {
  lang: 'hr' | 'en'
  mobile?: boolean
}

const ItemNavBar = ({ lang, mobile = false }: ItemNavBarProps) => {
  if (mobile) {
    return (
      <nav className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between gap-1">
          {Object.entries(categories).map(([key]) => (
            <button
              className="flex-1 cursor-pointer rounded-xl p-1 transition-transform duration-200 ease-out hover:scale-105"
              key={key}
              onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <img
                className="mx-auto h-auto w-[clamp(1.9rem,8vw,2.4rem)] object-contain"
                src={categories[key as keyof typeof categories].icon.url}
                alt={categories[key as keyof typeof categories].icon.alt[lang]}
              />
            </button>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <nav className="h-full w-[clamp(8rem,14vw,13rem)]">
      <div className="flex h-full flex-col items-end justify-evenly pr-2">
        {Object.entries(categories).map(([key]) => (
          <button className="cursor-pointer" key={key} onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })}>
            <img
              className="h-auto w-[clamp(7rem,12vw,11.5rem)] object-contain transition-transform duration-200 ease-out hover:scale-110"
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
