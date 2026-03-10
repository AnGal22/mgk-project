export type LangText = {
  hr: string
  en: string
}

export type ProductCategory = {
  name: LangText
  short_description?: LangText
  description: LangText
  category?: string
  material?: string
  images: Array<{
    url: string
    alt: LangText
  }>
  schema_image?: {
    url: string
    alt: LangText
  }
  icon: {
    url: string
    alt: LangText
  }
  specs: Record<string, Array<string | number> | string | number>
}

export type ProductsData = Record<string, ProductCategory>
