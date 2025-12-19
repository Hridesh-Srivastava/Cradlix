import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db/postgres"
import { storeRequests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Submit new store registration request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Check if user already has a pending or approved request
    const existingRequest = await db
      .select()
      .from(storeRequests)
      .where(eq(storeRequests.userId, session.user.id))
      .limit(1)

    if (existingRequest.length > 0) {
      const status = existingRequest[0].status
      if (status === "pending") {
        return NextResponse.json(
          { message: "You already have a pending store request" },
          { status: 400 }
        )
      }
      if (status === "approved") {
        return NextResponse.json(
          { message: "You already have an approved store" },
          { status: 400 }
        )
      }
    }

    // Create new store request
    const newRequest = await db
      .insert(storeRequests)
      .values({
        userId: session.user.id,
        businessName: body.businessName,
        businessType: body.businessType,
        businessCategory: body.businessCategory,
        gstNumber: body.gstNumber || null,
        panNumber: body.panNumber || null,
        contactPersonName: body.contactPersonName,
        email: body.email,
        phone: body.phone,
        alternatePhone: body.alternatePhone || null,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country || "India",
        businessLogo: body.businessLogo || null,
        gstCertificate: body.gstCertificate || null,
        panCard: body.panCard || null,
        businessRegistration: body.businessRegistration || null,
        addressProof: body.addressProof || null,
        bankName: body.bankName || null,
        accountNumber: body.accountNumber || null,
        ifscCode: body.ifscCode || null,
        accountHolderName: body.accountHolderName || null,
        cancelledCheque: body.cancelledCheque || null,
        websiteUrl: body.websiteUrl || null,
        facebookUrl: body.facebookUrl || null,
        instagramUrl: body.instagramUrl || null,
        twitterUrl: body.twitterUrl || null,
        businessDescription: body.businessDescription || null,
        yearsInBusiness: body.yearsInBusiness ? parseInt(body.yearsInBusiness) : null,
        expectedMonthlyRevenue: body.expectedMonthlyRevenue || null,
        productCategories: body.productCategories || [],
        agreedToTerms: body.agreedToTerms,
        agreedToCommission: body.agreedToCommission,
        status: "pending",
      })
      .returning()

    // Send email notification to user
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/email/store-request-submitted`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          businessName: body.businessName,
          contactPersonName: body.contactPersonName,
        }),
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: "Store request submitted successfully",
        request: newRequest[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Store request error:", error)
    return NextResponse.json(
      { message: "Failed to submit store request" },
      { status: 500 }
    )
  }
}

// Get user's store request status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const requests = await db
      .select()
      .from(storeRequests)
      .where(eq(storeRequests.userId, session.user.id))

    return NextResponse.json({ requests }, { status: 200 })
  } catch (error) {
    console.error("Fetch store requests error:", error)
    return NextResponse.json(
      { message: "Failed to fetch store requests" },
      { status: 500 }
    )
  }
}
