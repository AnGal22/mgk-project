import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { fetchProducts, getCmsSession, loginCms, logoutCms, saveProducts } from '../lib/api'
import type { ProductsData } from '../types/products'

const CmsPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [jsonValue, setJsonValue] = useState('{}')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getCmsSession().catch(() => ({ authenticated: false }))
        if (!session.authenticated) {
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
        const products = await fetchProducts()
        setJsonValue(JSON.stringify(products, null, 2))
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
      const products = await fetchProducts()
      setJsonValue(JSON.stringify(products, null, 2))
      setIsAuthenticated(true)
      setPassword('')
      setStatus('Uspješno prijavljen.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Neuspješan login')
    }
  }

  const parsedProducts = useMemo(() => {
    try {
      return JSON.parse(jsonValue) as ProductsData
    } catch {
      return null
    }
  }, [jsonValue])

  const onSave = async () => {
    if (!parsedProducts) {
      setStatus('JSON nije validan. Ispravi greške prije spremanja.')
      return
    }

    setStatus('Spremam...')
    try {
      await saveProducts(parsedProducts)
      setStatus('Spremljeno u src/products.json ✅')
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

  return (
    <main className="mx-auto mt-8 w-full max-w-6xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">MGK CMS – products.json editor</h1>
        <button className="rounded-lg border border-slate-300 px-3 py-2" onClick={onLogout}>
          Logout
        </button>
      </div>

      <textarea
        className="min-h-[70vh] w-full rounded-xl border border-slate-300 p-4 font-mono text-sm"
        value={jsonValue}
        onChange={(event) => setJsonValue(event.target.value)}
      />

      <div className="mt-3 flex items-center gap-3">
        <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700" onClick={onSave}>
          Save products.json
        </button>
        <span className={parsedProducts ? 'text-emerald-700' : 'text-red-600'}>
          {parsedProducts ? 'Valid JSON' : 'Invalid JSON'}
        </span>
      </div>

      {status && <p className="mt-3 text-sm text-slate-700">{status}</p>}
    </main>
  )
}

export default CmsPanel
