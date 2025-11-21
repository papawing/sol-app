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
      member: true,
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
      BASIC: "bg-gray-100 text-gray-800 border-gray-200",
      PREMIUM: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return styles[tier as keyof typeof styles] || styles.BASIC
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🌙</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">
            Member Management
          </h1>
          <p className="text-gray-600">
            Review and manage member verifications, tiers, and access
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-deep">{members.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingMembers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-900">{approvedMembers.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
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
                  className="bg-white rounded-lg p-6 border-2 border-yellow-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTierBadge(
                            user.member?.tier || "BASIC"
                          )}`}
                        >
                          {user.member?.tier || "BASIC"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={`/api/admin/members/${user.id}/approve`} method="POST">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                        >
                          ✓ Approve
                        </button>
                      </form>
                      <form action={`/api/admin/members/${user.id}/reject`} method="POST">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
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

        {/* Approved Members Section */}
        {approvedMembers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-deep mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Approved Members ({approvedMembers.length})
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvedMembers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-deep">{user.nickname}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTierBadge(
                            user.member?.tier || "BASIC"
                          )}`}
                        >
                          {user.member?.tier || "BASIC"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm text-rausch hover:underline font-semibold">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden opacity-75">
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
