import { NextRequest, NextResponse } from 'next/server'
import { deleteImage } from '@/lib/cloudinary'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await deleteImage(publicId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
