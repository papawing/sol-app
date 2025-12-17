"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { localeNames, type Locale } from "@/i18n/config"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function Navbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as Locale
  const { data: session, status } = useSession()

  const changeLocale = (newLocale: Locale) => {
    const newUrl = `/${newLocale}${pathname}`
    window.location.href = newUrl
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${currentLocale}` })
  }

  return (
    <header className="sticky top-0 left-0 right-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/images/sol-logo.svg"
              alt="SOL"
              width={120}
              height={40}
              className="object-contain sm:w-[140px] sm:h-[40px]"
              priority
            />
          </Link>

          {/* Center - Navigation Links (hidden on mobile, only show when not logged in) */}
          {!session?.user && (
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 mx-12">
              <Link
                href="/about"
                className="text-[#222222] font-medium hover:text-teal transition-colors"
              >
                {t("nav.about") || "About Us"}
              </Link>
              <Link
                href="/how-it-works"
                className="text-[#222222] font-medium hover:text-teal transition-colors"
              >
                {t("nav.howItWorks") || "How It Works"}
              </Link>
              <Link
                href="/become-cast"
                className="text-[#222222] font-medium hover:text-teal transition-colors"
              >
                {t("nav.becomeCast") || "Become Cast"}
              </Link>
              <Link
                href="/register"
                className="text-[#222222] font-medium hover:text-teal transition-colors"
              >
                {t("nav.becomeMember") || "Become Member"}
              </Link>
            </nav>
          )}

          {/* Spacer when logged in to push menu to right */}
          {session?.user && <div className="flex-1" />}

          {/* Right Side - Navigation & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="rounded-full flex-shrink-0">
                  <span className="text-lg">🌐</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-airbnb-md">
                {Object.entries(localeNames).map(([locale, name]) => (
                  <DropdownMenuItem
                    key={locale}
                    onClick={() => changeLocale(locale as Locale)}
                    className={currentLocale === locale ? "bg-gray-100 font-semibold" : ""}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 rounded-full hover:shadow-md transition-shadow cursor-pointer flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-deep flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${session?.user ? "bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D]" : "bg-gray-400"}`}>
                    {session?.user?.nickname ? (
                      <span className="text-xs sm:text-sm font-semibold">{session.user.nickname[0].toUpperCase()}</span>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
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
                      className="cursor-pointer text-[#FF5A5F] focus:text-[#FF5A5F]"
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation (visible only on mobile, only show when not logged in) */}
      {!session?.user && (
        <nav className="lg:hidden border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between gap-1 text-xs sm:text-sm">
            <Link
              href="/about"
              className="text-[#222222] font-medium hover:text-teal transition-colors text-center flex-1 px-1"
            >
              {t("nav.about") || "About"}
            </Link>
            <Link
              href="/how-it-works"
              className="text-[#222222] font-medium hover:text-teal transition-colors text-center flex-1 px-1"
            >
              {t("nav.howItWorks") || "How It Works"}
            </Link>
            <Link
              href="/become-cast"
              className="text-[#222222] font-medium hover:text-teal transition-colors text-center flex-1 px-1"
            >
              {t("nav.becomeCast") || "Cast"}
            </Link>
            <Link
              href="/register"
              className="text-[#222222] font-medium hover:text-teal transition-colors text-center flex-1 px-1"
            >
              {t("nav.becomeMember") || "Member"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
