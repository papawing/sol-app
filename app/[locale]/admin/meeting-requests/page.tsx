import { redirect } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { Link } from "@/i18n/routing"
import { format } from "date-fns"
import UserMenu from "@/components/shared/UserMenu"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminRequestsPage({ params }: PageProps) {
  await params;
  const session = await auth()
  const t = await getTranslations()

  // Protect admin route
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch all meeting requests with full details
  const requests = await prisma.meetingRequest.findMany({
    include: {
      member: {
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              email: true,
              verificationStatus: true,
            },
          },
        },
      },
      cast: {
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              email: true,
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
  })

  // Categorize requests
  const pendingRequests = requests.filter((r) => r.status === "PENDING")
  const confirmedRequests = requests.filter((r) => r.status === "CONFIRMED")
  const completedRequests = requests.filter((r) => r.status === "COMPLETED")
  const cancelledRequests = requests.filter((r) => r.status === "CANCELLED")

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">☀️</span>
                <span className="font-display text-xl font-bold text-deep">
                  {t("common.appName")} Admin
                </span>
              </Link>
              <span className="text-sm text-gray-400">→</span>
              <span className="text-sm font-semibold text-gray-600">Meeting Requests</span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">
            Meeting Requests Coordination
          </h1>
          <p className="text-gray-600">
            Coordinate and manage meeting requests between members and casts
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-deep">{requests.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingRequests.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-900">{confirmedRequests.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-900">{completedRequests.length}</p>
          </div>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              Awaiting Coordination ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Cast Photo */}
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

                    {/* Request Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-deep mb-1">
                            {request.member.user.nickname} → {request.cast.user.nickname}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{request.member.user.email}</span>
                            <span>•</span>
                            <span>{request.cast.user.email}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Requested {format(new Date(request.requestedAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>

                      {/* Coordination Form */}
                      <form action={`/api/admin/meeting-requests/${request.id}/confirm`} method="POST" className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`date-${request.id}`} className="block text-xs font-semibold text-gray-700 mb-1">
                              Meeting Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              id={`date-${request.id}`}
                              name="scheduledDate"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rausch focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label htmlFor={`location-${request.id}`} className="block text-xs font-semibold text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              id={`location-${request.id}`}
                              name="luneLocation"
                              placeholder="e.g., Lune Lounge, Room A"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rausch focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`notes-${request.id}`} className="block text-xs font-semibold text-gray-700 mb-1">
                            Admin Notes (Optional)
                          </label>
                          <textarea
                            id={`notes-${request.id}`}
                            name="adminNotes"
                            rows={2}
                            placeholder="Any special instructions or notes for both parties"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rausch focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md text-sm"
                          >
                            ✓ Confirm Meeting
                          </button>
                        </div>
                      </form>
                      <form action={`/api/admin/meeting-requests/${request.id}/cancel`} method="POST" className="mt-2">
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          ✗ Cancel Request
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed Requests Section */}
        {confirmedRequests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Confirmed Meetings ({confirmedRequests.length})
            </h2>
            <div className="space-y-3">
              {confirmedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-deep text-sm mb-1">
                        {request.member.user.nickname} ↔ {request.cast.user.nickname}
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
                      {request.adminNotes && (
                        <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded">
                          {request.adminNotes}
                        </p>
                      )}
                    </div>
                    <form action={`/api/admin/meeting-requests/${request.id}/complete`} method="POST">
                      <button
                        type="submit"
                        className="text-sm text-blue-600 hover:underline font-semibold"
                      >
                        Mark Complete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed & Cancelled History */}
        {(completedRequests.length > 0 || cancelledRequests.length > 0) && (
          <section>
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              History ({completedRequests.length + cancelledRequests.length})
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden opacity-75">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Cast
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Meeting Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...completedRequests, ...cancelledRequests].map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-700">{request.member.user.nickname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-700">{request.cast.user.nickname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {request.scheduledDate
                            ? format(new Date(request.scheduledDate), "MMM d, yyyy")
                            : "Not scheduled"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
