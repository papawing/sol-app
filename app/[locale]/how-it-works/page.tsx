"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Wine, Moon, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  const t = useTranslations("howItWorksPage");

  const steps = [
    {
      number: "01",
      icon: Search,
      title: t("step1Title"),
      description: t("step1Desc"),
      details: [t("step1Detail1"), t("step1Detail2"), t("step1Detail3")],
    },
    {
      number: "02",
      icon: Calendar,
      title: t("step2Title"),
      description: t("step2Desc"),
      details: [t("step2Detail1"), t("step2Detail2"), t("step2Detail3")],
    },
    {
      number: "03",
      icon: Wine,
      title: t("step3Title"),
      description: t("step3Desc"),
      details: [t("step3Detail1"), t("step3Detail2"), t("step3Detail3")],
    },
    {
      number: "04",
      icon: Moon,
      title: t("step4Title"),
      description: t("step4Desc"),
      details: [t("step4Detail1"), t("step4Detail2"), t("step4Detail3")],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-deep via-hof to-deep py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-rose/30 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-radial from-coral/30 to-transparent blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6 animate-fade-in-up">✨</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Detailed Steps Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`mb-20 last:mb-0 animate-fade-in-up ${
                  isEven ? "md:pr-12" : "md:pl-12"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-teal flex items-center justify-center text-white font-display font-bold text-3xl shadow-airbnb-xl">
                        {step.number}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-white shadow-airbnb-md flex items-center justify-center">
                        <Icon className="w-8 h-8 text-rausch" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-deep mb-4">
                      {step.title}
                    </h2>
                    <p className="text-xl text-light mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-base text-light">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="mt-12 ml-12 h-16 w-0.5 bg-gradient-to-b from-coral via-rose to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* What Makes SOL Different Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("different.title")}
            </h2>
            <p className="text-xl text-light">
              {t("different.subtitle")}
            </p>
          </div>

          <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-light leading-relaxed mb-6">
                {t("different.description1")}
              </p>
              <p className="text-lg text-light leading-relaxed mb-6">
                {t("different.description2")}
              </p>
              <div className="bg-gradient-to-br from-rose/10 to-coral/10 rounded-airbnb-lg p-6 my-8">
                <p className="text-xl md:text-2xl font-display text-deep italic text-center">
                  "{t("different.quote")}"
                </p>
              </div>
              <p className="text-lg text-light leading-relaxed">
                {t("different.description3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("safety.title")}
            </h2>
            <p className="text-xl text-light">
              {t("safety.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-6 hover:shadow-airbnb-hover transition-shadow duration-base">
              <h3 className="text-xl font-semibold text-deep mb-3">{t("safety.feature1Title")}</h3>
              <p className="text-light">{t("safety.feature1Desc")}</p>
            </div>
            <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-6 hover:shadow-airbnb-hover transition-shadow duration-base">
              <h3 className="text-xl font-semibold text-deep mb-3">{t("safety.feature2Title")}</h3>
              <p className="text-light">{t("safety.feature2Desc")}</p>
            </div>
            <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-6 hover:shadow-airbnb-hover transition-shadow duration-base">
              <h3 className="text-xl font-semibold text-deep mb-3">{t("safety.feature3Title")}</h3>
              <p className="text-light">{t("safety.feature3Desc")}</p>
            </div>
            <div className="bg-white rounded-airbnb-xl shadow-airbnb-md p-6 hover:shadow-airbnb-hover transition-shadow duration-base">
              <h3 className="text-xl font-semibold text-deep mb-3">{t("safety.feature4Title")}</h3>
              <p className="text-light">{t("safety.feature4Desc")}</p>
            </div>
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
              className="min-w-[220px] bg-white text-deep-coral text-lg px-8 py-6 rounded-airbnb-lg shadow-airbnb-xl hover:bg-rose hover:text-deep hover:scale-105 transition-all duration-base font-semibold"
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
            © 2025 SOL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
