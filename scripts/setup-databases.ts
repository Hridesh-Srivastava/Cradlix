import { db } from '../lib/db/postgres'
import { connectMongoDB } from '../lib/db/mongodb'
import fs from 'fs'
import path from 'path'

async function setupDatabases() {
  try {
    console.log('🚀 Setting up databases...')

    // 1. Create NextAuth.js tables in PostgreSQL
    console.log('📊 Creating NextAuth.js tables in PostgreSQL...')
    const sqlPath = path.join(__dirname, 'create-tables.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    for (const statement of statements) {
      try {
        await db.execute(statement)
        console.log(`✅ Executed: ${statement.substring(0, 50)}...`)
      } catch (error) {
        console.log(`⚠️  Statement may already exist: ${statement.substring(0, 50)}...`)
      }
    }

    // 2. Set up MongoDB collections
    console.log('🍃 Setting up MongoDB collections...')
    await connectMongoDB()
    
    // Create collections by inserting sample documents
    const { ContactForm, Newsletter, AnalyticsEvent, Feedback, SearchQuery } = await import('../lib/db/mongodb')
    
    // Create sample documents to ensure collections exist
    try {
      await ContactForm.createIndexes()
      await Newsletter.createIndexes()
      await AnalyticsEvent.createIndexes()
      await Feedback.createIndexes()
      await SearchQuery.createIndexes()
      console.log('✅ MongoDB collections and indexes created')
    } catch (error) {
      console.log('⚠️  MongoDB collections may already exist')
    }

    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error setting up databases:', error)
    throw error
  }
}

// Run the setup function
if (require.main === module) {
  setupDatabases()
    .then(() => {
      console.log('✅ Setup completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error)
      process.exit(1)
    })
}

export { setupDatabases }
