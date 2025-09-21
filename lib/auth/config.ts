import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { mailer, renderWelcomeUserHtml, renderNewUserAdminHtml } from "@/lib/email"
import { buildUsersWorkbookBuffer } from "@/lib/export/users-excel"
import { syncGoogleAvatarToCloudinary } from "@/lib/auth/sync-google-avatar"

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
          // Bootstrap Super Admin using env credentials (no UI exposure)
          const adminEmail = process.env.SUPER_ADMIN_EMAIL
          const adminPassword = process.env.SUPER_ADMIN_PASSWORD
          if (adminEmail && adminPassword && credentials.email === adminEmail && credentials.password === adminPassword) {
            // Ensure user exists and is super-admin
            const existing = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1)
            if (!existing[0]) {
              const hashed = await bcrypt.hash(adminPassword, 10)
              const [created] = await db.insert(users).values({
                email: adminEmail,
                name: 'Super Admin',
                role: 'super-admin',
                status: 'approved',
                password: hashed,
                image: null as any,
                createdAt: new Date(),
                updatedAt: new Date(),
              }).returning()
              return {
                id: created.id,
                email: created.email,
                name: created.name,
                image: created.image || undefined,
                role: created.role,
                status: created.status,
              } as any
            } else {
              // Ensure role is super-admin; set password if missing
              let updatedUser = existing[0]
              if (existing[0].role !== 'super-admin' || !existing[0].password || existing[0].status !== 'approved') {
                const hashed = await bcrypt.hash(adminPassword, 10)
                const [updated] = await db.update(users)
                  .set({ role: 'super-admin', status: 'approved', password: hashed, updatedAt: new Date() })
                  .where(eq(users.id, existing[0].id))
                  .returning()
                updatedUser = updated
              }
              return {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                image: updatedUser.image || undefined,
                role: updatedUser.role,
                status: updatedUser.status,
              } as any
            }
          }

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
            status: (user[0] as any).status || 'approved',
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
    ;(session.user as any).status = (token as any).status || 'approved'
      }
      return session
    },
  async jwt({ user, token, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "customer"
    ;(token as any).status = (user as any).status || 'approved'
      }
      
      // For OAuth users, fetch role from database
      if (account?.provider === "google" && token?.email) {
        try {
          const dbUser = await db.select().from(users).where(eq(users.email, token.email as string)).limit(1)
          if (dbUser[0]) {
            token.role = dbUser[0].role || "customer"
            token.id = dbUser[0].id
      ;(token as any).status = (dbUser[0] as any).status || 'approved'
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      }
      
      return token
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
  // email_verified is provider-specific; use a safe cast
  const emailVerified = (profile as any)?.email_verified
  const ok = !!(profile?.email && emailVerified)
  // Fire-and-forget: if the avatar is a Google URL, sync it to Cloudinary
  try {
    if (ok && user?.id && user?.image && typeof user.image === 'string') {
      try {
        // Fetch latest DB value to avoid racing with createUser event
        const dbUser = await db.select().from(users).where(eq(users.id, user.id as string)).limit(1)
        const dbImage = dbUser[0]?.image as string | null | undefined
        const alreadyCloudinary = !!dbImage && typeof dbImage === 'string' && dbImage.includes('cloudinary.com')
        const isGoogle = typeof user.image === 'string' && user.image.includes('googleusercontent.com')
        if (!alreadyCloudinary && isGoogle) {
          // Fire-and-forget; no await
          syncGoogleAvatarToCloudinary(user.id as string, user.image as string)
        }
      } catch {}
    }
  } catch {}
  return ok
      }
      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (shorter for security)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days (shorter for security)
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug in production
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }
    }
  },
  events: {
    async createUser({ user }) {
      try {
        // Attempt a sync if the provider image is a Google URL
        try {
          if (user?.id && user?.image && typeof user.image === 'string') {
            await syncGoogleAvatarToCloudinary(user.id as string, user.image as string)
          }
        } catch {}

        const from = process.env.EMAIL_USER
        const adminTo = process.env.EMAIL_TO || from
        const excel = await buildUsersWorkbookBuffer()
        if (from && user?.email) {
          await mailer.sendMail({
            from,
            to: user.email,
            subject: "Welcome to Baby Store",
            html: renderWelcomeUserHtml(user.name || ""),
          })
        }
        if (from && adminTo && user?.email) {
          await mailer.sendMail({
            from,
            to: adminTo,
            subject: `New user: ${user.name || ""} <${user.email}>`,
            html: renderNewUserAdminHtml({ name: user.name || null, email: user.email, role: (user as any).role || "customer" }),
            attachments: [
              {
                filename: "users.xlsx",
                content: Buffer.from(excel),
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              },
            ],
          })
        }
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("createUser event email failed:", e)
        }
      }
    },
  },
}

// Export NextAuth v4 functions
// Provide a NextAuth v4-compatible auth() helper used across the app
// Returns the current session (or null) on the server using getServerSession
export async function auth() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    // Suppress static-detection noise during build; return null gracefully
    if (error instanceof Error && error.message.includes("Dynamic server usage")) {
      return null
    }
    // Optional: log other unexpected errors in dev
    if (process.env.NODE_ENV !== "production") {
      console.error("auth() error:", error)
    }
    return null
  }
}
