import { useTranslations } from "next-intl";
import { getLocalizedText } from "@/lib/cast-helpers";
import type { LocalizedText } from "@/types/cast";
import {
  PERSONALITY_OPTIONS,
  APPEARANCE_OPTIONS,
  SERVICE_OPTIONS,
  PREFERRED_MEMBER_OPTIONS,
} from "@/lib/cast-options";
import { Badge } from "@/components/ui/badge";

type PersonalitySectionProps = {
  // New checkbox fields
  personalityTypes?: string[];
  personalityOther?: string | null;
  appearanceTypes?: string[];
  appearanceOther?: string | null;
  serviceTypes?: string[];
  serviceOther?: string | null;
  preferredMemberTypes?: string[];
  preferredMemberOther?: string | null;
  // Legacy fields (backward compatible)
  personality?: LocalizedText | string | null;
  appearance?: LocalizedText | string | null;
  serviceStyle?: LocalizedText | string | null;
  preferredType?: LocalizedText | string | null;
  locale: string;
};

export default function PersonalitySection({
  personalityTypes,
  personalityOther,
  appearanceTypes,
  appearanceOther,
  serviceTypes,
  serviceOther,
  preferredMemberTypes,
  preferredMemberOther,
  personality,
  appearance,
  serviceStyle,
  preferredType,
  locale,
}: PersonalitySectionProps) {
  const t = useTranslations();

  // Helper to get translated label
  const getLabel = (value: string, options: typeof PERSONALITY_OPTIONS) => {
    const option = options.find((opt) => opt.value === value);
    if (!option) return value;
    return option.label[locale as "en" | "zh" | "ja"] || option.label.en;
  };

  // Check if we have new checkbox data
  const hasNewData =
    (personalityTypes && personalityTypes.length > 0) ||
    (appearanceTypes && appearanceTypes.length > 0) ||
    (serviceTypes && serviceTypes.length > 0) ||
    (preferredMemberTypes && preferredMemberTypes.length > 0);

  // Check if we have legacy data
  const hasLegacyData =
    personality || appearance || serviceStyle || preferredType;

  // Don't render if no data at all
  if (!hasNewData && !hasLegacyData) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-airbnb-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">💫</span>
        <h3 className="text-lg font-semibold text-deep">{t("cast.about")}</h3>
      </div>

      {/* Personality Types (New checkbox data) */}
      {personalityTypes && personalityTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.personality")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {personalityTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="px-3 py-1.5 bg-coral/10 text-coral border-coral/30"
              >
                {getLabel(type, PERSONALITY_OPTIONS)}
              </Badge>
            ))}
            {personalityOther && (
              <Badge
                variant="secondary"
                className="px-3 py-1.5 bg-coral/10 text-coral border-coral/30"
              >
                {personalityOther}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Personality Type (Legacy) */}
      {!hasNewData && personality && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.personality")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(personality, locale)}
          </p>
        </div>
      )}

      {/* Appearance Types (New checkbox data) */}
      {appearanceTypes && appearanceTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">👗</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.appearance")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {appearanceTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="px-3 py-1.5 bg-rose/20 text-rose-gold border-rose/30"
              >
                {getLabel(type, APPEARANCE_OPTIONS)}
              </Badge>
            ))}
            {appearanceOther && (
              <Badge
                variant="secondary"
                className="px-3 py-1.5 bg-rose/20 text-rose-gold border-rose/30"
              >
                {appearanceOther}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Appearance Style (Legacy) */}
      {!hasNewData && appearance && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">👗</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.appearance")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(appearance, locale)}
          </p>
        </div>
      )}

      {/* Service Types (New checkbox data) */}
      {serviceTypes && serviceTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💝</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.serviceStyle")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {serviceTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="px-3 py-1.5 bg-info/10 text-info border-info/30"
              >
                {getLabel(type, SERVICE_OPTIONS)}
              </Badge>
            ))}
            {serviceOther && (
              <Badge
                variant="secondary"
                className="px-3 py-1.5 bg-info/10 text-info border-info/30"
              >
                {serviceOther}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Service Style (Legacy) */}
      {!hasNewData && serviceStyle && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💝</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.serviceStyle")}
            </h4>
          </div>
          <p className="text-light leading-relaxed pl-7">
            {getLocalizedText(serviceStyle, locale)}
          </p>
        </div>
      )}

      {/* Divider */}
      {((preferredMemberTypes && preferredMemberTypes.length > 0) ||
        preferredType) &&
        (hasNewData || personality || appearance || serviceStyle) && (
          <div className="border-t border-gray-100"></div>
        )}

      {/* Preferred Member Types (New checkbox data) */}
      {preferredMemberTypes && preferredMemberTypes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💕</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.preferences")}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {preferredMemberTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="px-3 py-1.5 bg-rose-50 text-rose-700 border-rose-200"
              >
                {getLabel(type, PREFERRED_MEMBER_OPTIONS)}
              </Badge>
            ))}
            {preferredMemberOther && (
              <Badge
                variant="secondary"
                className="px-3 py-1.5 bg-rose-50 text-rose-700 border-rose-200"
              >
                {preferredMemberOther}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Preferred Member Type (Legacy) */}
      {!hasNewData && preferredType && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💕</span>
            <h4 className="text-sm font-semibold text-deep">
              {t("cast.preferences")}
            </h4>
          </div>
          <div className="space-y-2 pl-7">
            <div className="flex items-center gap-2">
              <span className="text-base">💖</span>
              <h5 className="text-xs font-medium text-light uppercase tracking-wide">
                {t("cast.preferredType")}
              </h5>
            </div>
            <p className="text-light leading-relaxed">
              {getLocalizedText(preferredType, locale)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
