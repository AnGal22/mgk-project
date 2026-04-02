'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Image {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[]
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const progress = useMotionValue(0)
  const [activeLock, setActiveLock] = useState(false)
  const touchStartY = useRef<number | null>(null)

  const scale4 = useTransform(progress, [0, 1], [1, 4])
  const scale5 = useTransform(progress, [0, 1], [1, 5])
  const scale6 = useTransform(progress, [0, 1], [1, 6])
  const scale8 = useTransform(progress, [0, 1], [1, 8])
  const scale9 = useTransform(progress, [0, 1], [1, 9])
  const overlayOpacity = useTransform(progress, [0, 0.12, 1], [0.15, 0.9, 0.65])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  useEffect(() => {
    const updateLockState = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const reachedSection = rect.top <= viewportHeight * 0.08
      const beforeFooter = rect.bottom >= viewportHeight * 0.72
      const current = progress.get()

      if (reachedSection && beforeFooter && current < 1) {
        setActiveLock(true)
        return
      }

      setActiveLock(false)
    }

    const onScroll = () => updateLockState()
    const onResize = () => updateLockState()

    updateLockState()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [progress])

  useEffect(() => {
    if (!activeLock) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const applyDelta = (deltaY: number) => {
      const current = progress.get()
      const next = clamp(current + deltaY * 0.00055, 0, 1)
      progress.set(next)

      if ((next >= 1 && deltaY > 0) || (next <= 0 && deltaY < 0)) {
        setActiveLock(false)
        document.body.style.overflow = ''
      }
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      applyDelta(event.deltaY)
    }

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY.current == null) return
      const currentY = event.touches[0]?.clientY ?? touchStartY.current
      const deltaY = touchStartY.current - currentY
      touchStartY.current = currentY
      event.preventDefault()
      applyDelta(deltaY)
    }

    const onTouchEnd = () => {
      touchStartY.current = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeLock, progress])

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden">
      <motion.div style={{ opacity: overlayOpacity }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_60%)]" />
      {images.map(({ src, alt }, index) => {
        const scale = scales[index % scales.length]

        return (
          <motion.div
            key={index}
            style={{ scale }}
            className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''}`}
          >
            <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_20px_60px_rgba(7,27,44,0.35)] ring-1 ring-sky-200/10">
              <img src={src || '/placeholder.svg'} alt={alt || `Parallax image ${index + 1}`} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-slate-950/15" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
