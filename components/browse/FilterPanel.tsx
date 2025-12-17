"use client"

import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface FilterState {
  ageRange: [number, number]
  languages: string[]
  location: string
  interests: string[]
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableLocations: string[]
  availableInterests: string[]
}

export default function FilterPanel({
  filters,
  onFilterChange,
  availableLocations,
  availableInterests,
}: FilterPanelProps) {
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

  // Check if filter is active
  const hasAgeFilter = filters.ageRange[0] !== 18 || filters.ageRange[1] !== 35
  const hasLanguageFilter = filters.languages.length > 0
  const hasLocationFilter = filters.location !== ""
  const hasInterestFilter = filters.interests.length > 0

  return (
    <div className="mb-4 md:mb-6">
      {/* Horizontal Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Age Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition-all ${
                hasAgeFilter
                  ? "border-teal bg-teal/5 text-teal hover:bg-teal/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              🎂 {t("browse.filterAge")}
              {hasAgeFilter && `: ${filters.ageRange[0]}-${filters.ageRange[1]}`}
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-deep">
                {t("browse.ageRange")}
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-light mb-1 block">Min</label>
                  <input
                    type="number"
                    min="18"
                    max="35"
                    value={filters.ageRange[0]}
                    onChange={(e) =>
                      handleAgeChange("min", parseInt(e.target.value) || 18)
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-sm"
                  />
                </div>
                <span className="text-gray-400 mt-6">–</span>
                <div className="flex-1">
                  <label className="text-xs text-light mb-1 block">Max</label>
                  <input
                    type="number"
                    min="18"
                    max="35"
                    value={filters.ageRange[1]}
                    onChange={(e) =>
                      handleAgeChange("max", parseInt(e.target.value) || 35)
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-teal focus:ring-0 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Languages Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition-all ${
                hasLanguageFilter
                  ? "border-teal bg-teal/5 text-teal hover:bg-teal/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              🗣️ {t("browse.filterLanguages")}
              {hasLanguageFilter && ` (${filters.languages.length})`}
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-deep">
                {t("browse.languages")}
              </h4>
              <div className="space-y-2">
                {languageOptions.map((lang) => (
                  <label
                    key={lang.code}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(lang.code)}
                      onChange={() => toggleLanguage(lang.code)}
                      className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                    />
                    <span className="text-xl">{lang.emoji}</span>
                    <span className="text-sm font-medium text-deep">
                      {lang.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition-all ${
                hasLocationFilter
                  ? "border-teal bg-teal/5 text-teal hover:bg-teal/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              📍 {t("browse.filterLocation")}
              {hasLocationFilter && `: ${filters.location}`}
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-deep">
                {t("browse.location")}
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="location"
                    checked={filters.location === ""}
                    onChange={() =>
                      onFilterChange({ ...filters, location: "" })
                    }
                    className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                  />
                  <span className="text-sm font-medium text-deep">
                    {t("browse.allLocations")}
                  </span>
                </label>
                {availableLocations.map((location) => (
                  <label
                    key={location}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      name="location"
                      checked={filters.location === location}
                      onChange={() =>
                        onFilterChange({ ...filters, location })
                      }
                      className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                    />
                    <span className="text-sm font-medium text-deep">
                      {location}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Interests Filter */}
        {availableInterests.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition-all ${
                  hasInterestFilter
                    ? "border-teal bg-teal/5 text-teal hover:bg-teal/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                ✨ {t("browse.filterInterests")}
                {hasInterestFilter && ` (${filters.interests.length})`}
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-deep">
                  {t("browse.interests")}
                </h4>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Note: Apply/Clear buttons removed - filters apply instantly! */}
    </div>
  )
}
