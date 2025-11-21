import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH update photo (verify/unverify)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId } = await params
    const body = await request.json()
    const { isVerified } = body

    const photo = await prisma.castPhoto.update({
      where: { id: photoId },
      data: { isVerified: isVerified ?? false },
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Error updating photo:", error)
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

// DELETE photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoId } = await params

    await prisma.castPhoto.delete({
      where: { id: photoId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
