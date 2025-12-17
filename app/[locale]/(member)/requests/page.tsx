import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/shared/Navbar";
import { format } from "date-fns";

type PageProps = {
  params: { locale: string };
};

export default async function RequestsPage({ params }: PageProps) {
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

  // Fetch meeting requests
  const requests = await prisma.meetingRequest.findMany({
    where: { memberId: member.id },
    include: {
      cast: {
        include: {
          user: {
            select: {
              nickname: true,
              verificationStatus: true,
            },
          },
          photos: {
            take: 1,
            orderBy: { displayOrder: "asc" },
          },
        },
      },
    },
    orderBy: [
      { status: "asc" }, // PENDING first
      { requestedAt: "desc" },
    ],
  });

  // Separate by status
  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const confirmedRequests = requests.filter((r) => r.status === "CONFIRMED");
  const pastRequests = requests.filter((r) => ["CANCELLED", "COMPLETED"].includes(r.status));

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header - Airbnb Style */}
          <div className="mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-deep mb-3">
              📅 {t("requests.title") || "Meeting Requests"}
            </h1>
            <p className="text-light text-base md:text-lg max-w-2xl">
              {requests.length > 0
                ? t("requests.description") || `You have ${requests.length} ${requests.length === 1 ? "request" : "requests"}`
                : t("requests.emptyDescription") || "No meeting requests yet"}
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-deep mb-2">
                {t("requests.empty") || "No meeting requests"}
              </p>
              <p className="text-sm text-light mb-8">
                {t("requests.emptyHint") || "Browse members and request a meeting"}
              </p>
              <a
                href={`/${params.locale}/browse`}
                className="inline-flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#E61E4D] text-white px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-md"
              >
                {t("requests.browseCasts") || "Browse Members"}
              </a>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <section>
                  <h2 className="font-semibold text-xl md:text-2xl text-deep mb-6 flex items-center gap-2">
                    <span className="text-2xl">⏳</span>
                    {t("requests.pending") || "Pending"} ({pendingRequests.length})
                  </h2>
                  <div className="grid gap-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white border-2 border-gray-100 rounded-airbnb-xl p-6 hover:shadow-airbnb transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              {request.cast.photos[0]?.photoUrl ? (
                                <img
                                  src={request.cast.photos[0].photoUrl}
                                  alt={request.cast.user.nickname}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                  👤
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-deep text-lg">
                                  {request.cast.user.nickname}
                                </h3>
                                <p className="text-sm text-light">
                                  {t("requests.requestedOn") || "Requested"}{" "}
                                  {format(new Date(request.requestedAt), "MMM d, yyyy")}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                  request.status
                                )}`}
                              >
                                {t(`meeting.${request.status.toLowerCase()}`) || request.status}
                              </span>
                            </div>
                            <p className="text-sm text-light mb-3">
                              {t("requests.awaitingAdmin") || "Awaiting admin coordination"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Confirmed Requests */}
              {confirmedRequests.length > 0 && (
                <section>
                  <h2 className="font-semibold text-xl md:text-2xl text-deep mb-6 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    {t("requests.confirmed") || "Confirmed"} ({confirmedRequests.length})
                  </h2>
                  <div className="grid gap-4">
                    {confirmedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-airbnb-xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                              {request.cast.photos[0]?.photoUrl ? (
                                <img
                                  src={request.cast.photos[0].photoUrl}
                                  alt={request.cast.user.nickname}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                  👤
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-deep text-lg">
                                  {request.cast.user.nickname}
                                </h3>
                                {request.scheduledDate && (
                                  <p className="text-sm font-semibold text-green-800">
                                    📅 {format(new Date(request.scheduledDate), "MMM d, yyyy 'at' h:mm a")}
                                  </p>
                                )}
                                {request.luneLocation && (
                                  <p className="text-sm text-green-700 mt-1">
                                    📍 {request.luneLocation}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                  request.status
                                )}`}
                              >
                                {t(`meeting.${request.status.toLowerCase()}`) || request.status}
                              </span>
                            </div>
                            {request.adminNotes && (
                              <div className="mt-3 p-3 bg-white rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  {t("meeting.adminNotes") || "Notes"}:
                                </p>
                                <p className="text-sm text-gray-700">{request.adminNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Past Requests */}
              {pastRequests.length > 0 && (
                <section>
                  <h2 className="font-semibold text-xl md:text-2xl text-deep mb-6 flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    {t("requests.history") || "History"} ({pastRequests.length})
                  </h2>
                  <div className="grid gap-4">
                    {pastRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gray-50 border border-gray-200 rounded-airbnb-xl p-6 opacity-75"
                      >
                        <div className="flex items-start gap-4">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              {request.cast.photos[0]?.photoUrl ? (
                                <img
                                  src={request.cast.photos[0].photoUrl}
                                  alt={request.cast.user.nickname}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                                  👤
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-deep">
                                  {request.cast.user.nickname}
                                </h3>
                                <p className="text-sm text-light">
                                  {format(new Date(request.requestedAt), "MMM d, yyyy")}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                  request.status
                                )}`}
                              >
                                {t(`meeting.${request.status.toLowerCase()}`) || request.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
