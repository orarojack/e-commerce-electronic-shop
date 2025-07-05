"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Package,
  Truck,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { supabase, type OrderWithItems } from "@/lib/supabase"
import { useSettings } from "@/lib/settings-context"
import { toast } from "sonner"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const { settings } = useSettings()

  const [editFormData, setEditFormData] = useState({
    order_status: "",
    payment_status: "",
    tracking_number: "",
    notes: "",
  })

  const formatCurrency = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString()}`
  }

  const orderStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "processing", label: "Processing", color: "bg-blue-500" },
    { value: "shipped", label: "Shipped", color: "bg-purple-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  ]

  const paymentStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "paid", label: "Paid", color: "bg-green-500" },
    { value: "failed", label: "Failed", color: "bg-red-500" },
    { value: "refunded", label: "Refunded", color: "bg-gray-500" },
  ]

  const whatsappNumber = "254703781668"

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, paymentFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_phone.includes(searchTerm) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.order_status === statusFilter)
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((order) => order.payment_status === paymentFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleViewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEditOrder = (order: OrderWithItems) => {
    setSelectedOrder(order)
    setEditFormData({
      order_status: order.order_status,
      payment_status: order.payment_status,
      tracking_number: "",
      notes: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: editFormData.order_status,
          payment_status: editFormData.payment_status,
        })
        .eq("id", selectedOrder.id)

      if (error) throw error

      toast.success("Order updated successfully")
      setIsEditDialogOpen(false)
      fetchOrders()

      // Send WhatsApp notification to customer
      if (editFormData.order_status !== selectedOrder.order_status) {
        sendStatusUpdateToWhatsApp(selectedOrder, editFormData.order_status)
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order")
    }
  }

  const sendStatusUpdateToWhatsApp = (order: OrderWithItems, newStatus: string) => {
    const message = `Order Status Update\n\nHi ${order.customer_name},\n\nYour order #${order.id.slice(0, 8)} has been updated to: ${newStatus.toUpperCase()}\n\nOrder Total: ${formatCurrency(order.total_amount)}\n\nThank you for shopping with ${settings.storeName}!`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId)

      if (error) throw error

      toast.success("Order deleted successfully")
      fetchOrders()
    } catch (error) {
      console.error("Error deleting order:", error)
      toast.error("Failed to delete order")
    }
  }

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statuses = type === "order" ? orderStatuses : paymentStatuses
    const statusConfig = statuses.find((s) => s.value === status)

    return (
      <Badge className={`${statusConfig?.color || "bg-gray-500"} text-white`}>{statusConfig?.label || status}</Badge>
    )
  }

  const exportOrders = () => {
    const csvContent = [
      [
        "Order ID",
        "Customer",
        "Email",
        "Phone",
        "Total",
        "Payment Method",
        "Order Status",
        "Payment Status",
        "Date",
      ].join(","),
      ...filteredOrders.map((order) =>
        [
          order.id.slice(0, 8),
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.total_amount,
          order.payment_method,
          order.order_status,
          order.payment_status,
          new Date(order.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>
        <Button onClick={exportOrders} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.order_status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.order_status === "shipped").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPaymentFilter("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.order_status, "order")}</TableCell>
                    <TableCell>{getStatusBadge(order.payment_status, "payment")}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedOrder.customer_email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-sm text-gray-600 mt-1">{selectedOrder.shipping_address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Order Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedOrder.order_status, "order")}</div>
                  </div>
                  <div>
                    <span className="font-medium">Payment Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedOrder.payment_status, "payment")}</div>
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {selectedOrder.payment_method}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Order Date:</span>
                    <span className="ml-2">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.products.image_url || "/placeholder.svg?height=64&width=64"}
                            alt={item.products.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{item.products.name}</h4>
                            <p className="text-sm text-gray-500">Unit Price: {formatCurrency(item.price)}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order - #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOrder} className="space-y-4">
            <div>
              <Label htmlFor="order_status">Order Status</Label>
              <Select
                value={editFormData.order_status}
                onValueChange={(value) => setEditFormData({ ...editFormData, order_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select
                value={editFormData.payment_status}
                onValueChange={(value) => setEditFormData({ ...editFormData, payment_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tracking_number">Tracking Number (Optional)</Label>
              <Input
                id="tracking_number"
                value={editFormData.tracking_number}
                onChange={(e) => setEditFormData({ ...editFormData, tracking_number: e.target.value })}
                placeholder="Enter tracking number"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                placeholder="Add any notes about this order"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Order</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
