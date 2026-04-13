import { useEffect, useState } from 'react'

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
  const [animatedStats, setAnimatedStats] = useState<number[]>(stats.map(() => 0))

  useEffect(() => {
    const duration = 1400
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedStats(stats.map((stat) => Math.round(stat.target * eased)))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [stats])

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5e88a9]">MGK in numbers</p>
          <h2 className="text-4xl font-medium tracking-tight text-[#183f63] lg:text-5xl">{title}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#4d6f8e]">
            {description} <span className="font-medium text-[#234f77]">{intro}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
          <div>
            <p className="max-w-xl text-base leading-relaxed text-[#557693]">{intro}</p>
            <div className="mb-12 mt-12 grid grid-cols-2 gap-4 md:mb-0 md:gap-6">
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

          <div className="relative">
            <blockquote className="rounded-[1.75rem] border border-[#c7dff0] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(232,243,251,0.9))] p-6 shadow-[0_24px_70px_rgba(70,118,163,0.10)] backdrop-blur md:p-8">
              <p className="text-lg leading-relaxed text-[#355a79] md:text-xl">
                More than half a century of industrial know-how, export readiness and production reliability packed into measurable results.
              </p>

              <div className="mt-6 space-y-2">
                <cite className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#4f83ab] not-italic">MGK-pack d.d.</cite>
                <p className="text-sm text-[#6d8aa3]">Industrial packaging, lithography and dependable delivery across markets.</p>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
