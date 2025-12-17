"use client"

import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import type { FilterState } from "./FilterPanel"

interface FilterContentProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableLocations: string[]
  availableInterests: string[]
  resultCount: number
  onApply: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function FilterContent({
  filters,
  onFilterChange,
  availableLocations,
  availableInterests,
  resultCount,
  onApply,
  searchQuery,
  onSearchChange,
}: FilterContentProps) {
  const t = useTranslations()

  const handleAgeChange = (type: "min" | "max", value: number) => {
    const newRange: [number, number] =
      type === "min" ? [value, filters.ageRange[1]] : [filters.ageRange[0], value]
    onFilterChange({ ...filters, ageRange: newRange })
  }

  const toggleLanguage = (lang: string) => {
    const newLanguages = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang]
    onFilterChange({ ...filters, languages: newLanguages })
  }

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter((i) => i !== interest)
      : [...filters.interests, interest]
    onFilterChange({ ...filters, interests: newInterests })
  }

  const languageOptions = [
    { code: "en", label: "English", emoji: "🇺🇸" },
    { code: "zh", label: "中文", emoji: "🇨🇳" },
    { code: "ja", label: "日本語", emoji: "🇯🇵" },
  ]

  const clearAllFilters = () => {
    onFilterChange({
      ageRange: [18, 35],
      languages: [],
      location: "",
      interests: [],
    })
  }

  const hasActiveFilters =
    filters.ageRange[0] !== 18 ||
    filters.ageRange[1] !== 35 ||
    filters.languages.length > 0 ||
    filters.location !== "" ||
    filters.interests.length > 0

  return (
    <div className="space-y-6 pb-20">
      {/* Search Bar Section */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-deep flex items-center gap-2">
          🔍 {t("browse.search") || "Search"}
        </h4>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("browse.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-base"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Age Range Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-deep flex items-center gap-2">
            🎂 {t("browse.filterAge")}
          </h4>
          {(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35) && (
            <span className="text-xs font-medium text-teal">
              {filters.ageRange[0]}-{filters.ageRange[1]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-light mb-1.5 block">
              {t("browse.minAge") || "Min"}
            </label>
            <input
              type="number"
              min="18"
              max="35"
              value={filters.ageRange[0]}
              onChange={(e) =>
                handleAgeChange("min", parseInt(e.target.value) || 18)
              }
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-base"
            />
          </div>
          <span className="text-gray-400 mt-6">–</span>
          <div className="flex-1">
            <label className="text-xs text-light mb-1.5 block">
              {t("browse.maxAge") || "Max"}
            </label>
            <input
              type="number"
              min="18"
              max="35"
              value={filters.ageRange[1]}
              onChange={(e) =>
                handleAgeChange("max", parseInt(e.target.value) || 35)
              }
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-base"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Languages Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-deep flex items-center gap-2">
            🗣️ {t("browse.filterLanguages")}
          </h4>
          {filters.languages.length > 0 && (
            <span className="text-xs font-medium text-teal">
              {filters.languages.length}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {languageOptions.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.languages.includes(lang.code)}
                onChange={() => toggleLanguage(lang.code)}
                className="w-5 h-5 text-teal border-gray-300 rounded focus:ring-teal"
              />
              <span className="text-2xl">{lang.emoji}</span>
              <span className="text-base font-medium text-deep">
                {lang.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-deep flex items-center gap-2">
            📍 {t("browse.filterLocation")}
          </h4>
          {filters.location && (
            <span className="text-xs font-medium text-teal">
              {filters.location}
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <input
              type="radio"
              name="location"
              checked={filters.location === ""}
              onChange={() => onFilterChange({ ...filters, location: "" })}
              className="w-5 h-5 text-teal border-gray-300 focus:ring-teal"
            />
            <span className="text-base font-medium text-deep">
              {t("browse.allLocations")}
            </span>
          </label>
          {availableLocations.map((location) => (
            <label
              key={location}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="location"
                checked={filters.location === location}
                onChange={() => onFilterChange({ ...filters, location })}
                className="w-5 h-5 text-teal border-gray-300 focus:ring-teal"
              />
              <span className="text-base font-medium text-deep">
                {location}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      {availableInterests.length > 0 && (
        <div className="border-t border-gray-200" />
      )}

      {/* Interests Section */}
      {availableInterests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-deep flex items-center gap-2">
              ✨ {t("browse.filterInterests")}
            </h4>
            {filters.interests.length > 0 && (
              <span className="text-xs font-medium text-teal">
                {filters.interests.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.interests.includes(interest)
                    ? "bg-[#FF5A5F] text-white shadow-sm"
                    : "bg-gray-100 text-deep hover:bg-gray-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar with Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4">
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-light hover:text-deep transition-colors underline"
          >
            {t("browse.clearAll") || "Clear all"}
          </button>
        )}
        <button
          onClick={onApply}
          className="flex-1 bg-[#FF5A5F] hover:bg-[#E61E4D] text-white rounded-full px-6 py-3.5 font-semibold hover:shadow-lg transition-all"
        >
          {t("browse.showResults") || "Show"} {resultCount}{" "}
          {resultCount === 1
            ? t("browse.companion") || "companion"
            : t("browse.companions") || "companions"}
        </button>
      </div>
    </div>
  )
}
