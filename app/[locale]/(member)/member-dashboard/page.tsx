import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import RequestCard from "@/components/dashboard/RequestCard";
import CastCard from "@/components/cast/CastCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations();

  // Require authentication
  if (!session?.user) {
    redirect("/login");
  }

  // Require member role
  if (session.user.role !== "MEMBER") {
    redirect("/");
  }

  // Get member data with tier
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    redirect("/");
  }

  // Fetch dashboard data
  const [castsCount, bookmarksData, requestsData, featuredCasts] =
    await Promise.all([
      // Total active casts count
      prisma.cast.count({
        where: { isActive: true },
      }),

      // User's bookmarks with cast data (limit 4)
      prisma.bookmark.findMany({
        where: { memberId: member.id },
        include: {
          cast: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                  verificationStatus: true,
                },
              },
              photos: {
                take: 1,
                orderBy: { displayOrder: "asc" },
              },
              bookmarks: {
                where: { memberId: member.id },
                select: { id: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),

      // User's pending requests (limit 3)
      prisma.meetingRequest.findMany({
        where: {
          memberId: member.id,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        include: {
          cast: {
            include: {
              user: {
                select: {
                  nickname: true,
                },
              },
            },
          },
        },
        orderBy: { requestedAt: "desc" },
        take: 3,
      }),

      // Featured casts (limit 5)
      prisma.cast.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              verificationStatus: true,
            },
          },
          photos: {
            take: 1,
            orderBy: { displayOrder: "asc" },
          },
          bookmarks: {
            where: { memberId: member.id },
            select: { id: true },
          },
        },
        take: 5,
      }),
    ]);

  const bookmarksCount = await prisma.bookmark.count({
    where: { memberId: member.id },
  });

  const pendingRequestsCount = await prisma.meetingRequest.count({
    where: { memberId: member.id, status: "PENDING" },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-champagne/30 via-white to-white py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-deep mb-4">
                {t("dashboard.welcome")}
              </h1>
              <p className="text-lg text-light mb-8">{t("dashboard.tagline")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/browse`}>
                  <Button
                    variant="airbnb"
                    className="w-full sm:w-auto px-8 py-3 text-base"
                  >
                    {t("dashboard.discoverCasts")} →
                  </Button>
                </Link>
                {bookmarksCount > 0 && (
                  <Link href={`/${locale}/bookmarks`}>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-3 text-base"
                    >
                      ❤️ {t("dashboard.yourBookmarks")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              icon="💃"
              label={t("dashboard.stats.castsAvailable")}
              count={castsCount}
              description={
                member.tier === "STANDARD"
                  ? "Standard casts"
                  : "All casts (Standard + High-Class)"
              }
              href="/browse"
              locale={locale}
            />
            <StatsCard
              icon="❤️"
              label={t("dashboard.stats.savedFavorites")}
              count={bookmarksCount}
              description={`${bookmarksCount} ${t("bookmarks.totalSaved")}`}
              href="/bookmarks"
              locale={locale}
            />
            <StatsCard
              icon="📅"
              label={t("dashboard.stats.pendingRequests")}
              count={pendingRequestsCount}
              description={
                pendingRequestsCount > 0
                  ? t("requests.awaitingAdmin")
                  : "No pending requests"
              }
              href="/browse"
              locale={locale}
            />
          </div>
        </div>

        {/* Featured Casts Section */}
        {featuredCasts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-2xl text-deep">
                ⭐ {t("dashboard.featuredTonight")}
              </h2>
              <Link href={`/${locale}/browse`}>
                <span className="text-sm text-coral hover:underline font-semibold">
                  {t("dashboard.viewAll")} →
                </span>
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
              {featuredCasts.map((cast) => (
                <div
                  key={cast.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                >
                  <CastCard
                    id={cast.id}
                    name={cast.user.nickname}
                    age={cast.age}
                    languages={cast.languages}
                    tierClassification={cast.tierClassification}
                    verificationStatus={cast.user.verificationStatus}
                    isFeatured={cast.isFeatured}
                    photoUrl={cast.photos[0]?.photoUrl}
                    isBookmarked={cast.bookmarks.length > 0}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Your Bookmarks Preview */}
        {bookmarksData.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-2xl text-deep">
                ❤️ {t("dashboard.yourFavorites")}
              </h2>
              <Link href={`/${locale}/bookmarks`}>
                <span className="text-sm text-coral hover:underline font-semibold">
                  {t("dashboard.viewAll")} {bookmarksCount} →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarksData.map((bookmark) => (
                <CastCard
                  key={bookmark.cast.id}
                  id={bookmark.cast.id}
                  name={bookmark.cast.user.nickname}
                  age={bookmark.cast.age}
                  languages={bookmark.cast.languages}
                  tierClassification={bookmark.cast.tierClassification}
                  verificationStatus={bookmark.cast.user.verificationStatus}
                  isFeatured={bookmark.cast.isFeatured}
                  photoUrl={bookmark.cast.photos[0]?.photoUrl}
                  isBookmarked={true}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        )}

        {/* Your Requests Section */}
        {requestsData.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-2xl text-deep">
                📅 {t("dashboard.yourRequests")}
              </h2>
              <Link href={`/${locale}/browse`}>
                <span className="text-sm text-coral hover:underline font-semibold">
                  {t("dashboard.viewAll")} →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requestsData.map((request) => (
                <RequestCard
                  key={request.id}
                  castName={request.cast.user.nickname}
                  status={request.status}
                  requestedAt={request.requestedAt}
                  scheduledDate={request.scheduledDate}
                  location={request.luneLocation}
                  translations={{
                    pending: t("meeting.pending"),
                    confirmed: t("meeting.confirmed"),
                    cancelled: t("meeting.cancelled"),
                    completed: t("meeting.completed"),
                    requestedOn: t("dashboard.requestedOn"),
                    scheduledDate: t("meeting.scheduledDate"),
                    location: t("meeting.location"),
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Discover More CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-rose-gold/20 to-champagne/20 rounded-airbnb-xl p-12 text-center shadow-airbnb-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">💫</div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-deep mb-4">
                {t("dashboard.readyToMeet")}
              </h3>
              <p className="text-base md:text-lg text-deep/80 mb-8 max-w-2xl mx-auto">
                {t("dashboard.browseCollection")}
              </p>
              <Link href={`/${locale}/browse`}>
                <Button variant="airbnb" className="px-8 py-3 text-base">
                  {t("dashboard.exploreAll")} →
                </Button>
              </Link>

              {/* Upgrade CTA for Basic Members */}
              {member.tier === "STANDARD" && (
                <div className="mt-8 pt-8 border-t border-rose-gold/20">
                  <p className="text-sm text-deep/70 mb-3">
                    {t("dashboard.upgradeAccess")}
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-gold hover:bg-gold/10"
                  >
                    ⭐ {t("dashboard.upgradeNow")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Empty State (if no bookmarks and no requests) */}
        {bookmarksData.length === 0 && requestsData.length === 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-semibold text-deep mb-3">
              {t("dashboard.noCastsYet")}
            </h3>
            <p className="text-light mb-8">{t("dashboard.browseCollection")}</p>
            <Link href={`/${locale}/browse`}>
              <Button variant="airbnb" className="px-8 py-3">
                {t("dashboard.discoverCasts")} →
              </Button>
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
