"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DiscretionSection from "@/components/landing/DiscretionSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhySolSection from "@/components/landing/WhySolSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

export default function HomePage() {
  const t = useTranslations("landing.footer");

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DiscretionSection />
      <HowItWorksSection />
      <WhySolSection />
      <FinalCTASection />

      {/* Footer */}
      <footer className="bg-deep border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">SOL</h3>
              <p className="text-white/70 text-sm">{t("location")}</p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t("about")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-white/70 hover:text-white transition-colors">
                    {t("howItWorks")}
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="text-white/70 hover:text-white transition-colors">
                    {t("safety")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                    {t("terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                    {t("privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/50 text-sm text-center">{t("copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
