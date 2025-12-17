"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
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
    // New checkbox fields
    personalityTypes: [] as string[],
    personalityOther: "",
    appearanceTypes: [] as string[],
    appearanceOther: "",
    serviceTypes: [] as string[],
    serviceOther: "",
    preferredMemberTypes: [] as string[],
    preferredMemberOther: "",
    hobbies: [] as string[],
    hobbiesOther: "",
    holidayStyle: [] as string[],
    holidayStyleOther: "",
    // Keep old fields for backward compatibility
    personality: { en: "", zh: "", ja: "" },
    appearance: { en: "", zh: "", ja: "" },
    serviceStyle: { en: "", zh: "", ja: "" },
    preferredType: { en: "", zh: "", ja: "" },
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bust Size</label>
                <select
                  name="bustSize"
                  value={formData.bustSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              />
            </div>
          </section>

          {/* Bio/About - Multilingual */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">💬 Bio / About (Multilingual)</h2>

            {/* Language Tabs */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About / Self Introduction</label>
              <textarea
                value={(formData.bio as Record<string, string>)[activeTab]}
                onChange={(e) => handleMultilingualChange("bio", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                placeholder={`Enter bio in ${activeTab === "en" ? "English" : activeTab === "zh" ? "Chinese" : "Japanese"}`}
              />
            </div>
          </section>

          {/* Personality Types - Checkboxes */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">✨ 性格 (Personality)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PERSONALITY_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.personalityTypes.includes(option.value)}
                    onChange={() => handleArrayToggle("personalityTypes", option.value)}
                    className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                  />
                  <span className="text-sm">{option.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.personalityTypes.includes('other') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他の詳細</label>
                <textarea
                  name="personalityOther"
                  value={formData.personalityOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の性格タイプについて説明してください"
                />
              </div>
            )}
          </section>

          {/* Appearance Types - Checkboxes */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">👗 見た目の特徴 (Appearance)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {APPEARANCE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.appearanceTypes.includes(option.value)}
                    onChange={() => handleArrayToggle("appearanceTypes", option.value)}
                    className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                  />
                  <span className="text-sm">{option.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.appearanceTypes.includes('other') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他の詳細</label>
                <textarea
                  name="appearanceOther"
                  value={formData.appearanceOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の見た目について説明してください"
                />
              </div>
            )}
          </section>

          {/* Service Types - Checkboxes */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">💝 得意な接客 (Service Style)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SERVICE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.serviceTypes.includes(option.value)}
                    onChange={() => handleArrayToggle("serviceTypes", option.value)}
                    className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                  />
                  <span className="text-sm">{option.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.serviceTypes.includes('other') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他の詳細</label>
                <textarea
                  name="serviceOther"
                  value={formData.serviceOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の接客スタイルについて説明してください"
                />
              </div>
            )}
          </section>

          {/* Preferred Member Types - Checkboxes */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">💖 好きな男性のタイプ (Preferred Member Type)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PREFERRED_MEMBER_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.preferredMemberTypes.includes(option.value)}
                    onChange={() => handleArrayToggle("preferredMemberTypes", option.value)}
                    className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                  />
                  <span className="text-sm">{option.label.ja}</span>
                </label>
              ))}
            </div>
            {formData.preferredMemberTypes.includes('other') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">その他の詳細</label>
                <textarea
                  name="preferredMemberOther"
                  value={formData.preferredMemberOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の好みについて説明してください"
                />
              </div>
            )}
          </section>

          {/* Hobbies & Lifestyle */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-deep mb-4">🎨 趣味 (Hobbies)</h2>

            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ENHANCED_HOBBY_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.hobbies.includes(option.value)}
                      onChange={() => handleArrayToggle("hobbies", option.value)}
                      className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                    />
                    <span className="text-sm">{option.label.ja}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.hobbies.includes('other') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">趣味詳細</label>
                <textarea
                  name="hobbiesOther"
                  value={formData.hobbiesOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の趣味について説明してください"
                />
              </div>
            )}

            <div className="border-t border-gray-200 my-6"></div>

            <h3 className="text-base font-semibold text-deep mb-3">🌴 休日の過ごし方 (Holiday Style)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ENHANCED_HOLIDAY_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.holidayStyle.includes(option.value)}
                    onChange={() => handleArrayToggle("holidayStyle", option.value)}
                    className="w-4 h-4 text-[#FF5A5F] border-gray-300 rounded focus:ring-[#FF5A5F]"
                  />
                  <span className="text-sm">{option.label.ja}</span>
                </label>
              ))}
            </div>

            {formData.holidayStyle.includes('other') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">休日の過ごし方詳細</label>
                <textarea
                  name="holidayStyleOther"
                  value={formData.holidayStyleOther}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                  placeholder="その他の過ごし方について説明してください"
                />
              </div>
            )}
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
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#FF5A5F] text-white text-xs font-medium rounded">
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
                        className="px-3 py-1 bg-[#FF5A5F] text-white rounded text-xs font-medium"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
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
                  className="w-4 h-4 text-[#FF5A5F] rounded border-gray-300 focus:ring-[#FF5A5F]"
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
                  className="w-4 h-4 text-[#FF5A5F] rounded border-gray-300 focus:ring-[#FF5A5F]"
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
              className="px-6 py-3 border-2 border-deep rounded-lg font-semibold text-deep hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Cast"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
