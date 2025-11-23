"use client";

import { useTranslations } from "next-intl";
import { Sparkles, Lock, MapPin } from "lucide-react";

export default function FeaturesSection() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: Sparkles,
      title: t("feature1Title"),
      description: t("feature1Desc"),
      delay: "0ms",
    },
    {
      icon: Lock,
      title: t("feature2Title"),
      description: t("feature2Desc"),
      delay: "200ms",
    },
    {
      icon: MapPin,
      title: t("feature3Title"),
      description: t("feature3Desc"),
      delay: "400ms",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-deep mb-4">
            {t("title")}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-airbnb-xl p-8 hover:-translate-y-2 transition-all duration-base cursor-pointer animate-fade-in-up shadow-airbnb-md hover:shadow-airbnb-hover"
                style={{ animationDelay: feature.delay }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rausch/10 to-rose-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                    <Icon className="w-8 h-8 text-teal" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-deep mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-light text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-rausch/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-airbnb-xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
