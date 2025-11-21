import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { redirect, Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import PhotoGallery from "@/components/cast/PhotoGallery";
import BookmarkButton from "@/components/cast/BookmarkButton";
import RequestMeetingButton from "@/components/member/RequestMeetingButton";
import PhysicalAttributesCard from "@/components/cast/PhysicalAttributesCard";
import PersonalitySection from "@/components/cast/PersonalitySection";
import LifestyleCard from "@/components/cast/LifestyleCard";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getLocalizedText } from "@/lib/cast-helpers";
import type { LocalizedText } from "@/types/cast";

type PageProps = {
  params: Promise<{ locale: string; castId: string }>;
};

export default async function CastDetailPage({ params }: PageProps) {
  const { castId } = await params;
  const locale = await getLocale();
  const session = await auth();
  const t = await getTranslations();

  // Require authentication
  if (!session?.user) {
    redirect("/login");
  }

  // Require member or admin role
  if (session.user.role !== "MEMBER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Get member tier (not required for admins)
  let member = null;
  if (session.user.role === "MEMBER") {
    member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });

    if (!member) {
      redirect("/");
    }
  }

  // Fetch cast details
  const cast = await prisma.cast.findUnique({
    where: { id: castId },
    include: {
      user: {
        select: {
          nickname: true,
          verificationStatus: true,
        },
      },
      photos: {
        orderBy: { displayOrder: "asc" },
      },
      bookmarks: member ? {
        where: { memberId: member.id },
        select: { id: true },
      } : false,
    },
  });

  if (!cast || !cast.isActive) {
    notFound();
  }

  // Check tier access (only for members, admins can view all)
  if (
    member &&
    member.tier === "BASIC" &&
    cast.tierClassification === "HIGH_CLASS"
  ) {
    redirect("/browse");
  }

  const isBookmarked = cast.bookmarks ? cast.bookmarks.length > 0 : false;
  const languageLabels: Record<string, { en: string; zh: string; ja: string }> =
    {
      en: { en: "English", zh: "英语", ja: "英語" },
      zh: { en: "Chinese", zh: "中文", ja: "中国語" },
      ja: { en: "Japanese", zh: "日语", ja: "日本語" },
    };

  const getLanguageLabel = (lang: string) => {
    return (
      languageLabels[lang]?.[locale as "en" | "zh" | "ja"] || lang
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-light hover:text-deep transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("common.back")}
          </Link>

          {/* Mobile-first layout: Single column on mobile, 2-column on desktop */}
          <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {/* Photo Gallery - Full width on mobile, 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <PhotoGallery
                photos={cast.photos.map((photo) => ({
                  id: photo.id,
                  url: photo.photoUrl,
                  caption: null,
                }))}
                castName={cast.user.nickname}
              />
            </div>

            {/* Profile Info Sidebar - Full width on mobile, 1/3 width on desktop */}
            <div className="lg:col-span-1 space-y-6">
              {/* Name & Actions */}
              <div className="bg-white rounded-xl p-6 shadow-airbnb-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-deep mb-1">
                      {cast.user.nickname}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-light">{cast.age}</span>
                      {cast.user.verificationStatus === "APPROVED" && (
                        <div className="bg-success text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                  {member && (
                    <BookmarkButton
                      castId={cast.id}
                      initialBookmarked={isBookmarked}
                    />
                  )}
                </div>

                {/* Tier Badge */}
                {cast.tierClassification === "HIGH_CLASS" && (
                  <Badge
                    variant="secondary"
                    className="bg-gold text-deep font-semibold px-3 py-1.5 mb-4"
                    style={{ backgroundColor: "var(--color-gold-vibrant)" }}
                  >
                    ⭐ {locale === "en" ? "Premium Member" : locale === "zh" ? "高级会员" : "プレミアムメンバー"}
                  </Badge>
                )}

                {/* Languages */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-deep mb-2">
                    {t("cast.languages")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cast.languages.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="px-3 py-1 border-gray-200 text-light"
                      >
                        {getLanguageLabel(lang)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                {cast.location && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-deep mb-2">
                      {t("cast.location")}
                    </h3>
                    <p className="text-light">{cast.location}</p>
                  </div>
                )}

                {/* Request Meeting CTA */}
                <RequestMeetingButton
                  castId={cast.id}
                  castName={cast.user.nickname}
                  locale={locale}
                />
              </div>

              {/* Physical Attributes Card */}
              <PhysicalAttributesCard
                bustSize={cast.bustSize}
                height={cast.height}
                weight={cast.weight}
                englishLevel={cast.englishLevel}
                birthday={cast.birthday}
                locale={locale}
              />

              {/* About - Legacy bio (backward compatible) */}
              {cast.bio && typeof cast.bio === "string" && (
                <div className="bg-white rounded-xl p-6 shadow-airbnb-md">
                  <h3 className="text-lg font-semibold text-deep mb-3">
                    {t("cast.bio")}
                  </h3>
                  <p className="text-light leading-relaxed whitespace-pre-wrap">
                    {cast.bio}
                  </p>
                </div>
              )}

              {/* Personality Section - New multilingual content */}
              <PersonalitySection
                personality={cast.personality as LocalizedText}
                appearance={cast.appearance as LocalizedText}
                serviceStyle={cast.serviceStyle as LocalizedText}
                preferredType={cast.preferredType as LocalizedText}
                locale={locale}
              />

              {/* Body Measurements */}
              {cast.bodyMeasurements && (
                <div className="bg-white rounded-xl p-6 shadow-airbnb-md">
                  <h3 className="text-lg font-semibold text-deep mb-3">
                    {t("cast.bodyMeasurements")}
                  </h3>
                  <p className="text-light">{cast.bodyMeasurements}</p>
                </div>
              )}

              {/* Lifestyle Card - Hobbies & Holiday Style */}
              <LifestyleCard
                hobbies={cast.hobbies || []}
                holidayStyle={cast.holidayStyle || []}
                locale={locale}
              />

              {/* Legacy Interests (backward compatible) */}
              {cast.interests && cast.interests.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-airbnb-md">
                  <h3 className="text-lg font-semibold text-deep mb-3">
                    {t("cast.interests")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cast.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="px-3 py-1.5 bg-gray-100 text-deep"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* First Meeting Info */}
              <div className="bg-gradient-to-r from-info to-success rounded-xl p-6 text-white shadow-airbnb-md">
                <h3 className="font-display text-xl font-semibold mb-2">
                  {t("meeting.firstMeeting")}
                </h3>
                <p className="opacity-90 mb-4">
                  {t("meeting.safeEnvironment")}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span>Lune Roppongi, Tokyo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
