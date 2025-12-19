import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db/postgres"
import { storeRequests, stores, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Approve or Reject store request
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()
    const { action, rejectionReason, adminNotes } = body

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    // Get the store request
    const [request] = await db
      .select()
      .from(storeRequests)
      .where(eq(storeRequests.id, id))
      .limit(1)

    if (!request) {
      return NextResponse.json({ message: "Store request not found" }, { status: 404 })
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { message: "This request has already been processed" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      // Create slug for store
      const slug = request.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Check if slug exists
      const existingStore = await db
        .select()
        .from(stores)
        .where(eq(stores.slug, slug))
        .limit(1)

      const finalSlug = existingStore.length > 0 ? `${slug}-${Date.now()}` : slug

      // Create store
      const [newStore] = await db
        .insert(stores)
        .values({
          userId: request.userId,
          requestId: request.id,
          businessName: request.businessName,
          slug: finalSlug,
          businessType: request.businessType,
          businessCategory: request.businessCategory,
          gstNumber: request.gstNumber,
          panNumber: request.panNumber,
          contactPersonName: request.contactPersonName,
          email: request.email,
          phone: request.phone,
          alternatePhone: request.alternatePhone,
          addressLine1: request.addressLine1,
          addressLine2: request.addressLine2,
          city: request.city,
          state: request.state,
          postalCode: request.postalCode,
          country: request.country,
          businessLogo: request.businessLogo,
          gstCertificate: request.gstCertificate,
          panCard: request.panCard,
          businessRegistration: request.businessRegistration,
          addressProof: request.addressProof,
          bankName: request.bankName,
          accountNumber: request.accountNumber,
          ifscCode: request.ifscCode,
          accountHolderName: request.accountHolderName,
          cancelledCheque: request.cancelledCheque,
          websiteUrl: request.websiteUrl,
          facebookUrl: request.facebookUrl,
          instagramUrl: request.instagramUrl,
          twitterUrl: request.twitterUrl,
          businessDescription: request.businessDescription,
          yearsInBusiness: request.yearsInBusiness,
          productCategories: request.productCategories,
          isActive: true,
          isVerified: false,
        })
        .returning()

      // Promote user to admin role
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, request.userId))

      // Update request status
      await db
        .update(storeRequests)
        .set({
          status: "approved",
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
        })
        .where(eq(storeRequests.id, id))

      // Send approval email
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/email/store-approved`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: request.email,
            businessName: request.businessName,
            contactPersonName: request.contactPersonName,
            storeSlug: finalSlug,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError)
      }

      return NextResponse.json(
        {
          message: "Store request approved successfully",
          store: newStore,
        },
        { status: 200 }
      )
    } else {
      // Reject request
      if (!rejectionReason) {
        return NextResponse.json(
          { message: "Rejection reason is required" },
          { status: 400 }
        )
      }

      await db
        .update(storeRequests)
        .set({
          status: "rejected",
          rejectionReason,
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
        })
        .where(eq(storeRequests.id, id))

      // Send rejection email
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/email/store-rejected`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: request.email,
            businessName: request.businessName,
            contactPersonName: request.contactPersonName,
            rejectionReason,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError)
      }

      return NextResponse.json(
        {
          message: "Store request rejected successfully",
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Store request action error:", error)
    return NextResponse.json(
      { message: "Failed to process store request" },
      { status: 500 }
    )
  }
}
