'use client'

import { ZoomParallax } from '@/components/ui/zoom-parallax'
import { cn } from '@/lib/utils'

type ZoomParallaxDemoProps = {
  lang: 'hr' | 'en'
}

export default function ZoomParallaxDemo({ lang }: ZoomParallaxDemoProps) {
  const copy = {
    hr: {
      eyebrow: 'Vizualni test',
      title: 'Zoom parallax u MGK paleti',
      body: 'Ova verzija pokušava zaključati page scroll dok si u sekciji, ali i dalje interno trošiti wheel/touch input na animaciju prije nego te pusti dalje.',
    },
    en: {
      eyebrow: 'Visual test',
      title: 'Zoom parallax in MGK palette',
      body: 'This version tries to lock page scroll while the section is active, but still consume wheel/touch input as internal animation progress before releasing you forward.',
    },
  }[lang]

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Modern architecture building',
    },
    {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Urban cityscape at sunset',
    },
    {
      src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Abstract geometric pattern',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Mountain landscape',
    },
    {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Minimalist design elements',
    },
    {
      src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Ocean waves and beach',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Forest trees and sunlight',
    },
  ]

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,#edf6fd_0%,#d9ebf8_35%,#b7d5ea_100%)] text-slate-900">
      <div className="relative flex h-[46vh] items-center justify-center px-6 text-center md:h-[52vh]">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,rgba(80,144,190,0.16),transparent_52%)]',
            'blur-[30px]'
          )}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3f6f96]">{copy.eyebrow}</p>
          <h2 className="mt-3 text-center text-4xl font-bold text-[#13466b] md:text-5xl">{copy.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#356287] md:text-lg">{copy.body}</p>
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-[#b7d5ea] via-[#b7d5ea]/50 to-transparent" />
        <ZoomParallax images={images} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-[#e8f5ff] via-[#d9ebf8]/80 to-transparent" />
      </div>
      <div className="h-[8vh] bg-[linear-gradient(180deg,#e8f5ff_0%,rgba(232,245,255,0.96)_100%)]" />
    </section>
  )
}
