"use client"

import * as React from 'react'

type Item = {
  value: string
  label: string
  iconSrc: string
  iconAlt: string
}

type NotchNavProps = {
  items: Item[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
  className?: string
}

export function NotchNav({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Product navigation',
  className,
}: NotchNavProps) {
  const isControlled = value !== undefined
  const [active, setActive] = React.useState<string>(value ?? defaultValue ?? items[0]?.value ?? '')
  const [ready, setReady] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const [notchRect, setNotchRect] = React.useState<{ left: number; width: number } | null>(null)

  React.useEffect(() => {
    if (isControlled && value !== undefined) setActive(value)
  }, [isControlled, value])

  const activeIndex = React.useMemo(
    () => Math.max(0, items.findIndex((item) => item.value === active)),
    [items, active]
  )

  const updateNotch = React.useCallback(() => {
    const container = containerRef.current
    const element = itemRefs.current[activeIndex]
    if (!container || !element) return

    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    setNotchRect({
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
    })
    setReady(true)
  }, [activeIndex])

  React.useLayoutEffect(() => {
    updateNotch()
    window.addEventListener('resize', updateNotch)
    return () => window.removeEventListener('resize', updateNotch)
  }, [updateNotch])

  const commitChange = (next: string) => {
    if (!isControlled) setActive(next)
    onValueChange?.(next)
  }

  const focusItem = (index: number) => {
    const element = itemRefs.current[Math.max(0, Math.min(items.length - 1, index))]
    element?.focus()
  }

  return (
    <nav aria-label={ariaLabel} className={['mx-auto w-full', className].filter(Boolean).join(' ')}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/12 px-2 py-2 shadow-[0_18px_45px_rgba(17,52,81,0.14)] backdrop-blur-md"
      >
        {notchRect && (
          <div
            className={`pointer-events-none absolute top-2 bottom-2 rounded-[1.2rem] bg-white/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.38)] transition-all duration-300 ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: notchRect.left, width: notchRect.width }}
          />
        )}

        <ul
          role="menubar"
          className="relative z-10 flex items-center justify-between gap-1"
          onKeyDown={(event) => {
            const key = event.key
            if (![ 'ArrowLeft', 'ArrowRight', 'Home', 'End' ].includes(key)) return
            event.preventDefault()
            if (key === 'ArrowRight') focusItem(activeIndex + 1)
            if (key === 'ArrowLeft') focusItem(activeIndex - 1)
            if (key === 'Home') focusItem(0)
            if (key === 'End') focusItem(items.length - 1)
          }}
        >
          {items.map((item, index) => {
            const isActive = item.value === active
            return (
              <li key={item.value} role="none" className="flex-1">
                <button
                  ref={(element) => {
                    itemRefs.current[index] = element
                  }}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className="flex w-full min-w-0 items-center justify-center rounded-[1.2rem] border-0 bg-transparent px-1 py-2 outline-none ring-0 transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-sky-400/60"
                  onClick={() => commitChange(item.value)}
                >
                  <img
                    className={`h-auto w-[clamp(3.5rem,14vw,4.8rem)] object-contain transition-transform duration-300 ${isActive ? 'scale-105' : 'scale-100 opacity-90'}`}
                    src={item.iconSrc}
                    alt={item.iconAlt}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
