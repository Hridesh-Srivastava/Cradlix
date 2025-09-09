import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '../lib/db/postgres'
import { users } from '../lib/db/schema'
import { eq, isNotNull } from 'drizzle-orm'

// Load environment variables
config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqdkbgshz',
  api_key: process.env.CLOUDINARY_API_KEY || '935333464895341',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4ZRVJ9Ow_9G8B4Bn0JvaoEdo6jQ',
})

async function syncGoogleAvatars() {
  console.log('🔄 Syncing Google OAuth avatars to Cloudinary...')

  try {
    // Get all users with Google avatars
    const usersWithGoogleAvatars = await db
      .select()
      .from(users)
      .where(
        isNotNull(users.image)
      )

    console.log(`Found ${usersWithGoogleAvatars.length} users with avatars`)

    let syncedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const user of usersWithGoogleAvatars) {
      console.log(`Processing user: ${user.name} (${user.email})`)

      // Skip if already synced to Cloudinary
      if (user.image?.includes('cloudinary.com')) {
        console.log(`  ⏭️ Already synced to Cloudinary`)
        skippedCount++
        continue
      }

      // Skip if not a Google avatar
      if (!user.image?.includes('googleusercontent.com')) {
        console.log(`  ⏭️ Not a Google avatar`)
        skippedCount++
        continue
      }

      try {
        console.log(`  📤 Syncing Google avatar to Cloudinary...`)
        
        // Upload Google avatar to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
          user.image,
          {
            folder: 'baby-ecommerce/users/avatars',
            public_id: `google-avatar-${user.id}`,
            overwrite: true,
            transformation: [
              { width: 200, height: 200, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )

        // Update user avatar in database
        await db
          .update(users)
          .set({
            image: uploadResult.secure_url,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))

        console.log(`  ✅ Synced successfully! New URL: ${uploadResult.secure_url}`)
        syncedCount++

      } catch (error) {
        console.log(`  ❌ Failed to sync: ${error}`)
        errorCount++
      }
    }

    console.log('\n📊 Sync Summary:')
    console.log(`  ✅ Successfully synced: ${syncedCount}`)
    console.log(`  ⏭️ Skipped: ${skippedCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log(`  📊 Total processed: ${usersWithGoogleAvatars.length}`)

  } catch (error) {
    console.error('❌ Error syncing Google avatars:', error)
  }
}

// Run the sync
syncGoogleAvatars()
  .then(() => {
    console.log('🎉 Google avatar sync finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Google avatar sync failed:', error)
    process.exit(1)
  })
