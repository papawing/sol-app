"use client"

import { SlidersHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

interface FilterButtonProps {
  onClick: () => void
  activeFilterCount: number
}

export default function FilterButton({
  onClick,
  activeFilterCount,
}: FilterButtonProps) {
  const t = useTranslations()

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-coral hover:bg-deep-coral text-white rounded-full shadow-airbnb-lg hover:shadow-airbnb-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 px-5 py-3.5 font-medium"
      aria-label={t("browse.filters")}
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span className="text-sm">
        {t("browse.filters")}
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-white/30 rounded-full px-2 py-0.5 text-xs font-semibold">
            {activeFilterCount}
          </span>
        )}
      </span>
    </button>
  )
}
