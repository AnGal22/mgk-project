import HoverFooter from './ui/hover-footer'

type ContactProps = {
  lang: 'hr' | 'en'
  info: {
    address: string
    phone: string
    location: string
    email: string
    email2: string
    email3: string
    certificates: string
  }
}

const Contact = ({ lang, info }: ContactProps) => {
  return <HoverFooter lang={lang} info={info} />
}

export default Contact
