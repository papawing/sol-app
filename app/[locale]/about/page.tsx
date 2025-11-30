import { getTranslations } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import { Link } from "@/i18n/routing";
import { Sparkles, MapPin, Shield, Heart } from "lucide-react";
import Image from "next/image";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-deep via-hof to-deep py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-mint/40 to-transparent blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-teal/40 to-transparent blur-3xl rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 animate-fade-in-up flex justify-center">
            <Image
              src="/images/lune-icon.png"
              alt="LIEN Icon"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story - Roppongi Lounge */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-teal" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-deep">
                  {t("lune.title")}
                </h2>
              </div>
              <p className="text-lg text-light leading-relaxed mb-6">
                {t("lune.description")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("lune.feature1")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("lune.feature2")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("lune.feature3")}</p>
                </li>
              </ul>
            </div>
            <div className="rounded-airbnb-xl overflow-hidden shadow-airbnb-lg">
              <div className="relative aspect-video">
                <Image
                  src="/images/main-1.jpeg"
                  alt="Our Roppongi Lounge - Main Venue"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIEN Platform */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-deep to-hof rounded-airbnb-xl p-4 shadow-airbnb-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded-airbnb-md overflow-hidden">
                    <Image
                      src="/images/vip-1.jpeg"
                      alt="LIEN - VIP Area"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square rounded-airbnb-md overflow-hidden">
                    <Image
                      src="/images/vip-2.jpeg"
                      alt="LIEN - VIP Lounge"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-teal" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-deep">
                  {t("platform.title")}
                </h2>
              </div>
              <p className="text-lg text-light leading-relaxed mb-6">
                {t("platform.description")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("platform.feature1")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("platform.feature2")}</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-teal"></div>
                  </div>
                  <p className="text-light">{t("platform.feature3")}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-deep mb-4">
              {t("values.title")}
            </h2>
            <p className="text-xl text-light max-w-2xl mx-auto">
              {t("values.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1: Discretion */}
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <Shield className="w-10 h-10 text-teal" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-deep mb-3">{t("values.value1Title")}</h3>
              <p className="text-sm text-light leading-relaxed">{t("values.value1Desc")}</p>
            </div>

            {/* Value 2: Quality */}
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <Sparkles className="w-10 h-10 text-teal" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-deep mb-3">{t("values.value2Title")}</h3>
              <p className="text-sm text-light leading-relaxed">{t("values.value2Desc")}</p>
            </div>

            {/* Value 3: Safety */}
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <MapPin className="w-10 h-10 text-teal" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-deep mb-3">{t("values.value3Title")}</h3>
              <p className="text-sm text-light leading-relaxed">{t("values.value3Desc")}</p>
            </div>

            {/* Value 4: Experience */}
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-base">
                  <Heart className="w-10 h-10 text-teal" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-deep mb-3">{t("values.value4Title")}</h3>
              <p className="text-sm text-light leading-relaxed">{t("values.value4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-deep via-hof to-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="min-w-[200px] bg-white text-deep text-lg px-8 py-4 rounded-airbnb-lg shadow-airbnb-xl hover:bg-mint hover:scale-105 transition-all duration-base font-semibold">
                {t("cta.button")}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/50 text-sm">© 2025 LIEN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
