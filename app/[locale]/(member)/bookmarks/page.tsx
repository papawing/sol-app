import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import CastCard from "@/components/cast/CastCard";

type PageProps = {
  params: { locale: string };
};

export default async function BookmarksPage({ params }: PageProps) {
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

  // Get member
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    redirect("/");
  }

  // Fetch bookmarked casts with full details
  const bookmarks = await prisma.bookmark.findMany({
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
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header - Airbnb Style */}
          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-deep mb-3">
              ❤️ {t("bookmarks.title") || "Saved"}
            </h1>
            <p className="text-light text-base md:text-lg max-w-2xl">
              {bookmarks.length > 0
                ? t("bookmarks.description") || `${bookmarks.length} saved ${bookmarks.length === 1 ? "member" : "members"}`
                : t("bookmarks.emptyDescription") || "Start saving your favorite members"}
            </p>
          </div>

          {/* Bookmarked Casts Grid */}
          {bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💔</div>
              <p className="text-xl text-deep mb-2">
                {t("bookmarks.empty") || "No saved members yet"}
              </p>
              <p className="text-sm text-light mb-8">
                {t("bookmarks.emptyHint") || "Browse members and save your favorites"}
              </p>
              <a
                href={`/${params.locale}/browse`}
                className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#E61E4D] text-white px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-md"
              >
                {t("bookmarks.browseCasts") || "Browse Members"}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {bookmarks.map((bookmark) => (
                <CastCard
                  key={bookmark.id}
                  id={bookmark.cast.id}
                  name={bookmark.cast.user.nickname}
                  age={bookmark.cast.age}
                  languages={bookmark.cast.languages}
                  tierClassification={bookmark.cast.tierClassification}
                  verificationStatus={bookmark.cast.user.verificationStatus}
                  isFeatured={bookmark.cast.isFeatured}
                  photoUrl={bookmark.cast.photos[0]?.photoUrl}
                  isBookmarked={true}
                  locale={params.locale}
                />
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {bookmarks.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-light">
                  {t("bookmarks.totalSaved") || `You have saved ${bookmarks.length} ${bookmarks.length === 1 ? "member" : "members"}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
