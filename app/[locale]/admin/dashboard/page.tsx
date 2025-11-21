import { redirect, Link } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import UserMenu from "@/components/shared/UserMenu"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations()

  // Protect admin route
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch real dashboard stats
  const [
    pendingMembersCount,
    activeCastsCount,
    pendingRequestsCount,
    totalMembersCount,
    totalCastsCount,
    recentMembers,
    recentRequests,
  ] = await Promise.all([
    // Pending members awaiting verification
    prisma.user.count({
      where: {
        role: "MEMBER",
        verificationStatus: "PENDING",
      },
    }),
    // Active casts
    prisma.cast.count({
      where: { isActive: true },
    }),
    // Pending meeting requests
    prisma.meetingRequest.count({
      where: { status: "PENDING" },
    }),
    // Total members
    prisma.user.count({
      where: { role: "MEMBER" },
    }),
    // Total casts
    prisma.user.count({
      where: { role: "CAST" },
    }),
    // Recent members for quick review
    prisma.user.findMany({
      where: {
        role: "MEMBER",
        verificationStatus: "PENDING",
      },
      include: {
        member: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    // Recent pending meeting requests
    prisma.meetingRequest.findMany({
      where: { status: "PENDING" },
      include: {
        member: {
          include: {
            user: {
              select: {
                nickname: true,
                email: true,
              },
            },
          },
        },
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
      take: 5,
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="font-display text-xl font-bold text-deep">
                {t("common.appName")} Admin
              </span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">
            {t("admin.dashboard") || "Admin Dashboard"}
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user.nickname || "Admin"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pending Members */}
          <div className={`bg-white rounded-xl p-6 shadow-sm border ${
            pendingMembersCount > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Pending Members</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-deep">{pendingMembersCount}</p>
            <p className="text-xs text-gray-500 mt-2">
              {totalMembersCount} total members
            </p>
          </div>

          {/* Active Casts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Active Casts</h3>
              <span className="text-2xl">💃</span>
            </div>
            <p className="text-3xl font-bold text-deep">{activeCastsCount}</p>
            <p className="text-xs text-gray-500 mt-2">
              {totalCastsCount} total casts
            </p>
          </div>

          {/* Pending Requests */}
          <div className={`bg-white rounded-xl p-6 shadow-sm border ${
            pendingRequestsCount > 0 ? 'border-green-200 bg-green-50' : 'border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Meeting Requests</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-deep">{pendingRequestsCount}</p>
            <p className="text-xs text-gray-500 mt-2">Pending coordination</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-deep mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/members"
              locale={locale}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-semibold text-deep">Manage Members</div>
            </Link>
            <Link
              href="/admin/casts"
              locale={locale}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">💃</div>
              <div className="text-sm font-semibold text-deep">Manage Casts</div>
            </Link>
            <Link
              href="/admin/meeting-requests"
              locale={locale}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all text-center"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-semibold text-deep">Meeting Requests</div>
            </Link>
            {/* Activity Log - Coming Soon */}
            <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 text-center opacity-50 cursor-not-allowed">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-semibold text-gray-500">Activity Log (Coming Soon)</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Pending Member Verifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-deep mb-4 flex items-center justify-between">
              <span>Pending Verifications</span>
              {recentMembers.length > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {recentMembers.length}
                </span>
              )}
            </h2>
            {recentMembers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No pending member verifications
              </p>
            ) : (
              <div className="space-y-3">
                {recentMembers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-deep">{user.nickname}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            {user.member?.tier || "BASIC"}
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            PENDING
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/admin/members"
                        locale={locale}
                        className="text-xs text-rausch hover:underline font-semibold"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Meeting Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-deep mb-4 flex items-center justify-between">
              <span>Pending Meetings</span>
              {recentRequests.length > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {recentRequests.length}
                </span>
              )}
            </h2>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No pending meeting requests
              </p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-deep text-sm">
                          {request.member.user.nickname} → {request.cast.user.nickname}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          AWAITING COORDINATION
                        </span>
                      </div>
                      <Link
                        href="/admin/meeting-requests"
                        locale={locale}
                        className="text-xs text-rausch hover:underline font-semibold"
                      >
                        Coordinate →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
