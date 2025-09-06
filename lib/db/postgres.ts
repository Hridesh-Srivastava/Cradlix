import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Create the connection
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

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
