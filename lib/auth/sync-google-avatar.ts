import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { cloudinary } from "@/lib/cloudinary"

export async function syncGoogleAvatarToCloudinary(userId: string, imageUrl?: string | null) {
  if (!userId || !imageUrl) return null
  const isGoogle = imageUrl.includes("googleusercontent.com")
  const isCloudinary = imageUrl.includes("cloudinary.com")
  if (!isGoogle || isCloudinary) return null

  const publicId = `google-avatar-${userId}`

  // Ensure we overwrite the same asset to avoid duplicates
  try {
    await cloudinary.uploader.destroy(`baby-ecommerce/users/avatars/${publicId}`)
  } catch {}

  const upload = await cloudinary.uploader.upload(imageUrl, {
    folder: "baby-ecommerce/users/avatars",
    public_id: publicId,
    overwrite: true,
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { format: "auto" },
    ],
  })

  const url = upload.secure_url
  await db.update(users).set({ image: url, updatedAt: new Date() }).where(eq(users.id, userId))
  return url
}
