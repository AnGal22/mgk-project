'use client'

interface Image {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[]
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_60%)]" />
      {images.map(({ src, alt }, index) => {
        return (
          <div
            key={index}
            className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 0 ? '[&>div]:!left-[0.35vw] [&>div]:!h-[23.8vh] [&>div]:!w-[24.4vw]' : ''} ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[31vh] [&>div]:!left-[2vw] [&>div]:!h-[24vh] [&>div]:!w-[21vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''}`}
          >
            <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_20px_60px_rgba(7,27,44,0.35)] ring-1 ring-sky-200/10">
              <img src={src || '/placeholder.svg'} alt={alt || `Parallax image ${index + 1}`} className={`h-full w-full ${index === 4 ? 'object-contain bg-white/10 p-2' : 'object-cover'}`} />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-slate-950/15" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
