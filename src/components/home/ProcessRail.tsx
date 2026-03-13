type ProcessRailProps = {
  title: string
  steps: Array<{ title: string; desc: string }>
}

const ProcessRail = ({ title, steps }: ProcessRailProps) => {
  return (
    <section className="w-full max-w-6xl px-4 pt-10 pb-12 md:px-6 md:pt-14">
      <h2 className="mb-5 text-2xl font-black tracking-tight text-slate-900 md:mb-6 md:text-3xl">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, idx) => (
          <article key={step.title} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="absolute -top-5 -right-4 text-8xl font-black text-slate-100">{idx + 1}</span>
            <h3 className="relative z-10 text-lg font-bold text-slate-900">{step.title}</h3>
            <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProcessRail
