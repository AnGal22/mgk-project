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

type FrameConfig = {
  className: string
  scaleFrom: number
  scaleTo: number
  yFrom: number
  yTo: number
  opacityFrom?: number
  opacityTo?: number
  zIndex: number
}

const frameConfigs: FrameConfig[] = [
  {
    className: 'left-1/2 top-1/2 h-[56vh] w-[min(72vw,920px)] -translate-x-1/2 -translate-y-1/2 md:h-[62vh] rounded-[2rem]',
    scaleFrom: 1,
    scaleTo: 1.22,
    yFrom: 18,
    yTo: -26,
    opacityFrom: 1,
    opacityTo: 1,
    zIndex: 30,
  },
  {
    className: 'left-[8vw] top-[14vh] h-[22vh] w-[22vw] min-w-[170px] rounded-[1.5rem]',
    scaleFrom: 1.1,
    scaleTo: 1.32,
    yFrom: -28,
    yTo: -72,
    opacityFrom: 0.72,
    opacityTo: 0.45,
    zIndex: 10,
  },
  {
    className: 'right-[10vw] top-[16vh] h-[24vh] w-[24vw] min-w-[180px] rounded-[1.5rem]',
    scaleFrom: 1.08,
    scaleTo: 1.28,
    yFrom: -20,
    yTo: -64,
    opacityFrom: 0.72,
    opacityTo: 0.42,
    zIndex: 11,
  },
  {
    className: 'left-[6vw] bottom-[14vh] h-[20vh] w-[20vw] min-w-[160px] rounded-[1.5rem]',
    scaleFrom: 1.04,
    scaleTo: 1.18,
    yFrom: 36,
    yTo: 84,
    opacityFrom: 0.64,
    opacityTo: 0.34,
    zIndex: 9,
  },
  {
    className: 'right-[7vw] bottom-[12vh] h-[20vh] w-[22vw] min-w-[170px] rounded-[1.5rem]',
    scaleFrom: 1.05,
    scaleTo: 1.2,
    yFrom: 28,
    yTo: 80,
    opacityFrom: 0.62,
    opacityTo: 0.32,
    zIndex: 9,
  },
]

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const visibleImages = useMemo(() => images.slice(0, frameConfigs.length), [images])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.08, 0.88, 1], [0.55, 1, 1, 0.72])
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div ref={container} className="relative h-[240vh] md:h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity: sceneOpacity, scale: backdropScale }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_62%)]" />

        {visibleImages.map(({ src, alt }, index) => {
          const config = frameConfigs[index]
          const scale = useTransform(scrollYProgress, [0, 0.45, 1], [config.scaleFrom, (config.scaleFrom + config.scaleTo) / 2, config.scaleTo])
          const y = useTransform(scrollYProgress, [0, 0.45, 1], [config.yFrom, 0, config.yTo])
          const opacity = useTransform(
            scrollYProgress,
            [0, 0.15, 0.8, 1],
            [config.opacityFrom ?? 1, 1, config.opacityTo ?? 1, Math.max((config.opacityTo ?? 1) - 0.1, 0.2)]
          )

          return (
            <motion.div
              key={index}
              style={{ scale, y, opacity, zIndex: config.zIndex }}
              className={`absolute overflow-hidden border border-white/25 shadow-[0_20px_60px_rgba(7,27,44,0.28)] ring-1 ring-sky-200/10 ${config.className}`}
            >
              <img src={src || '/placeholder.svg'} alt={alt || `Parallax image ${index + 1}`} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-slate-950/18" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
