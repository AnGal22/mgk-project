'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface Image {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  images: Image[]
}

const layoutClasses = [
  '[&>div]:!top-1/2 [&>div]:!left-1/2 [&>div]:!-translate-x-1/2 [&>div]:!-translate-y-1/2 [&>div]:!h-[38vh] [&>div]:!w-[42vw] md:[&>div]:!h-[48vh] md:[&>div]:!w-[34vw]',
  '[&>div]:!top-[18%] [&>div]:!left-[68%] [&>div]:!h-[22vh] [&>div]:!w-[24vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[26vw]',
  '[&>div]:!top-[16%] [&>div]:!left-[10%] [&>div]:!h-[24vh] [&>div]:!w-[22vw] md:[&>div]:!h-[34vh] md:[&>div]:!w-[18vw]',
  '[&>div]:!top-[58%] [&>div]:!left-[72%] [&>div]:!h-[20vh] [&>div]:!w-[20vw] md:[&>div]:!h-[24vh] md:[&>div]:!w-[20vw]',
  '[&>div]:!top-[60%] [&>div]:!left-[8%] [&>div]:!h-[20vh] [&>div]:!w-[18vw] md:[&>div]:!h-[24vh] md:[&>div]:!w-[16vw]',
  '[&>div]:!top-[72%] [&>div]:!left-[36%] [&>div]:!h-[16vh] [&>div]:!w-[16vw] md:[&>div]:!h-[20vh] md:[&>div]:!w-[14vw]',
  '[&>div]:!top-[28%] [&>div]:!left-[38%] [&>div]:!h-[14vh] [&>div]:!w-[14vw] md:[&>div]:!h-[18vh] md:[&>div]:!w-[12vw]',
]

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div ref={container} className="relative h-[250vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]
          const layout = layoutClasses[index % layoutClasses.length]

          return (
            <motion.div key={index} style={{ scale }} className={`absolute top-0 flex h-full w-full items-center justify-center ${layout}`}>
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900/40 shadow-2xl">
                <img src={src || '/placeholder.svg'} alt={alt || `Parallax image ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
