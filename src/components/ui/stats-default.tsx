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
  const [animatedStats, setAnimatedStats] = useState<number[]>(stats.map(() => 0))
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    setAnimatedStats(stats.map(() => 0))
    setHasStarted(false)
  }, [stats])

  useEffect(() => {
    if (!statsGridRef.current || hasStarted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.4,
      }
    )

    observer.observe(statsGridRef.current)

    return () => observer.disconnect()
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
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [hasStarted, stats])

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-3xl space-y-5">
          <h2 className="text-4xl font-medium tracking-tight text-[#183f63] lg:text-5xl">{title}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#4d6f8e]">
            {description} <span className="font-medium text-[#234f77]">{intro}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
          <div>
            <div ref={statsGridRef} className="mb-12 mt-12 grid grid-cols-2 gap-4 md:mb-0 md:gap-6">
              {stats.map((stat, index) => (
                <div key={stat.label} className="space-y-3 rounded-2xl border border-white/35 bg-white/52 p-5 shadow-[0_18px_40px_rgba(44,86,124,0.08)] backdrop-blur-sm">
                  <div className="bg-linear-to-r from-[#173f63] via-[#4c84ac] to-[#8ebbd8] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                    {animatedStats[index] ?? 0}
                    {stat.suffix ?? ''}
                  </div>
                  <p className="text-sm font-medium text-[#486887] md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
