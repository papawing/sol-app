"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t("auth.loginError"))
      } else {
        // Fetch session to get user role
        const response = await fetch('/api/auth/session')
        const session = await response.json()

        // Role-based redirect with explicit locale
        if (session?.user?.role === 'ADMIN') {
          router.push(`/${locale}/dashboard`)
        } else if (session?.user?.role === 'CAST') {
          router.push(`/${locale}/profile`)
        } else {
          router.push(`/${locale}/browse`)
        }
        router.refresh()
      }
    } catch (error) {
      setError(t("common.error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Airbnb-style auth card */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-4xl">🌙</span>
            <span className="font-display text-2xl font-bold text-deep">
              {t("common.appName")}
            </span>
          </Link>
        </div>

        <Card className="shadow-airbnb-xl rounded-airbnb-xl border-0 overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-8 px-6 md:px-8">
            <CardTitle className="text-2xl font-semibold text-deep">
              {t("auth.welcomeBack") || "Welcome back"}
            </CardTitle>
            <CardDescription className="text-light">
              {t("auth.loginPrompt") || "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 md:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-deep block">
                  {t("auth.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-lg border-2 border-gray-200 focus:border-coral focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-deep">
                    {t("auth.password")}
                  </label>
                  <Link href="/forgot-password" className="text-xs text-coral hover:underline font-semibold">
                    {t("auth.forgotPassword") || "Forgot?"}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-lg border-2 border-gray-200 focus:border-coral focus:ring-0 transition-colors"
                />
              </div>

              {error && (
                <div className="p-4 text-sm text-error bg-red-50 rounded-lg border-l-4 border-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                variant="airbnb"
                size="lg"
                className="w-full mt-6"
              >
                {isLoading ? t("common.loading") : t("auth.login")}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-light">
                {t("auth.noAccount")}{" "}
                <Link href="/register" className="text-coral hover:underline font-semibold">
                  {t("auth.register")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-light">
            🔒 {t("auth.secureLogin") || "Your information is secure and encrypted"}
          </p>
        </div>
      </div>
    </div>
  )
}
