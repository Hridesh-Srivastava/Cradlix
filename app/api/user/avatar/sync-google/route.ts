import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqdkbgshz',
  api_key: process.env.CLOUDINARY_API_KEY || '935333464895341',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4ZRVJ9Ow_9G8B4Bn0JvaoEdo6jQ',
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user data
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
    
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = user[0]
    
    // Check if user has a Google avatar URL
    if (!currentUser.image || !currentUser.image.includes('googleusercontent.com')) {
      return NextResponse.json({ 
        error: 'No Google avatar found to sync' 
      }, { status: 400 })
    }

    // Check if avatar is already synced to Cloudinary
    if (currentUser.image.includes('cloudinary.com')) {
      return NextResponse.json({ 
        message: 'Avatar already synced to Cloudinary',
        avatarUrl: currentUser.image
      })
    }

    try {
      // Upload Google avatar to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        currentUser.image,
        {
          folder: 'baby-ecommerce/users/avatars',
          public_id: `google-avatar-${session.user.id}`,
          overwrite: true,
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      // Update user avatar in database with Cloudinary URL
      const updatedUser = await db
        .update(users)
        .set({
          image: uploadResult.secure_url,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
        .returning({
          id: users.id,
          image: users.image,
        })

      if (!updatedUser.length) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Google avatar synced to Cloudinary successfully',
        avatarUrl: uploadResult.secure_url,
        originalUrl: currentUser.image,
      })

    } catch (uploadError) {
      console.error('Error uploading Google avatar to Cloudinary:', uploadError)
      return NextResponse.json({
        error: 'Failed to sync Google avatar to Cloudinary',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error syncing Google avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user data
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
    
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = user[0]
    
    // Return avatar information
    return NextResponse.json({
      success: true,
      avatar: {
        url: currentUser.image,
        isGoogleAvatar: currentUser.image?.includes('googleusercontent.com') || false,
        isCloudinaryAvatar: currentUser.image?.includes('cloudinary.com') || false,
        isCustomAvatar: currentUser.image?.includes('custom-avatars') || false,
      }
    })

  } catch (error) {
    console.error('Error getting avatar info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
