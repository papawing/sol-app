import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST add photos to cast
export async function POST(
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
    const { photos } = body

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 })
    }

    // Verify cast exists
    const cast = await prisma.cast.findUnique({ where: { id } })
    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 })
    }

    // Get current max display order
    const maxOrderPhoto = await prisma.castPhoto.findFirst({
      where: { castId: id },
      orderBy: { displayOrder: "desc" },
    })
    const startOrder = (maxOrderPhoto?.displayOrder ?? -1) + 1

    // Create photos
    const createdPhotos = await prisma.castPhoto.createMany({
      data: photos.map((photoUrl: string, index: number) => ({
        castId: id,
        photoUrl,
        displayOrder: startOrder + index,
        isVerified: false,
      })),
    })

    return NextResponse.json({ success: true, count: createdPhotos.count })
  } catch (error) {
    console.error("Error adding photos:", error)
    return NextResponse.json({ error: "Failed to add photos" }, { status: 500 })
  }
}

// PUT reorder photos
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
    const { photoOrders } = body // Array of { photoId, displayOrder }

    if (!photoOrders || !Array.isArray(photoOrders)) {
      return NextResponse.json({ error: "Invalid photo orders" }, { status: 400 })
    }

    // Update each photo's display order
    await Promise.all(
      photoOrders.map(({ photoId, displayOrder }: { photoId: string; displayOrder: number }) =>
        prisma.castPhoto.update({
          where: { id: photoId },
          data: { displayOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering photos:", error)
    return NextResponse.json({ error: "Failed to reorder photos" }, { status: 500 })
  }
}
