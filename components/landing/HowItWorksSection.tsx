"use client";

import { useTranslations } from "next-intl";
import { Search, Calendar, Wine, Moon } from "lucide-react";

export default function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [
    {
      number: "01",
      icon: Search,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      number: "02",
      icon: Calendar,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      number: "03",
      icon: Wine,
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      number: "04",
      icon: Moon,
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-deep mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-light max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-mint via-teal to-deep-teal opacity-40"></div>
                )}

                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-teal text-white font-display font-bold text-2xl mb-6 shadow-airbnb-xl relative z-10 group-hover:scale-110 transition-transform duration-base">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-white shadow-airbnb-md flex items-center justify-center group-hover:scale-110 group-hover:shadow-airbnb-hover transition-all duration-base">
                    <Icon className="w-10 h-10 text-rausch" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-deep mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
