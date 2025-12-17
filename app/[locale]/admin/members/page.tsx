import { redirect } from "@/i18n/routing"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { Link } from "@/i18n/routing"
import UserMenu from "@/components/shared/UserMenu"

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminMembersPage({ params }: PageProps) {
  await params;
  const session = await auth()
  const t = await getTranslations()

  // Protect admin route
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch all members with their details
  const members = await prisma.user.findMany({
    where: { role: "MEMBER" },
    include: {
      member: {
        include: {
          photos: {
            orderBy: { displayOrder: "asc" },
            take: 1,
          },
        },
      },
    },
    orderBy: [
      { verificationStatus: "asc" }, // PENDING first
      { createdAt: "desc" },
    ],
  })

  // Categorize members
  const pendingMembers = members.filter((m) => m.verificationStatus === "PENDING")
  const approvedMembers = members.filter((m) => m.verificationStatus === "APPROVED")
  const rejectedMembers = members.filter((m) => m.verificationStatus === "REJECTED")

  // Further categorize approved members by active status
  const activeMembers = approvedMembers.filter((m) => m.member?.isActive)
  const inactiveMembers = approvedMembers.filter((m) => !m.member?.isActive)

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border border-green-200",
      REJECTED: "bg-red-100 text-red-800 border border-red-200",
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  const getTierBadge = (tier: string) => {
    const styles = {
      STANDARD: "bg-blue-100 text-blue-800 border border-blue-200",
      GOLD: "bg-amber-100 text-amber-800 border border-amber-200",
      VIP: "bg-gold/20 text-rose-gold border border-gold/30",
    }
    return styles[tier as keyof typeof styles] || styles.STANDARD
  }

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-gray-100 text-gray-600 border border-gray-200"
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
              <span className="text-sm font-semibold text-gray-600">Members</span>
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
              Member Management
            </h1>
            <p className="text-gray-600">
              Review and manage member verifications, tiers, and access
            </p>
          </div>
          <Link
            href="/admin/members/new"
            className="px-4 py-2 bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>+</span> Create Member
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-deep">{members.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-airbnb-md p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingMembers.length}</p>
          </div>
          <div className="bg-green-50 rounded-airbnb-md p-4 border border-green-200">
            <p className="text-sm text-green-800 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-900">{activeMembers.length}</p>
          </div>
          <div className="bg-gray-50 rounded-airbnb-md p-4 border border-gray-200">
            <p className="text-sm text-gray-800 mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-900">{inactiveMembers.length}</p>
          </div>
          <div className="bg-red-50 rounded-airbnb-md p-4 border border-red-200">
            <p className="text-sm text-red-800 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{rejectedMembers.length}</p>
          </div>
        </div>

        {/* Pending Members Section */}
        {pendingMembers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              Pending Verifications ({pendingMembers.length})
            </h2>
            <div className="space-y-4">
              {pendingMembers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {user.member?.photos?.[0] ? (
                          <img
                            src={user.member.photos[0].photoUrl}
                            alt={user.nickname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {user.nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-deep">{user.nickname}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTierBadge(user.member?.tier || "STANDARD")}`}>
                          {user.member?.tier || "STANDARD"}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(user.member?.isPaid || false)}`}>
                          {user.member?.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={`/api/admin/members/${user.id}/approve`} method="POST">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          ✓ Approve
                        </button>
                      </form>
                      <form action={`/api/admin/members/${user.id}/reject`} method="POST">
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

        {/* Active Members Section */}
        {activeMembers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Active Members ({activeMembers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMembers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {user.member?.photos?.[0]?.photoUrl ? (
                        <img
                          src={user.member.photos[0].photoUrl}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                          {user.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-deep truncate">{user.nickname}</h3>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      {user.member && (
                        <>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {user.member.age && <span>Age: {user.member.age}</span>}
                            {user.member.location && (
                              <>
                                <span>•</span>
                                <span className="truncate">{user.member.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getTierBadge(user.member.tier)}`}>
                              {user.member.tier}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentBadge(user.member.isPaid)}`}>
                              {user.member.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/admin/members/${user.member?.id}/edit`}
                      className="flex-1 px-3 py-1.5 text-center bg-teal text-white rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors"
                    >
                      Edit
                    </Link>
                    <form action={`/api/admin/members/${user.member?.id}/toggle-active`} method="POST" className="flex-1">
                      <button
                        type="submit"
                        className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
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

        {/* Inactive Members Section */}
        {inactiveMembers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Inactive Members ({inactiveMembers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveMembers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100 hover:shadow-lg transition-shadow opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {user.member?.photos?.[0]?.photoUrl ? (
                        <img
                          src={user.member.photos[0].photoUrl}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                          {user.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-deep truncate">{user.nickname}</h3>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      {user.member && (
                        <>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {user.member.age && <span>Age: {user.member.age}</span>}
                            {user.member.location && (
                              <>
                                <span>•</span>
                                <span className="truncate">{user.member.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getTierBadge(user.member.tier)}`}>
                              {user.member.tier}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getPaymentBadge(user.member.isPaid)}`}>
                              {user.member.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/admin/members/${user.member?.id}/edit`}
                      className="flex-1 text-center py-2 px-4 bg-white text-coral border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <form action={`/api/admin/members/${user.member?.id}/toggle-active`} method="POST" className="flex-1">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
                      >
                        Reactivate
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rejected Members Section */}
        {rejectedMembers.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span>
              Rejected ({rejectedMembers.length})
            </h2>
            <div className="bg-white rounded-airbnb-md border border-gray-100 overflow-hidden opacity-75">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Rejected Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rejectedMembers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-600">{user.nickname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
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
