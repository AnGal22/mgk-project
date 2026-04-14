"use client"

import { Mail, Phone, MapPin, ArrowUpRight, Globe } from 'lucide-react'

type ContactInfo = {
  address: string
  phone: string
  location: string
  email: string
  email2: string
  email3: string
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
        background: 'radial-gradient(140% 140% at 50% 0%, rgba(245,250,255,0.96) 0%, rgba(223,238,250,0.96) 42%, rgba(187,217,239,0.92) 100%)',
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
        ...(info.email2 ? [{ icon: Mail, label: 'E-mail 2', text: info.email2, href: `mailto:${info.email2}` }] : []),
        ...(info.email3 ? [{ icon: Mail, label: 'E-mail 3', text: info.email3, href: `mailto:${info.email3}` }] : []),
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
        ...(info.email2 ? [{ icon: Mail, label: 'E-mail 2', text: info.email2, href: `mailto:${info.email2}` }] : []),
        ...(info.email3 ? [{ icon: Mail, label: 'E-mail 3', text: info.email3, href: `mailto:${info.email3}` }] : []),
      ],
      copyright: 'All rights reserved.',
    },
  }[lang]

  return (
    <footer
      id="contact"
      className="relative mt-0 w-full overflow-hidden border-t border-[#c7dff0] bg-[#eaf4fb] text-slate-700 shadow-[0_-8px_30px_rgba(74,126,171,0.08)]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ca2fa]/15 ring-1 ring-inset ring-[#3ca2fa]/40">
                <ArrowUpRight className="h-5 w-5 text-[#79c7ff]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#4d82aa]">Industrial packaging</p>
                <span className="text-lg font-black tracking-tight text-[#163f63] md:text-xl">MGK-PACK</span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-[#466b8c]">{copy.brandText}</p>

            <a
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#3ca2fa] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#3ca2fa]/20 transition hover:bg-[#2c92ec] sm:w-auto sm:min-w-52"
            >
              {copy.buttonLabel}
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-[#163f63] md:text-lg">{copy.contactTitle}</h4>
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <ul className="grid gap-3 sm:grid-cols-2">
                {copy.contactItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <li key={`${item.text}-${index}`} className="rounded-xl border border-[#c9dceb] bg-white/70 p-3 text-sm text-[#355a79] shadow-sm">
                      <div className="flex items-start gap-3">
                        <Icon size={18} className="mt-0.5 shrink-0 text-[#3ca2fa]" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#6f8da8]">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="break-words transition-colors hover:text-[#2f8fe5]">
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
              <div className="rounded-xl border border-[#c9dceb] bg-white/70 p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6f8da8]">{lang === 'hr' ? 'Certifikat' : 'Certificate'}</p>
                <img
                  src="/ISO 9001 certification logo close-up.webp"
                  alt="ISO 9001 certification"
                  className="mt-3 h-24 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-[#c9dceb] pt-4">
          <p className="text-center text-xs text-[#6b86a0] md:text-left md:text-sm">
            &copy; {new Date().getFullYear()} MGK-PACK. {copy.copyright}
          </p>
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}

export default HoverFooter
