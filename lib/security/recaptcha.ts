export async function verifyRecaptcha(token: string | null | undefined, expectedAction?: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    // If not configured, treat as pass in dev; in prod you may want to fail.
    if (process.env.NODE_ENV !== 'production') return { success: true, score: 1, action: expectedAction }
    return { success: false, error: 'recaptcha-not-configured' }
  }
  if (!token) return { success: false, error: 'missing-token' }

  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      // Make sure we don't leak cookies
      cache: 'no-store',
    })
    const data = await res.json() as any
    const ok = !!data.success
    const score = typeof data.score === 'number' ? data.score : 0
    const action = data.action as string | undefined
    if (!ok) return { success: false, error: 'verification-failed' }
    if (expectedAction && action && action !== expectedAction) {
      return { success: false, error: 'action-mismatch', score, action }
    }
    return { success: ok, score, action }
  } catch (e) {
    return { success: false, error: 'verification-error' }
  }
}
