import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import BrowseClient from "@/components/browse/BrowseClient";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BrowsePage({ params }: PageProps) {
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

  // Get member tier
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    redirect("/");
  }

  // Tier-based filtering
  // STANDARD members can only see STANDARD casts
  // GOLD and VIP members can see both STANDARD and HIGH_CLASS casts
  const tierFilter =
    member.tier === "VIP" || member.tier === "GOLD"
      ? { tierClassification: { in: ["STANDARD", "HIGH_CLASS"] as Array<"STANDARD" | "HIGH_CLASS"> } }
      : { tierClassification: "STANDARD" as "STANDARD" };

  // Fetch active casts with photos
  const casts = await prisma.cast.findMany({
    where: {
      isActive: true,
      ...tierFilter,
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
    orderBy: [
      { isFeatured: "desc" },
      { user: { verificationStatus: "desc" } },
    ],
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 pb-8">
        {/* Client-side Browse with Filters - Header removed for sticky filter UX */}
        <BrowseClient initialCasts={casts} locale={locale} />

        {/* Upgrade CTA for Standard Members - Airbnb Style */}
        {member.tier === "STANDARD" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-8 md:mt-12 bg-gradient-luxury rounded-airbnb-xl p-6 md:p-8 text-center shadow-airbnb-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 to-champagne/20"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-deep mb-4">
                  {t("browse.upgradeCTA.title")}
                </h3>
                <p className="text-base md:text-lg text-deep/80 mb-8 max-w-2xl mx-auto">
                  {t("browse.upgradeCTA.description")}
                </p>
                <button className="bg-[#FF5A5F] hover:bg-[#E61E4D] text-white px-8 py-3.5 rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-md">
                  {t("browse.upgradeCTA.button")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
