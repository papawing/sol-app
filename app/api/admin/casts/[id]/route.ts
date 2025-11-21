import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET single cast details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const cast = await prisma.cast.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            verificationStatus: true,
            createdAt: true,
          },
        },
        photos: {
          orderBy: { displayOrder: "asc" },
        },
      },
    })

    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 })
    }

    return NextResponse.json({ cast })
  } catch (error) {
    console.error("Error fetching cast:", error)
    return NextResponse.json({ error: "Failed to fetch cast" }, { status: 500 })
  }
}

// PUT update cast
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    console.log("Received update body:", JSON.stringify(body, null, 2))

    const {
      email,
      password,
      nickname,
      age,
      birthday,
      location,
      languages,
      bustSize,
      height,
      weight,
      bodyMeasurements,
      englishLevel,
      bio,
      personality,
      appearance,
      serviceStyle,
      preferredType,
      hobbies,
      holidayStyle,
      interests,
      availabilityNotes,
      tierClassification,
      isActive,
      isFeatured,
    } = body

    // Find cast first
    const existingCast = await prisma.cast.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!existingCast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 })
    }

    // Update user fields (email, password, nickname)
    const userUpdateData: Record<string, unknown> = {}

    if (nickname && nickname !== existingCast.user.nickname) {
      userUpdateData.nickname = nickname
    }

    if (email && email !== existingCast.user.email) {
      // Check if email is already taken
      const existingEmail = await prisma.user.findUnique({ where: { email } })
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      userUpdateData.email = email
    }

    if (password && password.length >= 6) {
      userUpdateData.passwordHash = await bcrypt.hash(password, 10)
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: existingCast.userId },
        data: userUpdateData,
      })
    }

    // Build update data object
    const updateData: Record<string, unknown> = {}

    if (age !== undefined && age !== "") {
      updateData.age = parseInt(String(age))
    }
    if (birthday !== undefined) {
      updateData.birthday = birthday ? new Date(birthday) : null
    }
    if (location !== undefined && location !== "") {
      updateData.location = location
    }
    if (languages !== undefined) {
      updateData.languages = languages
    }
    if (bustSize !== undefined) {
      updateData.bustSize = bustSize || null
    }
    if (height !== undefined) {
      updateData.height = height ? parseInt(String(height)) : null
    }
    if (weight !== undefined) {
      updateData.weight = weight ? parseInt(String(weight)) : null
    }
    if (bodyMeasurements !== undefined) {
      updateData.bodyMeasurements = bodyMeasurements || null
    }
    if (englishLevel !== undefined) {
      updateData.englishLevel = englishLevel || null
    }
    if (bio !== undefined) {
      updateData.bio = bio
    }
    if (personality !== undefined) {
      updateData.personality = personality
    }
    if (appearance !== undefined) {
      updateData.appearance = appearance
    }
    if (serviceStyle !== undefined) {
      updateData.serviceStyle = serviceStyle
    }
    if (preferredType !== undefined) {
      updateData.preferredType = preferredType
    }
    if (hobbies !== undefined) {
      updateData.hobbies = hobbies
    }
    if (holidayStyle !== undefined) {
      updateData.holidayStyle = holidayStyle
    }
    if (interests !== undefined) {
      updateData.interests = interests
    }
    if (availabilityNotes !== undefined) {
      updateData.availabilityNotes = availabilityNotes || null
    }
    if (tierClassification !== undefined && tierClassification !== "") {
      updateData.tierClassification = tierClassification
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured
    }

    console.log("Updating cast with data:", JSON.stringify(updateData, null, 2))

    // Update cast profile
    const updatedCast = await prisma.cast.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            verificationStatus: true,
          },
        },
        photos: {
          orderBy: { displayOrder: "asc" },
        },
      },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_CAST",
        targetUserId: existingCast.userId,
        notes: `Updated cast profile for ${updatedCast.user.nickname}`,
      },
    })

    return NextResponse.json({ success: true, cast: updatedCast })
  } catch (error) {
    console.error("Error updating cast:", error)
    return NextResponse.json({ error: "Failed to update cast" }, { status: 500 })
  }
}

// DELETE cast
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find cast to get user info
    const cast = await prisma.cast.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 })
    }

    // Delete user (cascade will delete cast and related records)
    await prisma.user.delete({
      where: { id: cast.userId },
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "DELETE_CAST",
        targetUserId: cast.userId,
        notes: `Deleted cast profile for ${cast.user.nickname}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cast:", error)
    return NextResponse.json({ error: "Failed to delete cast" }, { status: 500 })
  }
}
