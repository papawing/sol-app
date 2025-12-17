"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"

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

interface MemberData {
  id: string
  user: {
    id: string
    email: string
    nickname: string
    verificationStatus: string
  }
  age?: number
  languages: string[]
  location?: string
  occupation?: string
  bio?: { en?: string; zh?: string; ja?: string }
  interests: string[]
  hobbies: string[]
  tier: string
  isPaid: boolean
  isActive: boolean
  annualIncome?: number
  incomeCurrency?: string
  verificationNotes?: string
  idDocumentUrl?: string
  incomeProofUrl?: string
  photos: { id: string; photoUrl: string; isVerified: boolean; displayOrder: number }[]
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const locale = useLocale()
  const memberId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"en" | "zh" | "ja">("en")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [formData, setFormData] = useState({
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
    incomeProofUrl: "",
  })

  const [photos, setPhotos] = useState<MemberData["photos"]>([])

  useEffect(() => {
    fetchMember()
  }, [memberId])

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}`)
      if (!res.ok) throw new Error("Failed to fetch member")
      const data = await res.json()
      const member: MemberData = data.member

      setEmail(member.user.email)
      setFormData({
        nickname: member.user.nickname,
        age: member.age || "",
        languages: member.languages,
        location: member.location || "",
        occupation: member.occupation || "",
        bio: { en: "", zh: "", ja: "", ...(member.bio as object || {}) },
        interests: member.interests,
        hobbies: member.hobbies,
        tier: member.tier as "STANDARD" | "GOLD" | "VIP",
        isPaid: member.isPaid,
        isActive: member.isActive,
        annualIncome: member.annualIncome || "",
        incomeCurrency: (member.incomeCurrency || "USD") as "USD" | "JPY",
        verificationNotes: member.verificationNotes || "",
        idDocumentUrl: member.idDocumentUrl || "",
      })
      setPhotos(member.photos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load member")
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

        const res = await fetch(`/api/admin/members/${memberId}/photos/upload`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Upload failed")
        }
      }
      fetchMember() // Refresh to get new photos
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
      const res = await fetch(`/api/admin/members/${memberId}/photos/${photoId}`, {
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
      const res = await fetch(`/api/admin/members/${memberId}/photos/${photoId}`, {
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
      await fetch(`/api/admin/members/${memberId}/photos`, {
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

  const handleSetProfile = async (photoId: string) => {
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
      await fetch(`/api/admin/members/${memberId}/photos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoOrders: newPhotos.map((p, i) => ({ photoId: p.id, displayOrder: i }))
        }),
      })
    } catch (err) {
      console.error("Failed to set profile photo:", err)
    }
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`/api/admin/members/upload-temp`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setFormData(prev => ({ ...prev, idDocumentUrl: data.url }))
    } catch (err) {
      setError("Failed to upload document")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleDocumentDelete = () => {
    setFormData(prev => ({ ...prev, idDocumentUrl: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update member")
      }

      router.push(`/${locale}/admin/members`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this member? This action cannot be undone.")) return

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, { method: "DELETE" })
      if (res.ok) {
        router.push(`/${locale}/admin/members`)
      } else {
        throw new Error("Failed to delete member")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete member")
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
              <Link href="/admin/members" className="text-gray-500 hover:text-gray-700">
                ← Back
              </Link>
              <span className="font-semibold text-deep">Edit Member: {formData.nickname}</span>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              Delete Member
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : "" }))}
                  min={18}
                  max={99}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
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
          </section>

      {/* Bio */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Bio</h2>

            <div className="flex border-b border-gray-200 mb-4">
              {(["en", "zh", "ja"] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === lang
                      ? "border-[#FF5A5F] text-[#FF5A5F]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                </button>
              ))}
            </div>

            <textarea
              value={(formData.bio as Record<string, string>)[activeTab] || ""}
              onChange={(e) => handleMultilingualChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </section>

          {/* Interests & Hobbies */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Interests & Hobbies</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleArrayToggle("interests", interest)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors capitalize ${
                      formData.interests.includes(interest)
                        ? "bg-[#FF5A5F] text-white border-[#FF5A5F]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
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
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors capitalize ${
                      formData.hobbies.includes(hobby)
                        ? "bg-[#FF5A5F] text-white border-[#FF5A5F]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Photos</h2>
            <p className="text-sm text-gray-500 mb-4">First photo is the profile photo shown in listings.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[...photos].sort((a, b) => a.displayOrder - b.displayOrder).map((photo, index) => (
                <div key={photo.id} className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={photo.photoUrl} alt="Member photo" className="w-full h-full object-cover" />

                  {/* Profile badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#FF5A5F] text-white text-xs font-medium rounded">
                      Profile
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

                    {/* Set as profile */}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetProfile(photo.id)}
                        className="px-3 py-1 bg-[#FF5A5F] text-white rounded text-xs font-medium"
                      >
                        Set Profile
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
              <label className={`aspect-[4/5] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
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

          {/* Documents */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Verification Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Document</label>
                {formData.idDocumentUrl && (
                  <div className="mb-2 p-3 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
                    <a
                      href={formData.idDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#FF5A5F] hover:underline flex items-center gap-2"
                    >
                      <span>📄</span>
                      View current ID document
                    </a>
                    <button
                      type="button"
                      onClick={handleDocumentDelete}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleDocumentUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Admin Settings */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Admin Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
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
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF5A5F] rounded border-gray-300 focus:ring-[#FF5A5F]"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
                  Payment Received
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF5A5F] rounded border-gray-300 focus:ring-[#FF5A5F]"
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
                  name="verificationNotes"
                  value={formData.verificationNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="Internal notes about this member..."
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/admin/members"
              className="px-6 py-3 border-2 border-deep rounded-lg font-semibold text-deep hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
