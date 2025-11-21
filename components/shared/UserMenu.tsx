"use client"

import { Link } from "@/i18n/routing"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { useParams } from "next/navigation"
import type { Locale } from "@/i18n/config"

export default function UserMenu() {
  const { data: session } = useSession()
  const params = useParams()
  const currentLocale = params.locale as Locale

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${currentLocale}` })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-full hover:shadow-md transition-shadow cursor-pointer">
          <svg className="w-4 h-4 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${session?.user ? "bg-gradient-to-r from-[#FF385C] to-[#E61E4D]" : "bg-gray-400"}`}>
            {session?.user?.nickname ? (
              <span className="text-sm font-semibold">{session.user.nickname[0].toUpperCase()}</span>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-airbnb-md w-56 shadow-airbnb-md">
        {session?.user ? (
          <>
            {/* User info */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="font-semibold text-deep">{session.user.nickname || session.user.email}</p>
              <p className="text-xs text-light capitalize">{session.user.role?.toLowerCase()}</p>
            </div>

            {/* Role-based menu items */}
            {session.user.role === "MEMBER" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/browse" className="cursor-pointer">Browse Casts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer">Bookmarks</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages" className="cursor-pointer">Messages</Link>
                </DropdownMenuItem>
              </>
            )}

            {session.user.role === "CAST" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/cast/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cast/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cast/requests" className="cursor-pointer">Requests</Link>
                </DropdownMenuItem>
              </>
            )}

            {session.user.role === "ADMIN" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/casts" className="cursor-pointer">Manage Casts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/members" className="cursor-pointer">Manage Members</Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-[#FF385C] focus:text-[#FF385C]"
            >
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer font-semibold">Log in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register" className="cursor-pointer">Sign up</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
