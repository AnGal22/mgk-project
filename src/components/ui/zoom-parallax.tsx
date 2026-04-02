'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const touchStartY = useRef<number | null>(null)
  const hasConsumedForward = useRef(false)
  const releaseScrollY = useRef<number | null>(null)
  const [activeLock, setActiveLock] = useState(false)

  const visibleImages = useMemo(() => images.slice(0, 5), [images])

  const mainScale = useTransform(progress, [0, 0.55, 1], [0.94, 1.04, 1.14])
  const mainY = useTransform(progress, [0, 0.55, 1], [42, 0, -28])
  const mainOpacity = useTransform(progress, [0, 0.08, 1], [0.35, 1, 1])

  const sideScale = useTransform(progress, [0, 1], [0.92, 1.03])
  const sideOpacity = useTransform(progress, [0, 0.1, 1], [0.12, 0.58, 0.42])
  const leftTopY = useTransform(progress, [0, 1], [-18, -72])
  const rightTopY = useTransform(progress, [0, 1], [-8, -64])
  const leftBottomY = useTransform(progress, [0, 1], [18, 74])
  const rightBottomY = useTransform(progress, [0, 1], [14, 68])
  const overlayOpacity = useTransform(progress, [0, 0.1, 1], [0.16, 0.8, 0.58])

  useEffect(() => {
    const updateLockState = () => {
      const el = sectionRef.current
      if (!el || activeLock || hasConsumedForward.current) return

      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const enteringFocusZone = rect.top <= viewportHeight * 0.14 && rect.bottom >= viewportHeight * 0.9

      if (enteringFocusZone) {
        setActiveLock(true)
        releaseScrollY.current = window.scrollY
      }
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
  }, [activeLock])

  useEffect(() => {
    if (!activeLock) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const releaseForward = () => {
      hasConsumedForward.current = true
      setActiveLock(false)
      document.body.style.overflow = ''
      const targetY = releaseScrollY.current ?? window.scrollY
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: targetY + window.innerHeight * 0.22, behavior: 'auto' })
      })
    }

    const applyDelta = (deltaY: number) => {
      if (deltaY <= 0) {
        return
      }

      const current = progress.get()
      const next = clamp(current + deltaY * 0.00042, 0, 1)
      progress.set(next)

      if (next >= 1) {
        releaseForward()
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return
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
      if (deltaY <= 0) return
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

  const [main, leftTop, rightTop, leftBottom, rightBottom] = visibleImages

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden">
      <motion.div style={{ opacity: overlayOpacity }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_62%)]" />

      {leftTop && (
        <motion.div
          style={{ y: leftTopY, scale: sideScale, opacity: sideOpacity }}
          className="absolute left-[4vw] top-[12vh] z-10 h-[22vh] w-[22vw] min-w-[160px] overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[0_20px_50px_rgba(7,27,44,0.18)]"
        >
          <img src={leftTop.src} alt={leftTop.alt || 'Parallax image 2'} className="h-full w-full object-cover" />
        </motion.div>
      )}

      {rightTop && (
        <motion.div
          style={{ y: rightTopY, scale: sideScale, opacity: sideOpacity }}
          className="absolute right-[4vw] top-[14vh] z-10 h-[22vh] w-[22vw] min-w-[160px] overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[0_20px_50px_rgba(7,27,44,0.18)]"
        >
          <img src={rightTop.src} alt={rightTop.alt || 'Parallax image 3'} className="h-full w-full object-cover" />
        </motion.div>
      )}

      {leftBottom && (
        <motion.div
          style={{ y: leftBottomY, scale: sideScale, opacity: sideOpacity }}
          className="absolute bottom-[11vh] left-[8vw] z-10 h-[19vh] w-[18vw] min-w-[140px] overflow-hidden rounded-[1.5rem] border border-white/18 shadow-[0_18px_42px_rgba(7,27,44,0.16)]"
        >
          <img src={leftBottom.src} alt={leftBottom.alt || 'Parallax image 4'} className="h-full w-full object-cover" />
        </motion.div>
      )}

      {rightBottom && (
        <motion.div
          style={{ y: rightBottomY, scale: sideScale, opacity: sideOpacity }}
          className="absolute bottom-[10vh] right-[8vw] z-10 h-[19vh] w-[18vw] min-w-[140px] overflow-hidden rounded-[1.5rem] border border-white/18 shadow-[0_18px_42px_rgba(7,27,44,0.16)]"
        >
          <img src={rightBottom.src} alt={rightBottom.alt || 'Parallax image 5'} className="h-full w-full object-cover" />
        </motion.div>
      )}

      {main && (
        <motion.div
          style={{ scale: mainScale, y: mainY, opacity: mainOpacity }}
          className="absolute left-1/2 top-1/2 z-20 h-[74vh] w-[min(92vw,1240px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/34 shadow-[0_32px_96px_rgba(7,27,44,0.26)]"
        >
          <img src={main.src} alt={main.alt || 'Parallax image 1'} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-slate-950/14" />
        </motion.div>
      )}
    </div>
  )
}
