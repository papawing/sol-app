import { Link } from "@/i18n/routing"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CastRequestsPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations()

  // Protect cast route
  if (!session || session.user.role !== "CAST") {
    redirect(`/${locale}/login`)
  }

  // Get cast profile
  const cast = await prisma.cast.findUnique({
    where: { userId: session.user.id },
  })

  if (!cast) {
    redirect(`/${locale}/login`)
  }

  // Fetch all meeting requests for this cast
  const [pendingRequests, confirmedRequests, completedRequests] = await Promise.all([
    prisma.meetingRequest.findMany({
      where: {
        castId: cast.id,
        status: "PENDING",
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.meetingRequest.findMany({
      where: {
        castId: cast.id,
        status: "CONFIRMED",
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    }),
    prisma.meetingRequest.findMany({
      where: {
        castId: cast.id,
        status: "COMPLETED",
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { scheduledDate: "desc" },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-deep">
                Meeting Requests
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View incoming meeting requests from members
              </p>
            </div>
            <Link
              href="/cast/dashboard"
              locale={locale}
              className="px-4 py-2 border-2 border-deep text-deep font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-deep">{pendingRequests.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-coral">{confirmedRequests.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">How Meeting Requests Work</h3>
              <p className="text-sm text-blue-800">
                Members can request meetings with you. Admin will coordinate the details (date, time, location) and confirm with both parties. You'll be notified when a meeting is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">⏳ Pending Requests</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Member Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-rausch flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {request.member.user.name?.[0]?.toUpperCase() || "M"}
                      </div>

                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-deep">
                              {request.member.nickname || request.member.user.name || "Member"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                                {request.member.tierClassification === "PREMIUM" ? "Premium" : "Basic"} Member
                              </span>
                              {request.member.isVerified && (
                                <span className="text-coral text-xs font-semibold">✓ Verified</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Requested on {new Date(request.createdAt).toLocaleDateString()} at{" "}
                              {new Date(request.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Pending Admin
                          </span>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            ⏳ Waiting for admin to coordinate the meeting. You'll be notified with the details once confirmed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        {confirmedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">📅 Upcoming Meetings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {confirmedRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Member Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-rausch flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {request.member.user.name?.[0]?.toUpperCase() || "M"}
                      </div>

                      {/* Meeting Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-deep">
                              {request.member.nickname || request.member.user.name || "Member"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                                {request.member.tierClassification === "PREMIUM" ? "Premium" : "Basic"} Member
                              </span>
                              {request.member.isVerified && (
                                <span className="text-coral text-xs font-semibold">✓ Verified</span>
                              )}
                            </div>
                            <div className="mt-3 space-y-2">
                              <p className="text-sm text-gray-900">
                                📅 <span className="font-semibold">Date:</span>{" "}
                                {request.scheduledDate
                                  ? new Date(request.scheduledDate).toLocaleString()
                                  : "TBD"}
                              </p>
                              <p className="text-sm text-gray-900">
                                📍 <span className="font-semibold">Location:</span>{" "}
                                {request.luneLocation || "TBD"}
                              </p>
                              {request.adminNotes && (
                                <p className="text-sm text-gray-600 mt-2">
                                  💬 <span className="font-semibold">Admin notes:</span>{" "}
                                  {request.adminNotes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-coral/20 text-coral text-xs font-semibold rounded-full">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Past Meetings */}
        {completedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-deep mb-4">✅ Past Meetings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {completedRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors opacity-75">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {request.member.user.name?.[0]?.toUpperCase() || "M"}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-deep">
                              {request.member.nickname || request.member.user.name || "Member"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Completed on{" "}
                              {request.scheduledDate
                                ? new Date(request.scheduledDate).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingRequests.length === 0 &&
          confirmedRequests.length === 0 &&
          completedRequests.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📬</div>
              <h3 className="text-xl font-semibold text-deep mb-2">No Meeting Requests Yet</h3>
              <p className="text-gray-600 mb-6">
                You'll see meeting requests from members here
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
