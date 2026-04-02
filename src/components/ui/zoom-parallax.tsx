'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef } from 'react'

interface Image {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[]
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const visibleImages = useMemo(() => images.slice(0, 5), [images])

  const centerScale = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0.9, 1, 1.08, 1.16])
  const centerY = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [60, 0, -20, -60])
  const centerOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [0.35, 1, 1, 0.75])

  const leftTopY = useTransform(scrollYProgress, [0, 1], [-40, -140])
  const rightTopY = useTransform(scrollYProgress, [0, 1], [-20, -120])
  const leftBottomY = useTransform(scrollYProgress, [0, 1], [40, 140])
  const rightBottomY = useTransform(scrollYProgress, [0, 1], [30, 130])

  const sideScale = useTransform(scrollYProgress, [0, 0.6, 1], [0.92, 1, 1.05])
  const sideOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0.2, 0.72, 0.72, 0.45])
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.6])

  const [main, leftTop, rightTop, leftBottom, rightBottom] = visibleImages

  return (
    <div ref={containerRef} className="relative h-[320vh] md:h-[360vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: backdropOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),rgba(232,245,255,0.2)_38%,transparent_70%)]"
        />

        {leftTop && (
          <motion.div
            style={{ y: leftTopY, scale: sideScale, opacity: sideOpacity }}
            className="absolute left-[5vw] top-[12vh] z-10 h-[22vh] w-[24vw] min-w-[170px] overflow-hidden rounded-[1.5rem] border border-white/30 shadow-[0_20px_60px_rgba(7,27,44,0.18)]"
          >
            <img src={leftTop.src} alt={leftTop.alt || 'Parallax image 2'} className="h-full w-full object-cover" />
          </motion.div>
        )}

        {rightTop && (
          <motion.div
            style={{ y: rightTopY, scale: sideScale, opacity: sideOpacity }}
            className="absolute right-[5vw] top-[14vh] z-10 h-[22vh] w-[24vw] min-w-[170px] overflow-hidden rounded-[1.5rem] border border-white/30 shadow-[0_20px_60px_rgba(7,27,44,0.18)]"
          >
            <img src={rightTop.src} alt={rightTop.alt || 'Parallax image 3'} className="h-full w-full object-cover" />
          </motion.div>
        )}

        {leftBottom && (
          <motion.div
            style={{ y: leftBottomY, scale: sideScale, opacity: sideOpacity }}
            className="absolute bottom-[12vh] left-[8vw] z-10 h-[20vh] w-[20vw] min-w-[150px] overflow-hidden rounded-[1.5rem] border border-white/25 shadow-[0_20px_60px_rgba(7,27,44,0.16)]"
          >
            <img src={leftBottom.src} alt={leftBottom.alt || 'Parallax image 4'} className="h-full w-full object-cover" />
          </motion.div>
        )}

        {rightBottom && (
          <motion.div
            style={{ y: rightBottomY, scale: sideScale, opacity: sideOpacity }}
            className="absolute bottom-[10vh] right-[8vw] z-10 h-[20vh] w-[20vw] min-w-[150px] overflow-hidden rounded-[1.5rem] border border-white/25 shadow-[0_20px_60px_rgba(7,27,44,0.16)]"
          >
            <img src={rightBottom.src} alt={rightBottom.alt || 'Parallax image 5'} className="h-full w-full object-cover" />
          </motion.div>
        )}

        {main && (
          <motion.div
            style={{ scale: centerScale, y: centerY, opacity: centerOpacity }}
            className="absolute left-1/2 top-1/2 z-20 h-[58vh] w-[min(76vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/40 shadow-[0_30px_90px_rgba(7,27,44,0.28)]"
          >
            <img src={main.src} alt={main.alt || 'Parallax image 1'} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/12 via-transparent to-slate-950/16" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
