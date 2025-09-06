import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        const dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1)
        session.user.id = user.id
        session.user.role = dbUser[0]?.role || "customer"
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.role = user.role
        token.id = user.id
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
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
