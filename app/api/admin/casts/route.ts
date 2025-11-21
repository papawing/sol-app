import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET all casts for admin
export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const casts = await prisma.cast.findMany({
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
      orderBy: { user: { createdAt: "desc" } },
    })

    return NextResponse.json({ casts })
  } catch (error) {
    console.error("Error fetching casts:", error)
    return NextResponse.json({ error: "Failed to fetch casts" }, { status: 500 })
  }
}

// POST create new cast
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
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
      photos,
    } = body

    // Validate required fields
    if (!email || !password || !nickname || !age || !location) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, nickname, age, location" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user and cast in transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        role: "CAST",
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        cast: {
          create: {
            age: parseInt(age),
            birthday: birthday ? new Date(birthday) : null,
            location,
            languages: languages || [],
            bustSize: bustSize || null,
            height: height ? parseInt(height) : null,
            weight: weight ? parseInt(weight) : null,
            bodyMeasurements: bodyMeasurements || null,
            englishLevel: englishLevel || null,
            bio: bio || null,
            personality: personality || null,
            appearance: appearance || null,
            serviceStyle: serviceStyle || null,
            preferredType: preferredType || null,
            hobbies: hobbies || [],
            holidayStyle: holidayStyle || [],
            interests: interests || [],
            availabilityNotes: availabilityNotes || null,
            tierClassification: tierClassification || "STANDARD",
            isActive: isActive ?? true,
            isFeatured: isFeatured ?? false,
            approvedAt: new Date(),
            approvedByAdminId: session.user.id,
          },
        },
      },
      include: {
        cast: true,
      },
    })

    // Add photos if provided
    if (photos && photos.length > 0 && user.cast) {
      await prisma.castPhoto.createMany({
        data: photos.map((photoUrl: string, index: number) => ({
          castId: user.cast!.id,
          photoUrl,
          displayOrder: index,
          isVerified: true,
        })),
      })
    }

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        actionType: "CREATE_CAST",
        targetUserId: user.id,
        notes: `Created cast profile for ${nickname}`,
      },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("Error creating cast:", error)
    return NextResponse.json({ error: "Failed to create cast" }, { status: 500 })
  }
}
