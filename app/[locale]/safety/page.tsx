"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, CheckCircle2, UserCheck, MessageSquare, AlertCircle, ArrowRight } from "lucide-react";

export default function SafetyPage() {
  const t = useTranslations("safetyPage");

  const safetyFeatures = [
    {
      icon: UserCheck,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    {
      icon: Lock,
      title: t("feature2Title"),
      description: t("feature2Desc"),
    },
    {
      icon: Eye,
      title: t("feature3Title"),
      description: t("feature3Desc"),
    },
    {
      icon: MessageSquare,
      title: t("feature4Title"),
      description: t("feature4Desc"),
    },
    {
      icon: Shield,
      title: t("feature5Title"),
      description: t("feature5Desc"),
    },
    {
      icon: AlertCircle,
      title: t("feature6Title"),
      description: t("feature6Desc"),
    },
  ];

  const guidelines = [
    t("guideline1"),
    t("guideline2"),
    t("guideline3"),
    t("guideline4"),
    t("guideline5"),
    t("guideline6"),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-deep via-hof to-deep py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-mint/30 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-radial from-teal/30 to-transparent blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6 animate-fade-in-up">🛡️</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-light leading-relaxed mb-6">
              {t("intro.paragraph1")}
            </p>
            <p className="text-xl text-light leading-relaxed">
              {t("intro.paragraph2")}
            </p>
          </div>
        </div>
      </section>

      {/* Safety Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-light max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-airbnb-xl shadow-airbnb-md p-8 hover:shadow-airbnb-hover hover:-translate-y-2 transition-all duration-base animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-deep mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy & Data Protection Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("privacy.title")}
            </h2>
            <p className="text-xl text-light">
              {t("privacy.subtitle")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-mint/10 to-teal/10 rounded-airbnb-xl p-8 md:p-12 mb-8">
            <h3 className="text-2xl font-semibold text-deep mb-6">
              {t("privacy.dataTitle")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-light">{t("privacy.data1")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-light">{t("privacy.data2")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-light">{t("privacy.data3")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-light">{t("privacy.data4")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-light">{t("privacy.data5")}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-light leading-relaxed">
              {t("privacy.gdprNote")}
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("guidelines.title")}
            </h2>
            <p className="text-xl text-light">
              {t("guidelines.subtitle")}
            </p>
          </div>

          <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-8 md:p-12">
            <div className="space-y-6">
              {guidelines.map((guideline, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-lg text-light leading-relaxed pt-0.5">
                    {guideline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporting & Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("support.title")}
            </h2>
            <p className="text-xl text-light">
              {t("support.subtitle")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-rausch/10 to-rose-gold/10 rounded-airbnb-xl p-8 md:p-12 text-center">
            <p className="text-lg text-light mb-8 leading-relaxed">
              {t("support.description")}
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-gradient-rausch text-white text-lg px-8 py-6 rounded-airbnb-lg shadow-airbnb-xl hover:scale-105 transition-transform duration-base"
              >
                {t("support.button")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-deep via-hof to-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {t("cta.subtitle")}
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="min-w-[220px] bg-white text-deep-teal text-lg px-8 py-6 rounded-airbnb-lg shadow-airbnb-xl hover:bg-mint hover:text-deep hover:scale-105 transition-all duration-base font-semibold"
            >
              {t("cta.button")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-white/50 text-sm text-center">
            © 2025 LIEN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
