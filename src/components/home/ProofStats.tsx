import { useEffect, useRef, useState } from 'react'

type Stat = { target: number; suffix?: string; label: string }

type ProofStatsProps = {
  title: string
  stats: Stat[]
}

const ProofStats = ({ title, stats }: ProofStatsProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState(false)
  const [values, setValues] = useState<number[]>(stats.map(() => 0))

  useEffect(() => {
    if (!rootRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return

    const duration = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValues(stats.map((s) => Math.round(s.target * eased)))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, stats])

  return (
    <section ref={rootRef} className="relative z-20 -mt-20 w-full max-w-6xl px-4 md:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(2,6,23,0.18)] md:p-8">
        <h2 className="mb-5 text-xl font-black tracking-tight text-slate-900 md:text-2xl">{title}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat, i) => (
            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-3xl font-black text-sky-700 md:text-4xl">
                {values[i] ?? 0}
                {stat.suffix ?? ''}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wide text-slate-600 uppercase md:text-sm md:normal-case md:tracking-normal">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProofStats
