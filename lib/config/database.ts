import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { MongoClient } from "mongodb"
import mongoose from "mongoose"

// PostgreSQL connection for main ecommerce data
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool)

// MongoDB connection for contact forms, logs, and analytics
let mongoClient: MongoClient | null = null
let mongoDb: any = null

export async function connectMongoDB() {
  if (mongoClient && mongoDb) {
    return { client: mongoClient, db: mongoDb }
  }

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI!)
    await mongoClient.connect()
    mongoDb = mongoClient.db("baby_ecommerce")

    console.log("Connected to MongoDB")
    return { client: mongoClient, db: mongoDb }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Mongoose connection for schemas
export async function connectMongoose() {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose.connections[0]
    }

    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("Connected to MongoDB via Mongoose")
    return mongoose.connections[0]
  } catch (error) {
    console.error("Mongoose connection error:", error)
    throw error
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (mongoClient) {
    await mongoClient.close()
  }
  if (mongoose.connections[0].readyState) {
    await mongoose.disconnect()
  }
  await pool.end()
  process.exit(0)
})
