"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import UserMenu from "@/components/shared/UserMenu"
import { useTranslations } from "next-intl"

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
]

const INTERESTS = [
  "travel", "gourmet", "art", "music", "sports", "shopping",
  "fashion", "beauty", "culture", "nightlife", "adventure"
]

const HOBBIES = [
  "reading", "cooking", "photography", "yoga", "dancing",
  "gaming", "movies", "theater", "wine", "coffee"
]

export default function NewMemberPage() {
  const t = useTranslations()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"en" | "zh" | "ja">("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    age: "" as number | "",
    languages: [] as string[],
    location: "",
    occupation: "",
    bio: { en: "", zh: "", ja: "" },
    interests: [] as string[],
    hobbies: [] as string[],
    tier: "STANDARD" as "STANDARD" | "GOLD" | "VIP",
    isPaid: false,
    isActive: true,
    annualIncome: "" as number | "",
    incomeCurrency: "USD" as "USD" | "JPY",
    verificationNotes: "",
    idDocumentUrl: "",
    photos: [] as string[],
  })

  const handleMultilingualChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof typeof prev] as Record<string, string>),
        [activeTab]: value
      }
    }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[]
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...arr, value] }
      }
    })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    setError("")

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/members/upload-temp", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Upload failed")
        const data = await res.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls] }))
    } catch (err) {
      setError("Failed to upload photos")
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handlePhotoMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === formData.photos.length - 1) return

    const newPhotos = [...formData.photos]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newPhotos[index], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[index]]
    setFormData(prev => ({ ...prev, photos: newPhotos }))
  }

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const res = await fetch("/api/admin/members/upload-temp", {
        method: "POST",
        body: uploadFormData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      setFormData(prev => ({ ...prev, idDocumentUrl: data.url }))
    } catch (error) {
      alert("Failed to upload document. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.email || !formData.password || !formData.nickname) {
      setError("Email, password, and nickname are required")
      setLoading(false)
      return
    }

    if (formData.photos.length === 0) {
      setError("At least one photo is required")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create member")
      }

      router.push("/admin/members")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80">
                <span className="text-2xl">🌙</span>
                <span className="font-display text-xl font-bold text-deep">
                  {t("common.appName")} Admin
                </span>
              </Link>
              <span className="text-sm text-gray-400">→</span>
              <Link href="/admin/members" className="text-sm text-gray-600 hover:text-deep">
                Members
              </Link>
              <span className="text-sm text-gray-400">→</span>
              <span className="text-sm font-semibold text-gray-600">Create</span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">Create New Member</h1>
          <p className="text-gray-600">Add a new member profile to the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Profile Information</h2>

            {/* Grid container for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  min="18"
                  max={99}
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : "" }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Roppongi, Shibuya"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value ? parseInt(e.target.value) : "" }))}
                    placeholder="Enter annual income"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  />
                  <select
                    value={formData.incomeCurrency}
                    onChange={(e) => setFormData(prev => ({ ...prev, incomeCurrency: e.target.value as "USD" | "JPY" }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Languages - outside grid */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => handleArrayToggle("languages", lang.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      formData.languages.includes(lang.value)
                        ? "bg-[#FF5A5F] text-white border-[#FF5A5F]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bio - Multilingual */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Bio (Multilingual)</h2>
            <div className="border-b border-gray-200 mb-4">
              <div className="flex gap-4">
                {(["en", "zh", "ja"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`pb-2 px-1 font-semibold transition-colors ${
                      activeTab === lang
                        ? "border-b-2 border-[#FF5A5F] text-[#FF5A5F]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              value={(formData.bio as Record<string, string>)[activeTab]}
              onChange={(e) => handleMultilingualChange("bio", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Interests & Hobbies */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Interests & Hobbies</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleArrayToggle("interests", interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                        formData.interests.includes(interest)
                          ? "bg-[#FF5A5F] text-white border-[#FF5A5F]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#FF5A5F]"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES.map(hobby => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => handleArrayToggle("hobbies", hobby)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                        formData.hobbies.includes(hobby)
                          ? "bg-[#FF5A5F] text-white border-[#FF5A5F]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#FF5A5F]"
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Photos * (At least 1 required)</h2>
            <div className="space-y-4">
              <div>
                <label className="block">
                  <span className="sr-only">Upload photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF5A5F] file:text-white hover:file:bg-[#E61E4D] cursor-pointer"
                  />
                </label>
              </div>
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-[#FF5A5F] text-white text-xs px-2 py-0.5 rounded">
                          Profile
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handlePhotoMove(index, "up")}
                            className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
                          >
                            ←
                          </button>
                        )}
                        {index < formData.photos.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handlePhotoMove(index, "down")}
                            className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
                          >
                            →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePhotoDelete(index)}
                          className="p-1 bg-red-600 rounded text-white hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification Documents */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Verification Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Document
                </label>
                {formData.idDocumentUrl && (
                  <div className="mb-2 p-3 bg-gray-50 rounded border border-gray-200">
                    <a
                      href={formData.idDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#FF5A5F] hover:underline flex items-center gap-2"
                    >
                      <span>📄</span>
                      View uploaded ID document
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleDocumentUpload}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Admin Settings */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-deep mb-4">Admin Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="GOLD">Gold</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))}
                  className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
                  Payment Received
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Member
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.verificationNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, verificationNotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="Internal notes about this member..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Member"}
            </button>
            <Link
              href="/admin/members"
              className="px-6 py-3 border-2 border-deep rounded-lg font-semibold text-deep hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
