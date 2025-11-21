"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

const ENGLISH_LEVELS = ["Native", "Fluent", "Conversational", "Basic", "None"]

const HOBBIES = [
  "gourmet", "beauty", "music", "travel", "fashion", "art",
  "sports", "reading", "movies", "gaming", "cooking", "photography"
]

const HOLIDAY_STYLES = [
  "home", "cafe", "shopping", "travel", "outdoor", "spa", "dining"
]

export default function CreateCastPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"en" | "zh" | "ja">("en")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    hobbies: [] as string[],
    holidayStyle: [] as string[],
    interests: [] as string[],
    availabilityNotes: "",
    tierClassification: "STANDARD",
    isActive: true,
    isFeatured: false,
    photos: [] as string[],
  })

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
        const uploadForm = new FormData()
        uploadForm.append("file", file)

        const res = await fetch("/api/admin/casts/upload-temp", {
          method: "POST",
          body: uploadForm,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Upload failed")
        }

        const { url } = await res.json()
        setFormData(prev => ({ ...prev, photos: [...prev.photos, url] }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handlePhotoRemove = (index: number) => {
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

  const handleSetFeatured = (index: number) => {
    if (index === 0) return
    const newPhotos = [...formData.photos]
    const photo = newPhotos.splice(index, 1)[0]
    newPhotos.unshift(photo)
    setFormData(prev => ({ ...prev, photos: newPhotos }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/admin/casts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create cast")
      }

      router.push(`/${locale}/admin/casts`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
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
              <span className="font-semibold text-deep">Create New Cast</span>
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname *</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min={18}
                  max={99}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tokyo, Roppongi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
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
                        ? "bg-[#FF385C] text-white border-[#FF385C]"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min={140}
                  max={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min={30}
                  max={150}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bust Size</label>
                <select
                  name="bustSize"
                  value={formData.bustSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                >
                  <option value="">Select</option>
                  {["A", "B", "C", "D", "E", "F", "G"].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Level</label>
                <select
                  name="englishLevel"
                  value={formData.englishLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                >
                  <option value="">Select</option>
                  {ENGLISH_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Measurements (optional)</label>
              <input
                type="text"
                name="bodyMeasurements"
                value={formData.bodyMeasurements}
                onChange={handleChange}
                placeholder="e.g., B86 W58 H88"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
            </div>
          </section>

          {/* Multilingual Content */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Profile Content (Multilingual)</h2>

            {/* Language Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              {(["en", "zh", "ja"] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === lang
                      ? "border-[#FF385C] text-[#FF385C]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {lang === "en" ? "English" : lang === "zh" ? "中文" : "日本語"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
                <textarea
                  value={(formData.bio as Record<string, string>)[activeTab]}
                  onChange={(e) => handleMultilingualChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  placeholder={`Enter bio in ${activeTab === "en" ? "English" : activeTab === "zh" ? "Chinese" : "Japanese"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
                <textarea
                  value={(formData.personality as Record<string, string>)[activeTab]}
                  onChange={(e) => handleMultilingualChange("personality", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appearance</label>
                <textarea
                  value={(formData.appearance as Record<string, string>)[activeTab]}
                  onChange={(e) => handleMultilingualChange("appearance", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Style</label>
                <textarea
                  value={(formData.serviceStyle as Record<string, string>)[activeTab]}
                  onChange={(e) => handleMultilingualChange("serviceStyle", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Type</label>
                <textarea
                  value={(formData.preferredType as Record<string, string>)[activeTab]}
                  onChange={(e) => handleMultilingualChange("preferredType", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Lifestyle */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Lifestyle</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
              <div className="flex flex-wrap gap-2">
                {HOBBIES.map(hobby => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleArrayToggle("hobbies", hobby)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors capitalize ${
                      formData.hobbies.includes(hobby)
                        ? "bg-[#FF385C] text-white border-[#FF385C]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Style</label>
              <div className="flex flex-wrap gap-2">
                {HOLIDAY_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleArrayToggle("holidayStyle", style)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors capitalize ${
                      formData.holidayStyle.includes(style)
                        ? "bg-[#FF385C] text-white border-[#FF385C]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">Photos</h2>
            <p className="text-sm text-gray-500 mb-4">First photo is the featured/primary photo shown in listings.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.photos.map((url, index) => (
                <div key={index} className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />

                  {/* Featured badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#FF385C] text-white text-xs font-medium rounded">
                      Featured
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
                        onClick={() => handlePhotoMove(index, "up")}
                        disabled={index === 0}
                        className="w-8 h-8 bg-white text-gray-700 rounded text-sm font-medium disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePhotoMove(index, "down")}
                        disabled={index === formData.photos.length - 1}
                        className="w-8 h-8 bg-white text-gray-700 rounded text-sm font-medium disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>

                    {/* Set as featured */}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(index)}
                        className="px-3 py-1 bg-[#FF385C] text-white rounded text-xs font-medium"
                      >
                        Set Featured
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePhotoRemove(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <label className={`aspect-[4/5] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF385C] hover:text-[#FF385C] transition-colors cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
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
                  className="w-4 h-4 text-[#FF385C] rounded border-gray-300 focus:ring-[#FF385C]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible to members)
                </label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF385C] rounded border-gray-300 focus:ring-[#FF385C]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Featured (shown in featured section)
                </label>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/admin/casts"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Cast"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
