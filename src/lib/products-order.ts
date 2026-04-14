import type { ProductCategory, ProductsData } from '../types/products'

export function normalizeProductOrders(products: ProductsData): ProductsData {
  const sorted = Object.entries(products).sort((a, b) => {
    const orderA = typeof a[1]?.order === 'number' ? a[1].order : Number.MAX_SAFE_INTEGER
    const orderB = typeof b[1]?.order === 'number' ? b[1].order : Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    return a[0].localeCompare(b[0])
  })

  return Object.fromEntries(
    sorted.map(([key, product], index) => [
      key,
      {
        ...product,
        order: index,
      },
    ])
  )
}

export function sortProductEntries(products: ProductsData): Array<[string, ProductCategory]> {
  return Object.entries(products).sort((a, b) => {
    const orderA = typeof a[1]?.order === 'number' ? a[1].order : Number.MAX_SAFE_INTEGER
    const orderB = typeof b[1]?.order === 'number' ? b[1].order : Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    return a[0].localeCompare(b[0])
  })
}
