"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])
  return (
    <html>
      <body className="min-h-screen grid place-items-center p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => reset()} className="px-4 py-2 rounded-md border">Try again</button>
            <Link href="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Go home</Link>
          </div>
          {process.env.NODE_ENV !== 'production' && error?.digest && (
            <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  )
}
