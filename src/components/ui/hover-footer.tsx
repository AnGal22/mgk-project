"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, ArrowUpRight, Globe, BadgeCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

type ContactInfo = {
  address: string
  phone: string
  location: string
  email: string
  certificates: string
}

type HoverFooterProps = {
  lang: 'hr' | 'en'
  info: ContactInfo
}

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string
  duration?: number
  automatic?: boolean
  className?: string
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })

  useEffect(() => {
    if (!svgRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
    const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100

    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    })
  }, [cursor])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn('cursor-pointer select-none uppercase', className)}
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#79c7ff" />
              <stop offset="35%" stopColor="#3ca2fa" />
              <stop offset="65%" stopColor="#0f6ddf" />
              <stop offset="100%" stopColor="#bfe3ff" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-white/20 font-[helvetica] text-6xl font-bold"
        style={{ opacity: hovered ? 0.65 : 0 }}
      >
        {text}
      </text>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#3ca2fa] font-[helvetica] text-6xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-6xl font-bold"
      >
        {text}
      </text>
    </svg>
  )
}

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: 'radial-gradient(125% 125% at 50% 10%, rgba(7,11,18,0.92) 48%, rgba(60,162,250,0.28) 100%)',
      }}
    />
  )
}

const HoverFooter = ({ lang, info }: HoverFooterProps) => {
  const copy = {
    hr: {
      brandText: 'Kontakt informacije i direktan upit.',
      contactTitle: 'Kontakt podaci',
      buttonLabel: 'Pošalji upit',
      contactItems: [
        { icon: MapPin, label: 'Adresa', text: info.address },
        { icon: Phone, label: 'Mobitel', text: info.phone, href: `tel:${info.phone.replace(/\s+/g, '')}` },
        { icon: Globe, label: 'Lokacija', text: info.location },
        { icon: Mail, label: 'E-mail', text: info.email, href: `mailto:${info.email}` },
        { icon: BadgeCheck, label: 'Certifikati', text: info.certificates },
      ],
      copyright: 'Sva prava pridržana.',
    },
    en: {
      brandText: 'Contact details and a direct inquiry CTA.',
      contactTitle: 'Contact details',
      buttonLabel: 'Send inquiry',
      contactItems: [
        { icon: MapPin, label: 'Address', text: info.address },
        { icon: Phone, label: 'Mobile', text: info.phone, href: `tel:${info.phone.replace(/\s+/g, '')}` },
        { icon: Globe, label: 'Location', text: info.location },
        { icon: Mail, label: 'E-mail', text: info.email, href: `mailto:${info.email}` },
        { icon: BadgeCheck, label: 'Certificates', text: info.certificates },
      ],
      copyright: 'All rights reserved.',
    },
  }[lang]

  return (
    <footer
      id="contact"
      className="relative mx-4 mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F1720]/80 text-slate-200 shadow-[0_30px_120px_rgba(0,0,0,0.35)] md:mx-8"
    >
      <div className="relative z-10 mx-auto max-w-6xl p-8 md:p-12 lg:p-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div className="flex flex-col space-y-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3ca2fa]/15 ring-1 ring-inset ring-[#3ca2fa]/40">
                <ArrowUpRight className="h-5 w-5 text-[#79c7ff]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#79c7ff]">Industrial packaging</p>
                <span className="text-xl font-black tracking-tight text-white md:text-2xl">MGK-PACK</span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300">{copy.brandText}</p>

            <a
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#3ca2fa] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#3ca2fa]/25 transition hover:bg-[#2c92ec] md:w-auto md:min-w-56"
            >
              {copy.buttonLabel}
            </a>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">{copy.contactTitle}</h4>
            <ul className="grid gap-4 md:grid-cols-2">
              {copy.contactItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={`${item.text}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <Icon size={18} className="mt-0.5 shrink-0 text-[#3ca2fa]" />
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="break-words transition-colors hover:text-[#79c7ff]">
                            {item.text}
                          </a>
                        ) : (
                          <span className="break-words">{item.text}</span>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-t border-white/10" />

        <p className="text-center text-sm text-slate-400 md:text-left">
          &copy; {new Date().getFullYear()} MGK-PACK. {copy.copyright}
        </p>
      </div>

      <div className="hidden h-[18rem] -mt-20 -mb-14 lg:flex">
        <TextHoverEffect text="MGK-PACK" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}

export default HoverFooter
