"use client"

import { Mail, Phone, MapPin, ArrowUpRight, Globe, BadgeCheck } from 'lucide-react'

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

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: 'radial-gradient(125% 125% at 50% 10%, rgba(7,11,18,0.92) 48%, rgba(60,162,250,0.22) 100%)',
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
      className="relative mt-10 w-full overflow-hidden border-y border-white/10 bg-[#0F1720]/88 text-slate-200 shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ca2fa]/15 ring-1 ring-inset ring-[#3ca2fa]/40">
                <ArrowUpRight className="h-5 w-5 text-[#79c7ff]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79c7ff]">Industrial packaging</p>
                <span className="text-lg font-black tracking-tight text-white md:text-xl">MGK-PACK</span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300">{copy.brandText}</p>

            <a
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#3ca2fa] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#3ca2fa]/20 transition hover:bg-[#2c92ec] sm:w-auto sm:min-w-52"
            >
              {copy.buttonLabel}
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white md:text-lg">{copy.contactTitle}</h4>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {copy.contactItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={`${item.text}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <Icon size={18} className="mt-0.5 shrink-0 text-[#3ca2fa]" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
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

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-center text-xs text-slate-400 md:text-left md:text-sm">
            &copy; {new Date().getFullYear()} MGK-PACK. {copy.copyright}
          </p>
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}

export default HoverFooter
