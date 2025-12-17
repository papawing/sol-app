"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  const t = useTranslations("landing.finalCTA");

  return (
    <section className="py-24 bg-gradient-to-br from-deep via-hof to-deep relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-rose/30 to-transparent blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-radial from-coral/30 to-transparent blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative icon */}
        <div className="text-6xl mb-6 animate-fade-in-up">🌙</div>

        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {t("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Link href="/register">
            <Button
              size="lg"
              className="min-w-[200px] bg-white text-deep-coral text-lg px-8 py-6 rounded-airbnb-lg shadow-airbnb-xl hover:bg-rose hover:text-deep hover:scale-105 transition-all duration-base font-semibold"
            >
              {t("ctaPrimary")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-lg px-8 py-6 rounded-airbnb-lg hover:bg-white/20 hover:scale-105 transition-all duration-base font-semibold"
            >
              {t("ctaSecondary")}
            </Button>
          </Link>
        </div>

        {/* Note */}
        <p className="text-sm text-white/70 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          {t("note")}
        </p>
      </div>
    </section>
  );
}
