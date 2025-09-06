import { runMigrations } from "../lib/db/migrate"
import { seedDatabase } from "../lib/db/seed"
import { healthCheck } from "../lib/db/init"

async function setupDatabase() {
  try {
    console.log("🚀 Starting database setup...")

    // Check health first
    console.log("🔍 Checking database health...")
    const health = await healthCheck()

    if (!health.healthy) {
      console.error("❌ Database health check failed:", health)
      throw new Error("Database connections not available")
    }

    console.log("✅ Database connections verified")

    // Run migrations
    console.log("🔄 Running database migrations...")
    await runMigrations()
    console.log("✅ Migrations completed")

    // Seed database
    console.log("🌱 Seeding database with sample data...")
    await seedDatabase()
    console.log("✅ Database seeded successfully")

    console.log("🎉 Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

export { setupDatabase }
