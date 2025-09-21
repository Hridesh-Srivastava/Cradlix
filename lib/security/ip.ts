export function getClientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for') || ''
  const xr = req.headers.get('x-real-ip') || ''
  const ip = (xf.split(',')[0] || xr || '').trim()
  return ip || 'unknown'
}
