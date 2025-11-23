"use client";

import { useTranslations } from "next-intl";
import { MapPin, Shield, Sparkles } from "lucide-react";

export default function WhyLuneSection() {
  const t = useTranslations("landing.whyLune");

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-mint/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-teal/5 to-transparent"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4 animate-fade-in-up">🌙</div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-deep mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("title")}
          </h2>
          <p className="text-2xl md:text-3xl font-display text-teal mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-airbnb-xl p-8 md:p-12 shadow-airbnb-md border border-gray-100 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {/* Description */}
          <div className="mb-10">
            <p className="text-lg md:text-xl text-light leading-relaxed whitespace-pre-line">
              {t("description")}
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Safety */}
            <div className="flex items-start gap-3 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <Shield className="w-6 h-6 text-teal" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-deep mb-1">{t("benefit1Title")}</h4>
                <p className="text-sm text-light">{t("benefit1Desc")}</p>
              </div>
            </div>

            {/* Sophistication */}
            <div className="flex items-start gap-3 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <Sparkles className="w-6 h-6 text-teal" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-deep mb-1">{t("benefit2Title")}</h4>
                <p className="text-sm text-light">{t("benefit2Desc")}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 group">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <MapPin className="w-6 h-6 text-teal" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-deep mb-1">{t("benefit3Title")}</h4>
                <p className="text-sm text-light">{t("benefit3Desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emphasized Quote */}
        <div className="mt-12 text-center">
          <p className="text-2xl md:text-3xl font-display text-deep italic animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            {t("quote")}
          </p>
        </div>
      </div>
    </section>
  );
}
