"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function VerifyOtpPage() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(60)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const canResend = cooldown === 0

  const maskedEmail = useMemo(() => {
    if (!email) return ''
    const [u, d] = email.split('@')
    if (!u || !d) return email
    const mask = u.length <= 2 ? u[0] + '*' : u[0] + '*'.repeat(Math.max(1, u.length - 2)) + u[u.length - 1]
    return `${mask}@${d}`
  }, [email])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || otp.length !== 6) {
      setBanner({ type: 'error', message: 'Enter the 6-digit code sent to your email.' })
      return
    }
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Verification failed')
      setBanner({ type: 'success', message: 'OTP verified! You can sign in now.' })
      // brief pause so user can see the success banner
      setTimeout(() => router.push('/login'), 900)
    } catch (e: any) {
      setBanner({ type: 'error', message: e?.message || 'Verification failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email || !canResend) return
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Could not resend code')
      setCooldown(60)
      setBanner({ type: 'success', message: 'A new verification code has been emailed to you.' })
    } catch (e: any) {
      setBanner({ type: 'error', message: e?.message || 'Please wait and try again.' })
    }
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to {maskedEmail}</CardDescription>
        </CardHeader>
        <CardContent>
          {banner && (
            <div
              className={[
                'mb-4 rounded-md border px-4 py-3 text-sm',
                banner.type === 'success'
                  ? 'border-green-200 bg-green-50/70 text-green-800'
                  : 'border-red-200 bg-red-50/70 text-red-800',
              ].join(' ')}
              role={banner.type === 'error' ? 'alert' : 'status'}
            >
              {banner.message}
            </div>
          )}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                required
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  const key = e.key?.toLowerCase?.() || ''
                  if ((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'insert')) {
                    e.preventDefault()
                  }
                  if (e.shiftKey && key === 'insert') {
                    e.preventDefault()
                  }
                }}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Verifying…' : 'Verify'}</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button onClick={handleResend} disabled={!canResend} className="underline disabled:opacity-50">
              {canResend ? 'Resend code' : `Resend available in ${cooldown}s`}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
