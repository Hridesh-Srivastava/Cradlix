"use client"

import { useCallback, useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    grecaptcha?: any
    __recaptchaPromise?: Promise<any>
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export function useRecaptcha() {
  const [ready, setReady] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!SITE_KEY) return
    if (loadedRef.current) return
    loadedRef.current = true

    if (window.grecaptcha) {
      setReady(true)
      return
    }

    if (!window.__recaptchaPromise) {
      window.__recaptchaPromise = new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY!)}`
        script.async = true
        script.defer = true
        script.onload = () => resolve(window.grecaptcha)
        document.head.appendChild(script)
      })
    }

    window.__recaptchaPromise.then(() => setReady(true))
  }, [])

  const execute = useCallback(async (action: string) => {
    if (!SITE_KEY) return null
    if (!ready) {
      await window.__recaptchaPromise
    }
    return await window.grecaptcha.execute(SITE_KEY, { action })
  }, [ready])

  return { ready: !!SITE_KEY && ready, execute }
}
