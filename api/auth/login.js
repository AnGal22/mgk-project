import { setAuthCookie, signAuthToken } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body ?? {}
  const cmsUsername = process.env.CMS_USERNAME || 'employee'
  const cmsPassword = process.env.CMS_PASSWORD || 'mgk123'

  if (username !== cmsUsername || password !== cmsPassword) {
    return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka' })
  }

  const token = signAuthToken({ username })
  setAuthCookie(res, token)

  return res.status(200).json({ ok: true })
}
