import { useEffect, useRef, useState } from 'react'

type StatItem = {
  target: number
  suffix?: string
  label: string
}

type StatsDefaultProps = {
  title: string
  description: string
  intro: string
  stats: StatItem[]
}

export default function StatsDefault({ title, description, intro, stats }: StatsDefaultProps) {
  const statsGridRef = useRef<HTMLDivElement | null>(null)
  const hasCompletedRef = useRef(false)
  const [animatedStats, setAnimatedStats] = useState<number[]>(stats.map(() => 0))
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    setAnimatedStats(stats.map(() => 0))
    setHasStarted(false)
    hasCompletedRef.current = false
  }, [stats])

  useEffect(() => {
    if (!statsGridRef.current || hasStarted || hasCompletedRef.current) return

    const gridEl = statsGridRef.current
    const startIfVisible = () => {
      const rect = gridEl.getBoundingClientRect()
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      const visibilityRatio = visibleHeight / Math.max(rect.height, 1)

      if (visibleHeight > 0 && visibilityRatio >= 0.2) {
        setHasStarted(true)
        return true
      }

      return false
    }

    if (startIfVisible()) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setHasStarted(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: [0, 0.2, 0.4],
      }
    )

    const handleVisibilityCheck = () => {
      if (startIfVisible()) {
        observer.disconnect()
        window.removeEventListener('scroll', handleVisibilityCheck)
        window.removeEventListener('resize', handleVisibilityCheck)
      }
    }

    observer.observe(gridEl)
    window.addEventListener('scroll', handleVisibilityCheck, { passive: true })
    window.addEventListener('resize', handleVisibilityCheck)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleVisibilityCheck)
      window.removeEventListener('resize', handleVisibilityCheck)
    }
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 1400
    const start = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedStats(stats.map((stat) => Math.round(stat.target * eased)))

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        hasCompletedRef.current = true
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [hasStarted, stats])

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/rijeka-counter-bg.webp')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,250,255,0.54)_0%,rgba(227,241,250,0.34)_42%,rgba(212,232,245,0.5)_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-transparent bg-white/15 shadow-[0_28px_70px_rgba(38,79,115,0.16)] backdrop-blur-[1px]">
          <div className="space-y-8 px-6 py-8 md:space-y-12 md:px-10 md:py-12">
            <div className="max-w-3xl space-y-5">
              <h2 className="text-4xl font-medium tracking-tight text-[#183f63] lg:text-5xl">{title}</h2>
              <p className="max-w-2xl text-base leading-relaxed text-[#335f84]">
                {description} <span className="font-medium text-[#1d4b73]">{intro}</span>
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
              <div>
                <div ref={statsGridRef} className="grid grid-cols-2 gap-4 md:gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="space-y-3 rounded-2xl border border-white/35 bg-white/34 p-5 shadow-[0_18px_40px_rgba(44,86,124,0.12)] backdrop-blur-[3px]">
                      <div className="bg-linear-to-r from-[#173f63] via-[#4c84ac] to-[#8ebbd8] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                        {animatedStats[index] ?? 0}
                        {stat.suffix ?? ''}
                      </div>
                      <p className="text-sm font-medium text-[#355f83] md:text-base">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
