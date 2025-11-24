import { NextRequest, NextResponse } from "next/server"

const SITE_PASSWORD = "123456"
const PASSWORD_COOKIE = "site-access"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === SITE_PASSWORD) {
      const response = NextResponse.json({ success: true })

      // Set cookie for 30 days
      response.cookies.set(PASSWORD_COOKIE, SITE_PASSWORD, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })

      return response
    }

    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
