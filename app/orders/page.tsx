"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Package,
  Search,
  Calendar,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Filter,
  ShoppingBag,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { dbHelpers, type OrderWithItems } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const orderStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500", icon: Clock },
    { value: "processing", label: "Processing", color: "bg-blue-500", icon: Package },
    { value: "shipped", label: "Shipped", color: "bg-purple-500", icon: Truck },
    { value: "delivered", label: "Delivered", color: "bg-green-500", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500", icon: AlertCircle },
  ]

  const paymentStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "paid", label: "Paid", color: "bg-green-500" },
    { value: "failed", label: "Failed", color: "bg-red-500" },
    { value: "refunded", label: "Refunded", color: "bg-gray-500" },
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = user.id
        ? await dbHelpers.getUserOrders(user.id)
        : await dbHelpers.getOrdersByEmail(user.email)

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_items.some((item) => item.products.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.order_status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statuses = type === "order" ? orderStatuses : paymentStatuses
    const statusConfig = statuses.find((s) => s.value === status)

    return (
      <Badge className={`${statusConfig?.color || "bg-gray-500"} text-white border-0`}>
        {type === "order" && statusConfig?.icon && <statusConfig.icon className="h-3 w-3 mr-1" />}
        {statusConfig?.label || status}
      </Badge>
    )
  }

  const contactSupport = (order: OrderWithItems) => {
    const message = `Hi! I need help with my order #${order.id.slice(0, 8)}\n\nOrder Details:\n- Total: Ksh ${order.total_amount.toLocaleString()}\n- Status: ${order.order_status}\n- Date: ${new Date(order.created_at).toLocaleDateString()}\n\nPlease assist me with this order.`
    const whatsappUrl = `https://wa.me/254700123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              My Orders
            </h1>
            <p className="text-gray-600 text-lg">Track and manage your order history</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders or products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    {orderStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                    }}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {orders.length === 0 ? "No orders yet" : "No orders found"}
              </h3>
              <p className="text-gray-600 mb-8">
                {orders.length === 0
                  ? "Start shopping to see your orders here!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {orders.length === 0 && (
                <Button
                  onClick={() => router.push("/products")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                >
                  Start Shopping
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.order_status, "order")}
                          {getStatusBadge(order.payment_status, "payment")}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Image
                              src={item.products.image_url || "/placeholder.svg?height=60&width=60"}
                              alt={item.products.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.products.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span>Price: Ksh {item.price.toLocaleString()}</span>
                                <span>Quantity: {item.quantity}</span>
                                <span>Total: Ksh {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      {/* Order Summary */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Payment Method: </span>
                            <Badge variant="outline" className="capitalize">
                              {order.payment_method}
                            </Badge>
                          </div>
                          {order.tracking_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Truck className="h-4 w-4" />
                              <span>Tracking: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{order.tracking_number}</code>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">Ksh {order.total_amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Total Amount</div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => contactSupport(order)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
