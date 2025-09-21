"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface LoginFormProps { callbackUrl?: string }

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      setFormError("Please enter both email and password.")
      return
    }

    try {
      setIsCredentialsLoading(true)
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
  const message = result.error === 'CredentialsSignin' ? 'Invalid email or password.' : 'Authentication failed.'
  setFormError(message)
  toast({ title: "Sign in failed", description: message, variant: "destructive" })
        return
      }

      // Check if sign in was successful
      // Add a small delay to ensure session is properly established
      await new Promise(resolve => setTimeout(resolve, 100))
      const session = await getSession()
      if (session) {
        setFormError(null)
        const role = (session.user as any)?.role
        const hasCb = !!callbackUrl && callbackUrl !== '/' && callbackUrl !== '/login'
        const destination = hasCb
          ? (callbackUrl as string)
          : role === 'super-admin'
            ? '/super-admin'
            : role === 'admin'
              ? '/admin'
              : '/'
        toast({ title: "Welcome back!", description: "You have been successfully signed in." })
        router.push(destination)
        router.refresh()
      } else {
        // If no session after successful signIn, try one more time
        await new Promise(resolve => setTimeout(resolve, 200))
        const retrySession = await getSession()
        if (retrySession) {
          setFormError(null)
          const role = (retrySession.user as any)?.role
          const hasCb = !!callbackUrl && callbackUrl !== '/' && callbackUrl !== '/login'
          const destination = hasCb
            ? (callbackUrl as string)
            : role === 'super-admin'
              ? '/super-admin'
              : role === 'admin'
                ? '/admin'
                : '/'
          toast({ title: "Welcome back!", description: "You have been successfully signed in." })
          router.push(destination)
          router.refresh()
        } else {
          setFormError("Session not established. Please try again.")
          toast({ title: "Sign in failed", description: "Session not established. Please try again.", variant: "destructive" })
        }
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
  setFormError("An unexpected error occurred. Please try again.")
    } finally {
      setIsCredentialsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Sign in failed",
          description: "There was an error signing in with Google. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Check if sign in was successful
      const session = await getSession()
      if (session) {
        const role = (session.user as any)?.role
        const hasCb = !!callbackUrl && callbackUrl !== '/' && callbackUrl !== '/login'
        const destination = hasCb
          ? (callbackUrl as string)
          : role === 'super-admin'
            ? '/super-admin'
            : role === 'admin'
              ? '/admin'
              : '/'
        toast({ title: "Welcome back!", description: "You have been successfully signed in." })
        router.push(destination)
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue shopping for your little ones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formError && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {formError}
          </div>
        )}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isCredentialsLoading}>
            {isCredentialsLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
