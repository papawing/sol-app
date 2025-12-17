import { redirect } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { Link } from "@/i18n/routing"
import UserMenu from "@/components/shared/UserMenu"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminCastsPage({ params }: PageProps) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations()

  // Protect admin route
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch all casts with their details
  const casts = await prisma.user.findMany({
    where: { role: "CAST" },
    include: {
      cast: {
        include: {
          photos: {
            take: 1,
            orderBy: { displayOrder: "asc" },
          },
        },
      },
    },
    orderBy: [
      { verificationStatus: "asc" }, // PENDING first
      { createdAt: "desc" },
    ],
  })

  // Categorize casts
  const pendingCasts = casts.filter((c) => c.verificationStatus === "PENDING")
  const approvedCasts = casts.filter((c) => c.verificationStatus === "APPROVED")
  const activeCasts = casts.filter((c) => c.cast?.isActive === true)
  const inactiveCasts = casts.filter((c) => c.cast?.isActive === false)

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  const getTierBadge = (tier: string) => {
    const styles = {
      STANDARD: "bg-blue-100 text-blue-800 border-blue-200",
      HIGH_CLASS: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return styles[tier as keyof typeof styles] || styles.STANDARD
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
              <span className="text-sm font-semibold text-gray-600">Casts</span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep mb-2">
              Cast Management
            </h1>
            <p className="text-gray-600">
              Review and manage cast verifications, profiles, and availability
            </p>
          </div>
          <Link
            href="/admin/casts/new"
            className="px-4 py-2 bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>+</span> Create Cast
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Casts</p>
            <p className="text-2xl font-bold text-deep">{casts.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingCasts.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-900">{activeCasts.length}</p>
          </div>
          <div className="bg-gray-50 rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-700">{inactiveCasts.length}</p>
          </div>
        </div>

        {/* Pending Casts Section */}
        {pendingCasts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              Pending Verifications ({pendingCasts.length})
            </h2>
            <div className="space-y-4">
              {pendingCasts.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        {user.cast?.photos[0]?.photoUrl ? (
                          <img
                            src={user.cast.photos[0].photoUrl}
                            alt={user.nickname}
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
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-deep">{user.nickname}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            user.verificationStatus
                          )}`}
                        >
                          {user.verificationStatus}
                        </span>
                        {user.cast && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTierBadge(
                              user.cast.tierClassification
                            )}`}
                          >
                            {user.cast.tierClassification}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      {user.cast && (
                        <div className="flex gap-2 text-xs text-gray-500 mb-2">
                          <span>Age: {user.cast.age}</span>
                          <span>•</span>
                          <span>Languages: {user.cast.languages.join(", ")}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <form action={`/api/admin/casts/${user.id}/approve`} method="POST">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          ✓ Approve
                        </button>
                      </form>
                      <form action={`/api/admin/casts/${user.id}/reject`} method="POST">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          ✗ Reject
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Casts Section */}
        {activeCasts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Active Casts ({activeCasts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCasts.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {user.cast?.photos[0]?.photoUrl ? (
                        <img
                          src={user.cast.photos[0].photoUrl}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-deep truncate">{user.nickname}</h3>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      {user.cast && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">Age: {user.cast.age}</p>
                          <span
                            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${getTierBadge(
                              user.cast.tierClassification
                            )}`}
                          >
                            {user.cast.tierClassification}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {user.cast?.id && (
                      <Link
                        href={`/admin/casts/${user.cast.id}/edit`}
                        className="flex-1 text-center text-xs bg-gray-100 hover:bg-gray-200 py-1 rounded font-semibold text-gray-700 transition-colors"
                      >
                        Edit
                      </Link>
                    )}
                    {user.cast?.id ? (
                      <Link
                        href={`/browse/${user.cast.id}`}
                        className="flex-1 text-center text-xs text-teal hover:underline font-semibold py-1"
                      >
                        View
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 text-center text-xs text-gray-400 cursor-not-allowed font-semibold"
                      >
                        No Profile
                      </button>
                    )}
                    <form action={`/api/admin/casts/${user.id}/deactivate`} method="POST" className="flex-1">
                      <button
                        type="submit"
                        className="w-full text-xs text-gray-600 hover:underline font-semibold py-1"
                      >
                        Deactivate
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Inactive Casts Section */}
        {inactiveCasts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">💤</span>
              Inactive Casts ({inactiveCasts.length})
            </h2>
            <div className="bg-white rounded-airbnb-md border border-gray-100 overflow-hidden opacity-75">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Cast
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inactiveCasts.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-600">{user.nickname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {user.cast && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTierBadge(
                              user.cast.tierClassification
                            )}`}
                          >
                            {user.cast.tierClassification}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <form action={`/api/admin/casts/${user.id}/activate`} method="POST">
                          <button
                            type="submit"
                            className="text-sm text-green-600 hover:underline font-semibold"
                          >
                            Reactivate
                          </button>
                        </form>
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
