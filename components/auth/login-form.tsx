"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  callbackUrl?: string
}

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        })
        router.push(callbackUrl)
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
        <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

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
