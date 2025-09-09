import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

// NextAuth v4 configuration
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)
          
          if (!user[0] || !user[0].password) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user[0].password)
          
          if (!isValid) {
            return null
          }

          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            image: user[0].image,
            role: user[0].role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token) {
        // JWT session - token contains the user data
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ user, token, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "customer"
      }
      
      // For OAuth users, fetch role from database
      if (account?.provider === "google" && token?.email) {
        try {
          const dbUser = await db.select().from(users).where(eq(users.email, token.email as string)).limit(1)
          if (dbUser[0]) {
            token.role = dbUser[0].role || "customer"
            token.id = dbUser[0].id
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      }
      
      return token
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!(profile?.email && profile?.email_verified)
      }
      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
}

// Export NextAuth v4 functions
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)
