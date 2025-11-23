"use client";

import { useTranslations } from "next-intl";
import { Lock, MessageSquare, Eye, CheckCircle2 } from "lucide-react";

export default function DiscretionSection() {
  const t = useTranslations("landing.discretion");

  const features = [
    {
      icon: Lock,
      title: t("private"),
      description: t("privateDesc"),
    },
    {
      icon: MessageSquare,
      title: t("encrypted"),
      description: t("encryptedDesc"),
    },
    {
      icon: Eye,
      title: t("noJudgment"),
      description: t("noJudgmentDesc"),
    },
    {
      icon: CheckCircle2,
      title: t("yourTerms"),
      description: t("yourTermsDesc"),
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-deep via-hof to-deep relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-mint/40 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-teal/40 to-transparent blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-5xl mb-4 animate-fade-in-up">🔒</div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("title")}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("intro")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-base">
                    <Icon className="w-10 h-10 text-mint" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
