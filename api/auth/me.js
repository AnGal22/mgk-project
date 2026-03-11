import { verifyAuthFromRequest } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = verifyAuthFromRequest(req)
  return res.status(200).json({ authenticated: Boolean(session) })
}
