import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL environment variable is required")
}

// Create migration client
const migrationClient = postgres(connectionString, { max: 1 })
const db = drizzle(migrationClient)

export async function runMigrations() {
  try {
    console.log("Running database migrations...")
    await migrate(db, { migrationsFolder: "./drizzle" })
    console.log("Migrations completed successfully")
    await migrationClient.end()
  } catch (error) {
    console.error("Migration failed:", error)
    await migrationClient.end()
    throw error
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migration process completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Migration process failed:", error)
      process.exit(1)
    })
}
