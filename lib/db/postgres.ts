import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import fs from "fs"
import path from "path"

// Load env vars for standalone scripts (tsx) before accessing process.env
// Supports .env.local (Next.js style) or .env
(() => {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    try {
      const root = process.cwd()
      const candidates = [".env.local", ".env"]
      for (const file of candidates) {
        const full = path.join(root, file)
        if (fs.existsSync(full)) {
          const dotenv = require("dotenv")
          dotenv.config({ path: full })
        }
      }
    } catch {
      // ignore
    }
  }
})()

// Create the connection
const rawConn = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""
const connectionString = rawConn.trim()

if (!connectionString) {
  console.error("[db] Environment variables visible keys:", Object.keys(process.env).filter(k => /DATABASE_URL|POSTGRES_URL/.test(k)))
}

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL environment variable is required")
}

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

// Export the client for direct queries if needed
export { client }

// Health check function
export async function checkDatabaseConnection() {
  try {
    await client`SELECT 1`
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, message: "Database connection failed", error }
  }
}
