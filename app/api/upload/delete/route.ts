import { NextRequest, NextResponse } from 'next/server'
import { deleteImage } from '@/lib/cloudinary'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has elevated permissions
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const role = session.user.role as string | undefined
    if (!role || !['admin', 'moderator', 'super-admin'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { publicId } = await request.json().catch(() => ({ publicId: undefined }))

    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 })
    }

    // Only allow deletions under our Cloudinary namespace for safety
    if (typeof publicId !== 'string' || !publicId.startsWith('baby-ecommerce/')) {
      return NextResponse.json({ error: 'Invalid publicId' }, { status: 400 })
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
