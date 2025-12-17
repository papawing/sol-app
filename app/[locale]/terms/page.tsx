"use client";

import { useTranslations } from "next-intl";
import Navbar from "@/components/shared/Navbar";

export default function TermsPage() {
  const t = useTranslations("termsPage");

  const sections = [
    {
      title: t("section1Title"),
      content: t("section1Content"),
    },
    {
      title: t("section2Title"),
      content: t("section2Content"),
    },
    {
      title: t("section3Title"),
      content: t("section3Content"),
    },
    {
      title: t("section4Title"),
      content: t("section4Content"),
    },
    {
      title: t("section5Title"),
      content: t("section5Content"),
    },
    {
      title: t("section6Title"),
      content: t("section6Content"),
    },
    {
      title: t("section7Title"),
      content: t("section7Content"),
    },
    {
      title: t("section8Title"),
      content: t("section8Content"),
    },
    {
      title: t("section9Title"),
      content: t("section9Content"),
    },
    {
      title: t("section10Title"),
      content: t("section10Content"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-deep via-hof to-deep py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-white/80">
            {t("hero.lastUpdated")}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-light leading-relaxed mb-8">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
                <h2 className="text-2xl font-semibold text-deep mb-4">
                  {index + 1}. {section.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-light leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-white rounded-airbnb-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-deep mb-4">
              {t("contact.title")}
            </h3>
            <p className="text-light mb-2">
              {t("contact.description")}
            </p>
            <p className="text-teal font-medium">
              hello@lune-roppongi.jp
            </p>
          </div>
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
