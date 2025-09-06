import { checkDatabaseConnection } from "./postgres"
import { connectMongoDB } from "./mongodb"

export async function initializeDatabases() {
  const results = {
    postgres: { connected: false, error: null as any },
    mongodb: { connected: false, error: null as any },
  }

  // Test PostgreSQL connection
  try {
    const pgResult = await checkDatabaseConnection()
    results.postgres.connected = pgResult.success
    if (!pgResult.success) {
      results.postgres.error = pgResult.error
    }
  } catch (error) {
    results.postgres.error = error
  }

  // Test MongoDB connection
  try {
    await connectMongoDB()
    results.mongodb.connected = true
  } catch (error) {
    results.mongodb.error = error
  }

  return results
}

export async function validateEnvironmentVariables() {
  const required = ["MONGODB_URI", "NEXTAUTH_SECRET"]

  // NEXTAUTH_URL is only required in production
  if (process.env.NODE_ENV === "production") {
    required.push("NEXTAUTH_URL")
  }

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

export async function healthCheck() {
  try {
    // Validate environment variables
    await validateEnvironmentVariables()

    // Check database connections
    const dbStatus = await initializeDatabases()

    const isHealthy = dbStatus.postgres.connected && dbStatus.mongodb.connected

    return {
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      databases: dbStatus,
      environment: {
        nodeEnv: process.env.NODE_ENV,
  hasPostgresUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
        hasMongoUrl: !!process.env.MONGODB_URI,
        hasAuthSecret: !!process.env.NEXTAUTH_SECRET,
      },
    }
  } catch (error) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
