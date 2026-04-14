import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { fetchProducts, fetchSiteInfo, getCmsSession, loginCms, logoutCms, saveProducts, saveSiteInfo, uploadCmsImage } from '../lib/api'
import { normalizeProductOrders, sortProductEntries } from '../lib/products-order'
import AppLoadingScreen from './ui/AppLoadingScreen'
import type { SiteInfo } from '../lib/api'
import type { ProductCategory, ProductsData } from '../types/products'

const createEmptyProduct = (): ProductCategory => ({
  order: 0,
  name: { hr: '', en: '' },
  short_description: { hr: '', en: '' },
  description: { hr: '', en: '' },
  category: '',
  material: '',
  images: [
    { url: '', alt: { hr: '', en: '' } },
    { url: '', alt: { hr: '', en: '' } },
  ],
  icon: { url: '', alt: { hr: '', en: '' } },
  schema_image: { url: '', alt: { hr: '', en: '' } },
  specs: {},
})

const defaultSiteInfo: SiteInfo = {
  title_desc: { hr: '', en: '' },
  description: { hr: '', en: '' },
  contact: {
    address: '',
    phone: '',
    location: '',
    email: '',
    certificates: '',
  },
}

const CmsPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<ProductsData>({})
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(defaultSiteInfo)
  const [selectedKey, setSelectedKey] = useState('')
  const [newKey, setNewKey] = useState('')
  const [status, setStatus] = useState('')
  const [infoStatus, setInfoStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const backgroundInputRef = useRef<HTMLInputElement | null>(null)
  const iconInputRef = useRef<HTMLInputElement | null>(null)
  const schemaInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getCmsSession().catch(() => ({ authenticated: false }))
        if (!session.authenticated) {
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        const [data, info] = await Promise.all([fetchProducts(), fetchSiteInfo()])
        const normalizedProducts = normalizeProductOrders(data)
        const firstKey = sortProductEntries(normalizedProducts)[0]?.[0] || ''
        setProducts(normalizedProducts)
        setSiteInfo(info)
        setSelectedKey(firstKey)
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Greška pri učitavanju CMS-a')
      } finally {
        setIsLoading(false)
      }
    }

    void initialize()
  }, [])

  const onLogin = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('')

    try {
      await loginCms({ username, password })
      const [data, info] = await Promise.all([fetchProducts(), fetchSiteInfo()])
      const normalizedProducts = normalizeProductOrders(data)
      const firstKey = sortProductEntries(normalizedProducts)[0]?.[0] || ''
      setProducts(normalizedProducts)
      setSiteInfo(info)
      setSelectedKey(firstKey)
      setIsAuthenticated(true)
      setPassword('')
      setStatus('Uspješno prijavljen.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Neuspješan login')
    }
  }

  const selectedProduct = useMemo(() => {
    if (!selectedKey) return null
    return products[selectedKey] || null
  }, [products, selectedKey])

  const validateProducts = (data: ProductsData) => {
    const errors: string[] = []

    for (const [key, product] of Object.entries(data)) {
      if (!product.name?.hr?.trim()) errors.push(`${key}: nedostaje Ime (HR)`)
      if (!product.name?.en?.trim()) errors.push(`${key}: nedostaje Ime (EN)`)
      if (!product.short_description?.hr?.trim()) errors.push(`${key}: nedostaje Kratki opis (HR)`)
      if (!product.short_description?.en?.trim()) errors.push(`${key}: nedostaje Kratki opis (EN)`)
      if (!product.description?.hr?.trim()) errors.push(`${key}: nedostaje Opis (HR)`)
      if (!product.description?.en?.trim()) errors.push(`${key}: nedostaje Opis (EN)`)
      if (!product.images?.[1]?.url?.trim()) errors.push(`${key}: nedostaje URL background slike`)
      if (!product.icon?.url?.trim()) errors.push(`${key}: nedostaje URL ikone`)
    }

    return errors
  }

  const updateSelected = (updater: (current: ProductCategory) => ProductCategory) => {
    if (!selectedKey || !selectedProduct) return
    setProducts((current) => ({
      ...current,
      [selectedKey]: updater(current[selectedKey]),
    }))
  }

  const onTextChange = (field: 'name' | 'short_description' | 'description', lang: 'hr' | 'en', value: string) => {
    updateSelected((product) => {
      if (field === 'short_description') {
        const currentShort = product.short_description ?? { hr: '', en: '' }
        return {
          ...product,
          short_description: {
            ...currentShort,
            [lang]: value,
          },
        }
      }

      return {
        ...product,
        [field]: {
          ...product[field],
          [lang]: value,
        },
      }
    })
  }

  const onImageUrlChange = (value: string, imageIndex: number) => {
    updateSelected((product) => {
      const images = [...product.images]
      if (!images[imageIndex]) {
        images[imageIndex] = { url: '', alt: { hr: '', en: '' } }
      }
      images[imageIndex] = {
        ...images[imageIndex],
        url: value,
      }
      return { ...product, images }
    })
  }

  const onIconUrlChange = (value: string) => {
    updateSelected((product) => ({
      ...product,
      icon: {
        ...product.icon,
        url: value,
      },
    }))
  }

  const onSchemaUrlChange = (value: string) => {
    updateSelected((product) => ({
      ...product,
      schema_image: {
        ...(product.schema_image ?? { url: '', alt: { hr: '', en: '' } }),
        url: value,
      },
    }))
  }

  const onSpecsColumnChange = (columnKey: string, value: string) => {
    updateSelected((product) => ({
      ...product,
      specs: {
        ...product.specs,
        [columnKey]: value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      },
    }))
  }

  const onAddSpecsColumn = () => {
    const columnKey = window.prompt('Upiši key stupca specifikacije (npr. height_mm)')?.trim()
    if (!columnKey) return

    updateSelected((product) => ({
      ...product,
      specs: {
        ...product.specs,
        [columnKey]: product.specs[columnKey] ?? [],
      },
    }))
  }

  const onRemoveSpecsColumn = (columnKey: string) => {
    updateSelected((product) => {
      const nextSpecs = { ...product.specs }
      delete nextSpecs[columnKey]
      return {
        ...product,
        specs: nextSpecs,
      }
    })
  }

  const onAddProduct = () => {
    const cleanKey = newKey.trim().toLowerCase().replace(/\s+/g, '_')
    if (!cleanKey) {
      setStatus('Upiši key za novi proizvod (npr. konzerva_5).')
      return
    }

    if (products[cleanKey]) {
      setStatus('Taj key već postoji. Odaberi drugi naziv.')
      return
    }

    setProducts((current) => normalizeProductOrders({
      ...current,
      [cleanKey]: {
        ...createEmptyProduct(),
        order: Object.keys(current).length,
      },
    }))
    setSelectedKey(cleanKey)
    setNewKey('')
    setStatus(`Dodan novi proizvod: ${cleanKey}`)
  }

  const onRemoveProduct = () => {
    if (!selectedKey) return
    if (!confirm(`Obrisati proizvod "${selectedKey}"?`)) return

    setProducts((current) => {
      const next = { ...current }
      delete next[selectedKey]
      const normalized = normalizeProductOrders(next)
      const nextFirst = sortProductEntries(normalized)[0]?.[0] || ''
      setSelectedKey(nextFirst)
      return normalized
    })
    setStatus(`Obrisan proizvod: ${selectedKey}`)
  }

  const onMoveProduct = async (direction: 'up' | 'down', keyToMove: string) => {
    const entries = sortProductEntries(products)
    const index = entries.findIndex(([key]) => key === keyToMove)
    if (index === -1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= entries.length) return

    const reordered = [...entries]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    const nextProducts = Object.fromEntries(
      reordered.map(([key, product], nextIndex) => [
        key,
        {
          ...product,
          order: nextIndex,
        },
      ])
    ) as ProductsData

    setProducts(nextProducts)
    setStatus('Spremam novi redoslijed proizvoda...')

    try {
      await saveProducts(nextProducts)
      setStatus(direction === 'up' ? `Redoslijed spremljen: ${keyToMove} pomaknut gore ✅` : `Redoslijed spremljen: ${keyToMove} pomaknut dolje ✅`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Greška pri spremanju redoslijeda proizvoda')
    }
  }

  const handleFileUpload = async (file: File, target: 'background' | 'icon' | 'schema') => {
    setIsUploading(true)
    const targetLabel = target === 'background' ? 'background sliku' : target === 'icon' ? 'ikonu' : 'schema sliku'
    setStatus(`Uploadam ${targetLabel}: ${file.name}`)

    try {
      const { url } = await uploadCmsImage(file)
      if (target === 'background') {
        onImageUrlChange(url, 1)
        setStatus('Background slika uploadana ✅')
      } else if (target === 'icon') {
        onIconUrlChange(url)
        setStatus('Ikona uploadana ✅')
      } else {
        onSchemaUrlChange(url)
        setStatus('Schema slika uploadana ✅')
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Greška pri uploadu slike')
    } finally {
      setIsUploading(false)
    }
  }

  const onDropImage = async (event: DragEvent<HTMLDivElement>, target: 'background' | 'icon' | 'schema') => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    await handleFileUpload(file, target)
  }

  const onPickImage = async (event: ChangeEvent<HTMLInputElement>, target: 'background' | 'icon' | 'schema') => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    await handleFileUpload(file, target)
    input.value = ''
  }

  const updateContactField = (field: keyof SiteInfo['contact'], value: string) => {
    setSiteInfo((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }))
  }

  const onSave = async () => {
    const errors = validateProducts(products)
    if (errors.length > 0) {
      setStatus(`Ne mogu spremiti. Popuni obavezna polja:\n- ${errors.slice(0, 5).join('\n- ')}${errors.length > 5 ? '\n- ...' : ''}`)
      return
    }

    setStatus('Spremam proizvode...')
    try {
      await saveProducts(products)
      setStatus('Proizvodi spremljeni ✅')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Greška pri spremanju proizvoda')
    }
  }

  const onSaveSiteInfo = async () => {
    setInfoStatus('Spremam kontakt informacije...')
    try {
      await saveSiteInfo(siteInfo)
      setInfoStatus('Kontakt informacije spremljene ✅')
    } catch (error) {
      setInfoStatus(error instanceof Error ? error.message : 'Greška pri spremanju kontakt informacija')
    }
  }

  const onLogout = async () => {
    await logoutCms().catch(() => undefined)
    setIsAuthenticated(false)
    setStatus('Odjavljen.')
  }

  if (isLoading) return <AppLoadingScreen label="Učitavanje CMS-a..." />

  if (!isAuthenticated) {
    return (
      <main className="mx-auto mt-24 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">MGK CMS Login</h1>
        <form onSubmit={onLogin} className="space-y-3">
          <input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <input type="password" className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700" type="submit">Login</button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{status}</p>}
      </main>
    )
  }

  const productEntries = sortProductEntries(products)

  return (
    <main className="mx-auto mt-6 w-full max-w-7xl overflow-x-hidden p-3 sm:p-4">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">MGK CMS</h1>
            <p className="text-sm text-slate-600">Jednostavno uređivanje proizvoda, ikona i kontakt informacija</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700" onClick={onSave}>Spremi proizvode</button>
            <button className="rounded-lg border border-slate-300 bg-white px-3 py-2" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-3rem)] lg:overflow-auto">
          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500">PROIZVODI</p>
          <div className="mb-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <input className="min-w-0 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Novi key (npr. konzerva_5)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <button className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={onAddProduct}>+ Dodaj proizvod</button>
          </div>
          <div className="space-y-2">
            {productEntries.map(([key, product], index) => (
              <div key={key} className={`w-full rounded-xl border p-3 transition ${selectedKey === key ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                <div className="flex items-start gap-2">
                  <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedKey(key)}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Konzerva {index + 1}</p>
                    <p className="font-medium text-slate-800">{product.name.hr || key}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{key}</p>
                  </button>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => onMoveProduct('up', key)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => onMoveProduct('down', key)}
                      disabled={index === productEntries.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            {!selectedProduct ? (
              <p className="text-slate-500">Odaberi proizvod s lijeve strane.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Uređivanje proizvoda</p>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedProduct.name.hr || selectedKey}</h2>
                  </div>
                  <button className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={onRemoveProduct}>Obriši proizvod</button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="mb-1 block font-medium">Ime (HR) *</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.name.hr} onChange={(e) => onTextChange('name', 'hr', e.target.value)} /></label>
                  <label className="text-sm"><span className="mb-1 block font-medium">Ime (EN) *</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.name.en} onChange={(e) => onTextChange('name', 'en', e.target.value)} /></label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="mb-1 block font-medium">Kratki opis (HR) *</span><textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.short_description?.hr ?? ''} onChange={(e) => onTextChange('short_description', 'hr', e.target.value)} /></label>
                  <label className="text-sm"><span className="mb-1 block font-medium">Kratki opis (EN) *</span><textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.short_description?.en ?? ''} onChange={(e) => onTextChange('short_description', 'en', e.target.value)} /></label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="mb-1 block font-medium">Opis (HR) *</span><textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.description.hr} onChange={(e) => onTextChange('description', 'hr', e.target.value)} /></label>
                  <label className="text-sm"><span className="mb-1 block font-medium">Opis (EN) *</span><textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.description.en} onChange={(e) => onTextChange('description', 'en', e.target.value)} /></label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-dashed border-slate-300 p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => void onDropImage(e, 'background')}>
                    <p className="font-medium">Background slika sectiona *</p>
                    <p className="text-sm text-slate-500">Drag & drop za glavnu pozadinsku sliku proizvoda.</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input ref={backgroundInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onPickImage(e, 'background')} />
                      <button type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => backgroundInputRef.current?.click()}>
                        Odaberi background sliku
                      </button>
                      {isUploading && <span className="text-sm text-blue-600">Upload u tijeku...</span>}
                    </div>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium">URL background slike (images[1])</span>
                      <input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.images?.[1]?.url ?? ''} onChange={(e) => onImageUrlChange(e.target.value, 1)} />
                    </label>
                    {selectedProduct.images?.[1]?.url && (
                      <img src={selectedProduct.images[1].url} alt="background preview" className="mt-3 max-h-40 w-full rounded-lg border border-slate-200 object-cover" />
                    )}
                  </div>

                  <div className="rounded-lg border border-dashed border-slate-300 p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => void onDropImage(e, 'icon')}>
                    <p className="font-medium">Ikona item bara *</p>
                    <p className="text-sm text-slate-500">Ova ikona se prikazuje u bočnom / mobilnom item baru.</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onPickImage(e, 'icon')} />
                      <button type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => iconInputRef.current?.click()}>
                        Odaberi ikonu
                      </button>
                    </div>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium">URL ikone</span>
                      <input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.icon?.url ?? ''} onChange={(e) => onIconUrlChange(e.target.value)} />
                    </label>
                    {selectedProduct.icon?.url && <img src={selectedProduct.icon.url} alt="icon preview" className="mt-3 h-16 w-16 rounded-lg border border-slate-200 object-contain" />}
                  </div>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Slika limenke (opcionalno, images[0])</span>
                  <input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.images?.[0]?.url ?? ''} onChange={(e) => onImageUrlChange(e.target.value, 0)} />
                </label>

                <div className="rounded-lg border border-dashed border-slate-300 p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => void onDropImage(e, 'schema')}>
                  <p className="font-medium">Schema / specifikacijska slika</p>
                  <p className="text-sm text-slate-500">Slika koja se prikazuje unutar specification panela.</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input ref={schemaInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onPickImage(e, 'schema')} />
                    <button type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => schemaInputRef.current?.click()}>
                      Odaberi schema sliku
                    </button>
                  </div>
                  <label className="mt-3 block text-sm">
                    <span className="mb-1 block font-medium">URL schema slike</span>
                    <input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.schema_image?.url ?? ''} onChange={(e) => onSchemaUrlChange(e.target.value)} />
                  </label>
                  {selectedProduct.schema_image?.url && <img src={selectedProduct.schema_image.url} alt="schema preview" className="mt-3 max-h-48 rounded-lg border border-slate-200" />}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Specifikacijska tablica</h3>
                      <p className="text-sm text-slate-500">Svaki red u textboxu predstavlja jedan red tablice za taj stupac.</p>
                    </div>
                    <button type="button" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" onClick={onAddSpecsColumn}>
                      + Dodaj stupac
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(selectedProduct.specs ?? {}).map(([columnKey, value]) => (
                      <div key={columnKey} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">{columnKey}</p>
                          <button type="button" className="text-xs font-medium text-red-600 hover:text-red-700" onClick={() => onRemoveSpecsColumn(columnKey)}>
                            Obriši
                          </button>
                        </div>
                        <textarea
                          className="min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          value={Array.isArray(value) ? value.map((item) => String(item)).join('\n') : String(value ?? '')}
                          onChange={(e) => onSpecsColumnChange(columnKey, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Site info / O nama</h2>
                <p className="mt-1 text-sm text-slate-500">Hero “O nama” sadržaj i kontakt podaci koji se prikazuju na stranici.</p>
              </div>
              <button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700" onClick={onSaveSiteInfo}>Spremi site info</button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block font-medium">O nama naslov (HR)</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.title_desc.hr} onChange={(e) => setSiteInfo((current) => ({ ...current, title_desc: { ...current.title_desc, hr: e.target.value } }))} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">O nama naslov (EN)</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.title_desc.en} onChange={(e) => setSiteInfo((current) => ({ ...current, title_desc: { ...current.title_desc, en: e.target.value } }))} /></label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block font-medium">O nama opis (HR)</span><textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.description.hr} onChange={(e) => setSiteInfo((current) => ({ ...current, description: { ...current.description, hr: e.target.value } }))} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">O nama opis (EN)</span><textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.description.en} onChange={(e) => setSiteInfo((current) => ({ ...current, description: { ...current.description, en: e.target.value } }))} /></label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block font-medium">Adresa</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.contact.address} onChange={(e) => updateContactField('address', e.target.value)} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Mobitel</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.contact.phone} onChange={(e) => updateContactField('phone', e.target.value)} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">Lokacija</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.contact.location} onChange={(e) => updateContactField('location', e.target.value)} /></label>
              <label className="text-sm"><span className="mb-1 block font-medium">E-mail</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.contact.email} onChange={(e) => updateContactField('email', e.target.value)} /></label>
            </div>
            <label className="mt-3 block text-sm"><span className="mb-1 block font-medium">Certifikati</span><input className="min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2" value={siteInfo.contact.certificates} onChange={(e) => updateContactField('certificates', e.target.value)} /></label>
            {infoStatus && <p className="mt-3 whitespace-pre-line break-words text-sm text-slate-700">{infoStatus}</p>}
          </div>
        </section>
      </div>

      {status && <p className="mt-3 whitespace-pre-line break-words text-sm text-slate-700">{status}</p>}
    </main>
  )
}

export default CmsPanel
