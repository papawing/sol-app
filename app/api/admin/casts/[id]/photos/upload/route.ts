import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

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

    // Verify cast exists
    const cast = await prisma.cast.findUnique({ where: { id } })
    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, WebP or GIF" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`casts/${id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Get current max display order
    const maxOrderPhoto = await prisma.castPhoto.findFirst({
      where: { castId: id },
      orderBy: { displayOrder: "desc" },
    })
    const displayOrder = (maxOrderPhoto?.displayOrder ?? -1) + 1

    // Create photo record
    const photo = await prisma.castPhoto.create({
      data: {
        castId: id,
        photoUrl: blob.url,
        displayOrder,
        isVerified: false,
      },
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}
