"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-lounge.jpg')",
        }}
      ></div>

      {/* 65% Black Overlay for text readability */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Trust Badges - Above title */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <Badge variant="secondary" className="bg-white/95 text-deep border-none px-4 py-2 shadow-md hover:bg-white transition-all">
            <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
            {t("trustBadge1")}
          </Badge>
          <Badge variant="secondary" className="bg-white/95 text-deep border-none px-4 py-2 shadow-md hover:bg-white transition-all">
            <Shield className="w-4 h-4 mr-2 text-teal" />
            {t("trustBadge2")}
          </Badge>
          <Badge variant="secondary" className="bg-white/95 text-deep border-none px-4 py-2 shadow-md hover:bg-white transition-all">
            <Globe className="w-4 h-4 mr-2 text-babu" />
            {t("trustBadge3")}
          </Badge>
        </div>

        {/* Hero Title */}
        <h1
          className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          {t("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <Link href="/login">
            <Button
              size="lg"
              className="min-w-[220px] bg-[#FF5A5F] hover:bg-[#E61E4D] text-white text-lg px-8 py-6 rounded-airbnb-lg shadow-airbnb-xl hover:scale-105 transition-transform duration-base"
            >
              {t("ctaPrimary")}
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[220px] bg-white/10 backdrop-blur-md border-2 border-mint/50 text-white text-lg px-8 py-6 rounded-airbnb-lg hover:bg-mint/20 hover:border-mint hover:scale-105 transition-all duration-base"
            >
              {t("ctaSecondary")}
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{ animationDelay: "1000ms" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-white/70 rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-radial from-mint/30 to-transparent blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-radial from-teal/30 to-transparent blur-3xl rounded-full"></div>
    </section>
  );
}
