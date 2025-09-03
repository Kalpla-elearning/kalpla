import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getPaymentStats() {
  const [
    totalPayments,
    successfulPayments,
    pendingPayments,
    failedPayments,
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    totalOrders,
    pendingOrders,
    totalRefunds,
    recentPayments,
    recentOrders
  ] = await Promise.all([
    // Total payments
    prisma.payment.count(),
    // Successful payments
    prisma.payment.count({ where: { status: 'SUCCESS' } }),
    // Pending payments
    prisma.payment.count({ where: { status: 'PENDING' } }),
    // Failed payments
    prisma.payment.count({ where: { status: 'FAILED' } }),
    // Total revenue
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    // This month revenue
    prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    }),
    // Last month revenue
    prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    }),
    // Total orders
    prisma.order.count(),
    // Pending orders
    prisma.order.count({ where: { status: 'PENDING' } }),
    // Total refunds
    prisma.payment.count({ where: { status: 'REFUNDED' } }),
    // Recent payments
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        order: {
          select: { orderNumber: true, itemTitle: true }
        }
      }
    }),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        payments: {
          select: { status: true, amount: true }
        }
      }
    })
  ])

  // Calculate revenue growth
  const currentRevenue = thisMonthRevenue._sum.amount || 0
  const previousRevenue = lastMonthRevenue._sum.amount || 0
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  return {
    totalPayments,
    successfulPayments,
    pendingPayments,
    failedPayments,
    totalRevenue: totalRevenue._sum.amount || 0,
    thisMonthRevenue: currentRevenue,
    lastMonthRevenue: previousRevenue,
    revenueGrowth,
    totalOrders,
    pendingOrders,
    totalRefunds,
    recentPayments,
    recentOrders
  }
}

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const stats = await getPaymentStats()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Monitor payments, orders, and process refunds</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/payments/orders"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <CreditCardIcon className="h-5 w-5 mr-2" />
            View Orders
          </Link>
          <Link
            href="/admin/payments/refunds"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Process Refunds
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {stats.revenueGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs font-medium ${
                  stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              <p className="text-xs text-gray-500">{stats.successfulPayments} successful</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">{stats.pendingPayments} pending payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRefunds}</p>
              <p className="text-xs text-gray-500">{stats.failedPayments} failed payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/payments/orders"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500 bg-opacity-10">
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and manage all orders and transactions</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments/refunds"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500 bg-opacity-10">
              <ArrowPathIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Process Refunds</h3>
              <p className="text-sm text-gray-600">Handle refund requests and process returns</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments/analytics"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500 bg-opacity-10">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Analytics</h3>
              <p className="text-sm text-gray-600">View detailed payment reports and insights</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments/failed"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-500 bg-opacity-10">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Failed Payments</h3>
              <p className="text-sm text-gray-600">Review and resolve failed transactions</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments/pending"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-500 bg-opacity-10">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Payments</h3>
              <p className="text-sm text-gray-600">Monitor pending payment confirmations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/payments/settings"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-500 bg-opacity-10">
              <PencilIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
              <p className="text-sm text-gray-600">Configure payment gateways and settings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
              <Link
                href="/admin/payments/orders"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentPayments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCardIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {payment.order?.itemTitle || 'Unknown Item'}
                        </h4>
                        <p className="text-sm text-gray-600">{payment.user.name}</p>
                        <p className="text-xs text-gray-500">Order: {payment.order?.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{payment.amount?.toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-600">Payments will appear here once transactions are processed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                href="/admin/payments/orders"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCardIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{order.itemTitle}</h4>
                        <p className="text-sm text-gray-600">{order.user.name}</p>
                        <p className="text-xs text-gray-500">Order: {order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/admin/payments/orders/${order.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Orders will appear here once customers make purchases.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-8 space-y-4">
        {stats.pendingPayments > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {stats.pendingPayments} payment{stats.pendingPayments !== 1 ? 's' : ''} pending confirmation
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Monitor these payments for successful completion.
                </p>
              </div>
              <div className="ml-auto">
                <Link
                  href="/admin/payments/pending"
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  View Pending
                </Link>
              </div>
            </div>
          </div>
        )}

        {stats.failedPayments > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {stats.failedPayments} payment{stats.failedPayments !== 1 ? 's' : ''} failed
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Review and resolve failed payment transactions.
                </p>
              </div>
              <div className="ml-auto">
                <Link
                  href="/admin/payments/failed"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Review Failed
                </Link>
              </div>
            </div>
          </div>
        )}

        {stats.pendingOrders > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  {stats.pendingOrders} order{stats.pendingOrders !== 1 ? 's' : ''} pending payment
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  These orders are waiting for payment confirmation.
                </p>
              </div>
              <div className="ml-auto">
                <Link
                  href="/admin/payments/orders?status=pending"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
