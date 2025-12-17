import { Link } from "@/i18n/routing"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CastDashboardPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations()

  // Protect cast route
  if (!session || session.user.role !== "CAST") {
    redirect(`/${locale}/login`)
  }

  // Get cast profile with stats
  const cast = await prisma.cast.findUnique({
    where: { userId: session.user.id },
    include: {
      photos: true,
      meetingRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })

  if (!cast) {
    redirect(`/${locale}/login`)
  }

  // Calculate stats
  const [pendingCount, confirmedCount, completedCount, totalBookmarks] = await Promise.all([
    prisma.meetingRequest.count({
      where: { castId: cast.id, status: "PENDING" },
    }),
    prisma.meetingRequest.count({
      where: { castId: cast.id, status: "CONFIRMED" },
    }),
    prisma.meetingRequest.count({
      where: { castId: cast.id, status: "COMPLETED" },
    }),
    prisma.bookmark.count({
      where: { castId: cast.id },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-deep">
              Cast Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {cast.user.name || "Cast"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Status Banner */}
        <div
          className={`rounded-lg p-6 mb-8 ${
            cast.isActive
              ? "bg-green-50 border border-green-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">
              {cast.isActive ? "✅" : "⚠️"}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                {cast.isActive ? "Profile Active" : "Profile Inactive"}
              </h3>
              <p className="text-sm text-gray-700">
                {cast.isActive
                  ? "Your profile is visible to members and accepting meeting requests."
                  : "Your profile is currently inactive. Contact admin to activate your profile."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-airbnb-md shadow-airbnb-md border border-gray-100">
            <div className="text-2xl font-bold text-deep">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </div>
          <div className="bg-white p-6 rounded-airbnb-md shadow-airbnb-md border border-gray-100">
            <div className="text-2xl font-bold text-teal-600">{confirmedCount}</div>
            <div className="text-sm text-gray-600">Upcoming Meetings</div>
          </div>
          <div className="bg-white p-6 rounded-airbnb-md shadow-airbnb-md border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-airbnb-md shadow-airbnb-md border border-gray-100">
            <div className="text-2xl font-bold text-teal">{totalBookmarks}</div>
            <div className="text-sm text-gray-600">Bookmarks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Meeting Requests */}
            <div className="bg-white rounded-airbnb-md shadow-airbnb-md border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-deep">Recent Meeting Requests</h2>
                <Link
                  href="/cast/requests"
                  locale={locale}
                  className="text-sm text-teal hover:text-red-700 font-semibold"
                >
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {cast.meetingRequests.length > 0 ? (
                  cast.meetingRequests.map((request) => (
                    <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-rausch flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {request.member.user.name?.[0]?.toUpperCase() || "M"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-deep truncate">
                              {request.member.nickname || request.member.user.name || "Member"}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                                request.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "CONFIRMED"
                                  ? "bg-teal-100 text-teal-800"
                                  : request.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()} at{" "}
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">No meeting requests yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Profile Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-airbnb-md shadow-airbnb-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-deep mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/cast/requests"
                  locale={locale}
                  className="block w-full px-4 py-3 bg-[#FF5A5F] hover:bg-[#E61E4D] text-white font-semibold rounded-lg hover:scale-[1.02] transition-transform text-center"
                >
                  📅 View Requests
                </Link>
                <button
                  disabled
                  className="block w-full px-4 py-3 border-2 border-gray-200 text-gray-400 font-semibold rounded-lg text-center cursor-not-allowed"
                >
                  ✏️ Edit Profile (Coming Soon)
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-airbnb-md shadow-airbnb-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-deep mb-4">Profile Summary</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Tier</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        cast.tierClassification === "HIGH_CLASS"
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cast.tierClassification === "HIGH_CLASS" ? "High Class" : "Standard"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        cast.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cast.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Photos</div>
                  <div className="text-sm font-semibold text-deep">
                    {cast.photos.length} uploaded
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Featured</div>
                  <div className="text-sm font-semibold text-deep">
                    {cast.isFeatured ? "Yes ⭐" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
