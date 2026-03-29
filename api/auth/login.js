import { setAuthCookie, signInCmsUser } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body ?? {}

  try {
    const token = await signInCmsUser(username, password)
    setAuthCookie(res, token)
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka' })
  }
}
