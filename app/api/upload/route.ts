import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    let folder = (formData.get('folder') as string) || 'baby-ecommerce/uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type and size (max 10MB)
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }
    if (typeof file.size === 'number' && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB.' }, { status: 400 })
    }

    // Sanitize/limit folder to our namespace
    if (!folder.startsWith('baby-ecommerce/')) {
      folder = 'baby-ecommerce/uploads'
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await uploadImage(buffer, folder, {
      public_id: `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}`,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
