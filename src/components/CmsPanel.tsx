import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { fetchProducts, getCmsSession, loginCms, logoutCms, saveProducts, uploadCmsImage } from '../lib/api'
import type { ProductCategory, ProductsData } from '../types/products'

const CmsPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<ProductsData>({})
  const [selectedKey, setSelectedKey] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getCmsSession().catch(() => ({ authenticated: false }))
        if (!session.authenticated) {
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        const data = await fetchProducts()
        const firstKey = Object.keys(data)[0] || ''
        setProducts(data)
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
      const data = await fetchProducts()
      const firstKey = Object.keys(data)[0] || ''
      setProducts(data)
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

  const onImageUrlChange = (value: string) => {
    updateSelected((product) => {
      const images = [...product.images]
      if (!images[0]) {
        images[0] = { url: '', alt: { hr: '', en: '' } }
      }
      images[0] = {
        ...images[0],
        url: value,
      }
      return { ...product, images }
    })
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setStatus('Uploadam sliku...')

    try {
      const { url } = await uploadCmsImage(file)
      onImageUrlChange(url)
      setStatus('Slika uploadana i povezana s proizvodom ✅')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Greška pri uploadu slike')
    } finally {
      setIsUploading(false)
    }
  }

  const onDropImage = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return
    await handleFileUpload(file)
  }

  const onPickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await handleFileUpload(file)
  }

  const onSave = async () => {
    setStatus('Spremam...')
    try {
      await saveProducts(products)
      setStatus('Spremljeno ✅')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Greška pri spremanju')
    }
  }

  const onLogout = async () => {
    await logoutCms().catch(() => undefined)
    setIsAuthenticated(false)
    setStatus('Odjavljen.')
  }

  if (isLoading) {
    return <div className="p-8 text-slate-700">Učitavanje CMS-a...</div>
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto mt-24 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">MGK CMS Login</h1>
        <form onSubmit={onLogin} className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700" type="submit">
            Login
          </button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
      </main>
    )
  }

  const productEntries = Object.entries(products)

  return (
    <main className="mx-auto mt-6 w-full max-w-7xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">MGK CMS – urednik proizvoda</h1>
        <div className="flex gap-2">
          <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700" onClick={onSave}>
            Spremi
          </button>
          <button className="rounded-lg border border-slate-300 px-3 py-2" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-sm font-semibold text-slate-500">PROIZVODI</p>
          <div className="space-y-2">
            {productEntries.map(([key, product], index) => (
              <button
                key={key}
                className={`w-full rounded-lg border p-3 text-left ${selectedKey === key ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
                onClick={() => setSelectedKey(key)}
              >
                <p className="text-xs font-semibold text-slate-500">Konzerva {index + 1}</p>
                <p className="font-medium text-slate-800">{product.name.hr || key}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          {!selectedProduct ? (
            <p className="text-slate-500">Odaberi proizvod s lijeve strane.</p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Uređivanje: {selectedProduct.name.hr || selectedKey}</h2>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Ime (HR)</span>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.name.hr} onChange={(e) => onTextChange('name', 'hr', e.target.value)} />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Ime (EN)</span>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.name.en} onChange={(e) => onTextChange('name', 'en', e.target.value)} />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Kratki opis (HR)</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.short_description?.hr ?? ''} onChange={(e) => onTextChange('short_description', 'hr', e.target.value)} />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Kratki opis (EN)</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.short_description?.en ?? ''} onChange={(e) => onTextChange('short_description', 'en', e.target.value)} />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Opis (HR)</span>
                  <textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.description.hr} onChange={(e) => onTextChange('description', 'hr', e.target.value)} />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Opis (EN)</span>
                  <textarea className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" value={selectedProduct.description.en} onChange={(e) => onTextChange('description', 'en', e.target.value)} />
                </label>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 p-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => void onDropImage(e)}>
                <p className="font-medium">Slika proizvoda</p>
                <p className="text-sm text-slate-500">Drag & drop sliku ovdje ili odaberi file. Putanja će se automatski popuniti.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="file" accept="image/*" onChange={(e) => void onPickImage(e)} />
                  {isUploading && <span className="text-sm text-blue-600">Upload u tijeku...</span>}
                </div>
                <label className="mt-3 block text-sm">
                  <span className="mb-1 block font-medium">URL slike</span>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={selectedProduct.images?.[0]?.url ?? ''}
                    onChange={(e) => onImageUrlChange(e.target.value)}
                  />
                </label>
                {selectedProduct.images?.[0]?.url && (
                  <img src={selectedProduct.images[0].url} alt="preview" className="mt-3 max-h-40 rounded-lg border border-slate-200" />
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
    </main>
  )
}

export default CmsPanel
