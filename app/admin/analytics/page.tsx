"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { dbHelpers } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AnalyticsData {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  salesGrowth: number
  orderGrowth: number
  customerGrowth: number
  topProducts: Array<{
    name: string
    sales: number
    percentage: number
  }>
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
    status: string
    date: string
  }>
  salesByMonth: Array<{
    month: string
    sales: number
  }>
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    topProducts: [],
    recentOrders: [],
    salesByMonth: []
  })

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      console.log("🔄 Loading analytics data for timeRange:", timeRange)
      const analyticsData = await dbHelpers.getAnalyticsData(parseInt(timeRange))
      console.log("📊 Analytics data loaded:", analyticsData)
      
      // Validate the data
      if (!analyticsData) {
        console.error("❌ No analytics data returned")
        toast.error("No analytics data received from database")
        return
      }
      
      // Check if we have any meaningful data
      const hasData = analyticsData.totalSales > 0 || 
                     analyticsData.totalOrders > 0 || 
                     analyticsData.totalProducts > 0
      
      console.log("📈 Has meaningful data:", hasData)
      console.log("💰 Total Sales:", analyticsData.totalSales)
      console.log("📦 Total Orders:", analyticsData.totalOrders)
      console.log("👥 Total Customers:", analyticsData.totalCustomers)
      console.log("🏷️ Total Products:", analyticsData.totalProducts)
      console.log("🔥 Top Products:", analyticsData.topProducts.length)
      console.log("📋 Recent Orders:", analyticsData.recentOrders.length)
      
      setAnalytics(analyticsData)
      
      if (!hasData) {
        toast.info("No sales or order data found for the selected time period. Try adding some sample data.")
      }
    } catch (error: any) {
      console.error("❌ Failed to load analytics:", error)
      toast.error(`Failed to load analytics data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Track your store performance and insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-3xl font-bold text-gray-900">
                    Ksh {analytics.totalSales.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 ${getGrowthColor(analytics.salesGrowth)}`}>
                    {getGrowthIcon(analytics.salesGrowth)}
                    <span className="text-sm font-medium">
                      {analytics.salesGrowth >= 0 ? "+" : ""}{analytics.salesGrowth}%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
                  <div className={`flex items-center gap-1 mt-1 ${getGrowthColor(analytics.orderGrowth)}`}>
                    {getGrowthIcon(analytics.orderGrowth)}
                    <span className="text-sm font-medium">
                      {analytics.orderGrowth >= 0 ? "+" : ""}{analytics.orderGrowth}%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
                  <div className={`flex items-center gap-1 mt-1 ${getGrowthColor(analytics.customerGrowth)}`}>
                    {getGrowthIcon(analytics.customerGrowth)}
                    <span className="text-sm font-medium">
                      {analytics.customerGrowth >= 0 ? "+" : ""}{analytics.customerGrowth}%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
                  <div className="flex items-center gap-1 mt-1 text-gray-500">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">In Stock</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Products
                </CardTitle>
                <CardDescription>Best performing products by sales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">Ksh {product.sales.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{product.percentage}%</p>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${product.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No product sales data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.recentOrders.length > 0 ? (
                  analytics.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Ksh {order.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent orders available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Sales by Month
              </CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.salesByMonth.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {analytics.salesByMonth.map((month, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">{month.month}</p>
                      <p className="text-lg font-bold text-gray-900">Ksh {month.sales.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No sales data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 bg-yellow-50/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Activity className="w-5 h-5" />
                  Debug Information
                </CardTitle>
                <CardDescription className="text-yellow-700">Development mode only</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Time Range:</strong> {timeRange} days</p>
                    <p><strong>Total Sales:</strong> Ksh {analytics.totalSales.toLocaleString()}</p>
                    <p><strong>Total Orders:</strong> {analytics.totalOrders}</p>
                  </div>
                  <div>
                    <p><strong>Total Customers:</strong> {analytics.totalCustomers}</p>
                    <p><strong>Total Products:</strong> {analytics.totalProducts}</p>
                    <p><strong>Data Points:</strong> {analytics.topProducts.length + analytics.recentOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
} 