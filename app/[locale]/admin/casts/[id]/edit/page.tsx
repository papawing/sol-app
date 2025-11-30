"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  PERSONALITY_OPTIONS,
  APPEARANCE_OPTIONS,
  SERVICE_OPTIONS,
  PREFERRED_MEMBER_OPTIONS,
  ENHANCED_HOBBY_OPTIONS,
  ENHANCED_HOLIDAY_OPTIONS,
} from "@/lib/cast-options"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

const ENGLISH_LEVELS = ["Native", "Fluent", "Conversational", "Basic", "None"]

interface CastData {
  id: string
  user: {
    id: string
    email: string
    nickname: string
    verificationStatus: string
  }
  age: number
  birthday?: string
  location: string
  languages: string[]
  bustSize?: string
  height?: number
  weight?: number
  bodyMeasurements?: string
  englishLevel?: string
  bio?: { en?: string; zh?: string; ja?: string }
  personality?: { en?: string; zh?: string; ja?: string }
  appearance?: { en?: string; zh?: string; ja?: string }
  serviceStyle?: { en?: string; zh?: string; ja?: string }
  preferredType?: { en?: string; zh?: string; ja?: string }
  // New checkbox fields
  personalityTypes?: string[]
  personalityOther?: string
  appearanceTypes?: string[]
  appearanceOther?: string
  serviceTypes?: string[]
  serviceOther?: string
  preferredMemberTypes?: string[]
  preferredMemberOther?: string
  hobbiesOther?: string
  holidayStyleOther?: string
  hobbies: string[]
  holidayStyle: string[]
  interests: string[]
  availabilityNotes?: string
  tierClassification: string
  isActive: boolean
  isFeatured: boolean
  photos: { id: string; photoUrl: string; isVerified: boolean; displayOrder: number }[]
}

export default function EditCastPage() {
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()
  const castId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"en" | "zh" | "ja">("en")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [formData, setFormData] = useState({
    nickname: "",
    age: "",
    birthday: "",
    location: "",
    languages: [] as string[],
    bustSize: "",
    height: "",
    weight: "",
    bodyMeasurements: "",
    englishLevel: "",
    bio: { en: "", zh: "", ja: "" },
    personality: { en: "", zh: "", ja: "" },
    appearance: { en: "", zh: "", ja: "" },
    serviceStyle: { en: "", zh: "", ja: "" },
    preferredType: { en: "", zh: "", ja: "" },
    // New checkbox fields
    personalityTypes: [] as string[],
    personalityOther: "",
    appearanceTypes: [] as string[],
    appearanceOther: "",
    serviceTypes: [] as string[],
    serviceOther: "",
    preferredMemberTypes: [] as string[],
    preferredMemberOther: "",
    hobbiesOther: "",
    holidayStyleOther: "",
    hobbies: [] as string[],
    holidayStyle: [] as string[],
    interests: [] as string[],
    availabilityNotes: "",
    tierClassification: "STANDARD",
    isActive: true,
    isFeatured: false,
  })

  const [photos, setPhotos] = useState<CastData["photos"]>([])

  useEffect(() => {
    fetchCast()
  }, [castId])

  const fetchCast = async () => {
    try {
      const res = await fetch(`/api/admin/casts/${castId}`)
      if (!res.ok) throw new Error("Failed to fetch cast")
      const data = await res.json()
      const cast: CastData = data.cast

      setEmail(cast.user.email)
      setFormData({
        nickname: cast.user.nickname,
        age: String(cast.age),
        birthday: cast.birthday ? cast.birthday.split("T")[0] : "",
        location: cast.location,
        languages: cast.languages,
        bustSize: cast.bustSize || "",
        height: cast.height ? String(cast.height) : "",
        weight: cast.weight ? String(cast.weight) : "",
        bodyMeasurements: cast.bodyMeasurements || "",
        englishLevel: cast.englishLevel || "",
        bio: { en: "", zh: "", ja: "", ...(cast.bio as object || {}) },
        personality: { en: "", zh: "", ja: "", ...(cast.personality as object || {}) },
        appearance: { en: "", zh: "", ja: "", ...(cast.appearance as object || {}) },
        serviceStyle: { en: "", zh: "", ja: "", ...(cast.serviceStyle as object || {}) },
        preferredType: { en: "", zh: "", ja: "", ...(cast.preferredType as object || {}) },
        // New checkbox fields
        personalityTypes: cast.personalityTypes || [],
        personalityOther: cast.personalityOther || "",
        appearanceTypes: cast.appearanceTypes || [],
        appearanceOther: cast.appearanceOther || "",
        serviceTypes: cast.serviceTypes || [],
        serviceOther: cast.serviceOther || "",
        preferredMemberTypes: cast.preferredMemberTypes || [],
        preferredMemberOther: cast.preferredMemberOther || "",
        hobbiesOther: cast.hobbiesOther || "",
        holidayStyleOther: cast.holidayStyleOther || "",
        hobbies: cast.hobbies,
        holidayStyle: cast.holidayStyle,
        interests: cast.interests,
        availabilityNotes: cast.availabilityNotes || "",
        tierClassification: cast.tierClassification,
        isActive: cast.isActive,
        isFeatured: cast.isFeatured,
      })
      setPhotos(cast.photos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cast")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleMultilingualChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field as keyof typeof prev] as Record<string, string>), [activeTab]: value }
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

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`/api/admin/casts/${castId}/photos/upload`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Upload failed")
        }
      }
      fetchCast() // Refresh to get new photos
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo")
    } finally {
      setIsUploading(false)
      e.target.value = "" // Reset input
    }
  }

  const handlePhotoDelete = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return
    try {
      const res = await fetch(`/api/admin/casts/${castId}/photos/${photoId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId))
      }
    } catch (err) {
      console.error("Failed to delete photo:", err)
    }
  }

  const handlePhotoVerify = async (photoId: string, isVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/casts/${castId}/photos/${photoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified }),
      })
      if (res.ok) {
        setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, isVerified } : p))
      }
    } catch (err) {
      console.error("Failed to update photo:", err)
    }
  }

  const handlePhotoMove = async (photoId: string, direction: "up" | "down") => {
    const sortedPhotos = [...photos].sort((a, b) => a.displayOrder - b.displayOrder)
    const currentIndex = sortedPhotos.findIndex(p => p.id === photoId)
    if (currentIndex === -1) return
    if (direction === "up" && currentIndex === 0) return
    if (direction === "down" && currentIndex === sortedPhotos.length - 1) return

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const newPhotos = [...sortedPhotos]
    const tempOrder = newPhotos[currentIndex].displayOrder
    newPhotos[currentIndex].displayOrder = newPhotos[swapIndex].displayOrder
    newPhotos[swapIndex].displayOrder = tempOrder

    // Swap positions in array
    ;[newPhotos[currentIndex], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[currentIndex]]

    setPhotos(newPhotos)

    // Save to server
    try {
      await fetch(`/api/admin/casts/${castId}/photos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoOrders: newPhotos.map((p, i) => ({ photoId: p.id, displayOrder: i }))
        }),
      })
    } catch (err) {
      console.error("Failed to reorder photos:", err)
    }
  }

  const handleSetFeatured = async (photoId: string) => {
    const sortedPhotos = [...photos].sort((a, b) => a.displayOrder - b.displayOrder)
    const currentIndex = sortedPhotos.findIndex(p => p.id === photoId)
    if (currentIndex === -1 || currentIndex === 0) return

    // Move selected photo to front
    const photo = sortedPhotos.splice(currentIndex, 1)[0]
    sortedPhotos.unshift(photo)

    // Update display orders
    const newPhotos = sortedPhotos.map((p, i) => ({ ...p, displayOrder: i }))
    setPhotos(newPhotos)

    // Save to server
    try {
      await fetch(`/api/admin/casts/${castId}/photos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoOrders: newPhotos.map((p, i) => ({ photoId: p.id, displayOrder: i }))
        }),
      })
    } catch (err) {
      console.error("Failed to set featured photo:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/casts/${castId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update cast")
      }

      router.push(`/${locale}/admin/casts`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this cast? This action cannot be undone.")) return

    try {
      const res = await fetch(`/api/admin/casts/${castId}`, { method: "DELETE" })
      if (res.ok) {
        router.push(`/${locale}/admin/casts`)
      } else {
        throw new Error("Failed to delete cast")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete cast")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/casts" className="text-gray-500 hover:text-gray-700">
                ← Back
              </Link>
              <span className="font-semibold text-deep">Edit Cast: {formData.nickname}</span>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              Delete Cast
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Account Info */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Min 6 characters. Leave empty to keep current password.</p>
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min={18}
                  max={99}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleArrayToggle("languages", lang.code)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      formData.languages.includes(lang.code)
                        ? "bg-[#4A9B8E] text-white border-[#4A9B8E]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Physical Attributes */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Physical Attributes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bust Size</label>
                <select
                  name="bustSize"
                  value={formData.bustSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                >
                  <option value="">Select</option>
                  {["A", "B", "C", "D", "E", "F", "G"].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Measurements</label>
                <input
                  type="text"
                  name="bodyMeasurements"
                  value={formData.bodyMeasurements}
                  onChange={handleChange}
                  placeholder="e.g., 34-24-35"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Level</label>
                <select
                  name="englishLevel"
                  value={formData.englishLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                >
                  <option value="">Select</option>
                  {ENGLISH_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Bio/About Section */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Bio / About</h2>

            <div className="flex border-b border-gray-200 mb-4">
              {(["en", "zh", "ja"] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === lang
                      ? "border-[#4A9B8E] text-[#4A9B8E]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={(formData.bio as Record<string, string>)[activeTab] || ""}
                onChange={(e) => handleMultilingualChange("bio", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                placeholder="Introduce yourself to members..."
              />
            </div>
          </section>

          {/* Personality Types */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">性格 (Personality)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {PERSONALITY_OPTIONS.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.personalityTypes.includes(type.value)
                      ? "border-[#4A9B8E] bg-[#4A9B8E]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.personalityTypes.includes(type.value)}
                    onChange={() => handleArrayToggle("personalityTypes", type.value)}
                    className="w-4 h-4 text-[#4A9B8E] border-gray-300 rounded focus:ring-[#4A9B8E]"
                  />
                  <span className="text-sm font-medium text-gray-700">{type.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.personalityTypes.includes("other") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                <input
                  type="text"
                  value={formData.personalityOther}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalityOther: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                  placeholder="その他の性格を入力してください"
                />
              </div>
            )}
          </section>

          {/* Appearance Types */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">見た目の特徴 (Appearance)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {APPEARANCE_OPTIONS.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.appearanceTypes.includes(type.value)
                      ? "border-[#4A9B8E] bg-[#4A9B8E]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.appearanceTypes.includes(type.value)}
                    onChange={() => handleArrayToggle("appearanceTypes", type.value)}
                    className="w-4 h-4 text-[#4A9B8E] border-gray-300 rounded focus:ring-[#4A9B8E]"
                  />
                  <span className="text-sm font-medium text-gray-700">{type.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.appearanceTypes.includes("other") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                <input
                  type="text"
                  value={formData.appearanceOther}
                  onChange={(e) => setFormData(prev => ({ ...prev, appearanceOther: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                  placeholder="その他の見た目の特徴を入力してください"
                />
              </div>
            )}
          </section>

          {/* Service Types */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">得意な接客 (Service Style)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {SERVICE_OPTIONS.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.serviceTypes.includes(type.value)
                      ? "border-[#4A9B8E] bg-[#4A9B8E]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.serviceTypes.includes(type.value)}
                    onChange={() => handleArrayToggle("serviceTypes", type.value)}
                    className="w-4 h-4 text-[#4A9B8E] border-gray-300 rounded focus:ring-[#4A9B8E]"
                  />
                  <span className="text-sm font-medium text-gray-700">{type.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.serviceTypes.includes("other") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                <input
                  type="text"
                  value={formData.serviceOther}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceOther: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                  placeholder="その他の得意な接客を入力してください"
                />
              </div>
            )}
          </section>

          {/* Preferred Member Types */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">好きな男性のタイプ (Preferred Member Type)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {PREFERRED_MEMBER_OPTIONS.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.preferredMemberTypes.includes(type.value)
                      ? "border-[#4A9B8E] bg-[#4A9B8E]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredMemberTypes.includes(type.value)}
                    onChange={() => handleArrayToggle("preferredMemberTypes", type.value)}
                    className="w-4 h-4 text-[#4A9B8E] border-gray-300 rounded focus:ring-[#4A9B8E]"
                  />
                  <span className="text-sm font-medium text-gray-700">{type.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.preferredMemberTypes.includes("other") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                <input
                  type="text"
                  value={formData.preferredMemberOther}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredMemberOther: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                  placeholder="その他の好きな男性のタイプを入力してください"
                />
              </div>
            )}
          </section>

          {/* Lifestyle */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Lifestyle</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">趣味 (Hobbies)</label>
              <div className="flex flex-wrap gap-2">
                {ENHANCED_HOBBY_OPTIONS.map(hobby => (
                  <button
                    key={hobby.value}
                    type="button"
                    onClick={() => handleArrayToggle("hobbies", hobby.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      formData.hobbies.includes(hobby.value)
                        ? "bg-[#4A9B8E] text-white border-[#4A9B8E]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {hobby.label.ja}
                  </button>
                ))}
              </div>
              {formData.hobbies.includes("other") && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                  <input
                    type="text"
                    value={formData.hobbiesOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, hobbiesOther: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                    placeholder="その他の趣味を入力してください"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">休日の過ごし方 (Holiday Style)</label>
              <div className="flex flex-wrap gap-2">
                {ENHANCED_HOLIDAY_OPTIONS.map(style => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleArrayToggle("holidayStyle", style.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      formData.holidayStyle.includes(style.value)
                        ? "bg-[#4A9B8E] text-white border-[#4A9B8E]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {style.label.ja}
                  </button>
                ))}
              </div>
              {formData.holidayStyle.includes("other") && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">その他 (Other)</label>
                  <input
                    type="text"
                    value={formData.holidayStyleOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, holidayStyleOther: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                    placeholder="その他の休日の過ごし方を入力してください"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Photos</h2>
            <p className="text-sm text-gray-500 mb-4">First photo is the featured/primary photo shown in listings.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[...photos].sort((a, b) => a.displayOrder - b.displayOrder).map((photo, index) => (
                <div key={photo.id} className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={photo.photoUrl} alt="Cast photo" className="w-full h-full object-cover" />

                  {/* Featured badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#4A9B8E] text-white text-xs font-medium rounded">
                      Featured
                    </div>
                  )}

                  {/* Verified badge */}
                  {photo.isVerified && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}

                  {/* Order number */}
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-black/70 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Hover controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {/* Move buttons */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handlePhotoMove(photo.id, "up")}
                        disabled={index === 0}
                        className="w-8 h-8 bg-white text-gray-700 rounded text-sm font-medium disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePhotoMove(photo.id, "down")}
                        disabled={index === photos.length - 1}
                        className="w-8 h-8 bg-white text-gray-700 rounded text-sm font-medium disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>

                    {/* Set as featured */}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(photo.id)}
                        className="px-3 py-1 bg-[#4A9B8E] text-white rounded text-xs font-medium"
                      >
                        Set Featured
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePhotoVerify(photo.id, !photo.isVerified)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        photo.isVerified ? "bg-green-500 text-white" : "bg-white text-gray-700"
                      }`}
                    >
                      {photo.isVerified ? "✓ Verified" : "Verify"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <label className={`aspect-[4/5] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#4A9B8E] hover:text-[#4A9B8E] transition-colors cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <span className="text-2xl mb-1 animate-spin">⏳</span>
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-1">+</span>
                    <span className="text-sm">Upload Photos</span>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Admin Settings */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Admin Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier Classification</label>
                <select
                  name="tierClassification"
                  value={formData.tierClassification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A9B8E] focus:border-transparent"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="HIGH_CLASS">High Class</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4A9B8E] rounded border-gray-300 focus:ring-[#4A9B8E]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4A9B8E] rounded border-gray-300 focus:ring-[#4A9B8E]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Featured
                </label>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/admin/casts"
              className="px-6 py-3 border-2 border-deep rounded-lg font-semibold text-deep hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A9B8E] to-[#2D7A6E] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
