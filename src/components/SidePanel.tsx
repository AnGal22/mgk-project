import { useEffect, type ReactNode } from 'react'

type SidePanelProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  closeLabel?: string
  children?: ReactNode
}

const SidePanel = ({ isOpen, onClose, title, closeLabel = 'Close panel', children }: SidePanelProps) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const scrollY = window.scrollY
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyPosition = document.body.style.position
    const previousBodyTop = document.body.style.top
    const previousBodyWidth = document.body.style.width
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.position = previousBodyPosition
      document.body.style.top = previousBodyTop
      document.body.style.width = previousBodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-3/4 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            className="rounded-md px-3 py-1 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
            aria-label={closeLabel}
          >
            X
          </button>
        </div>
        <div className="h-[calc(100%-64px)] overflow-y-auto p-6 text-gray-800">
          {children}
        </div>
      </aside>
    </div>
  )
}

export default SidePanel
