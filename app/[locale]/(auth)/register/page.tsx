"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("member")

  // Member form state
  const [memberData, setMemberData] = useState({
    email: "",
    password: "",
    nickname: "",
    idDocument: null as File | null,
  })

  // Cast form state
  const [castData, setCastData] = useState({
    email: "",
    password: "",
    nickname: "",
    age: "",
    location: "",
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", memberData.email)
      formData.append("password", memberData.password)
      formData.append("nickname", memberData.nickname)
      formData.append("role", "MEMBER")

      if (memberData.idDocument) {
        formData.append("idDocument", memberData.idDocument)
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      router.push("/login?registered=true")
    } catch (error: any) {
      setError(error.message || t("common.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCastSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...castData,
          role: "CAST",
          age: parseInt(castData.age),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      router.push("/login?registered=true")
    } catch (error: any) {
      setError(error.message || t("common.error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-12">
      <Card className="w-full max-w-2xl shadow-airbnb-xl rounded-airbnb-lg border-0 overflow-hidden">
        <CardHeader className="space-y-3 text-center pb-6 pt-8 px-8">
          <CardTitle className="text-4xl font-display font-bold text-deep">
            {t("auth.register")}
          </CardTitle>
          <CardDescription className="text-light text-base">
            {t("common.tagline")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="member">{t("nav.profile")} (Member)</TabsTrigger>
              <TabsTrigger value="cast">{t("cast.profile")} (Cast)</TabsTrigger>
            </TabsList>

            {/* Member Registration */}
            <TabsContent value="member">
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.email")}
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={memberData.email}
                    onChange={(e) => setMemberData({...memberData, email: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.password")}
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={memberData.password}
                    onChange={(e) => setMemberData({...memberData, password: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.nickname")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("auth.nickname")}
                    value={memberData.nickname}
                    onChange={(e) => setMemberData({...memberData, nickname: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("member.uploadId")}
                  </label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setMemberData({...memberData, idDocument: e.target.files?.[0] || null})}
                    className="rounded-airbnb-md h-12 border-2 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-4 text-sm text-error bg-red-50 rounded-airbnb-md border-l-4 border-error">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-airbnb btn-airbnb-primary h-12 text-base rounded-airbnb-md shadow-airbnb-md hover:shadow-airbnb-hover mt-6"
                >
                  {isLoading ? t("common.loading") : t("auth.register")}
                </Button>
              </form>
            </TabsContent>

            {/* Cast Registration */}
            <TabsContent value="cast">
              <form onSubmit={handleCastSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.email")}
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={castData.email}
                    onChange={(e) => setCastData({...castData, email: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.password")}
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={castData.password}
                    onChange={(e) => setCastData({...castData, password: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep">
                    {t("auth.nickname")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("auth.nickname")}
                    value={castData.nickname}
                    onChange={(e) => setCastData({...castData, nickname: e.target.value})}
                    required
                    className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep">
                      {t("cast.age")}
                    </label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={castData.age}
                      onChange={(e) => setCastData({...castData, age: e.target.value})}
                      required
                      className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep">
                      {t("cast.location")}
                    </label>
                    <Input
                      type="text"
                      placeholder="Tokyo, Roppongi"
                      value={castData.location}
                      onChange={(e) => setCastData({...castData, location: e.target.value})}
                      required
                      className="rounded-airbnb-md h-12 border-2 focus:border-coral transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 text-sm text-error bg-red-50 rounded-airbnb-md border-l-4 border-error">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-airbnb btn-airbnb-primary h-12 text-base rounded-airbnb-md shadow-airbnb-md hover:shadow-airbnb-hover mt-6"
                >
                  {isLoading ? t("common.loading") : t("auth.register")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-light">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="text-coral hover:underline font-semibold">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
