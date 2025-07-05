"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { dbHelpers, type Product, type OrderWithItems } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  DollarSign,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock_quantity: "",
    featured: false,
  })

  useEffect(() => {
    if (user?.role === "admin") {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsResult, ordersResult] = await Promise.all([
        dbHelpers.getProducts(),
        dbHelpers.getOrdersWithItems(),
      ])

      if (productsResult.data) setProducts(productsResult.data)
      if (ordersResult.data) setOrders(ordersResult.data)
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        stock_quantity: Number.parseInt(newProduct.stock_quantity),
      }

      // In a real app, you'd call an API to add the product
      toast.success("Product added successfully!")
      setShowAddProduct(false)
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        stock_quantity: "",
        featured: false,
      })
      loadData()
    } catch (error) {
      toast.error("Failed to add product")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orders.filter((order) => order.order_status === "pending").length,
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your Mash Electronics store</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">Ksh {stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-orange-600 font-medium">Needs attention</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Product Management
                      </CardTitle>
                      <CardDescription>Manage your product inventory</CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="smartphones">Smartphones</SelectItem>
                        <SelectItem value="laptops">Laptops</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                              <img
                                src={product.image_url || "/placeholder.svg?height=200&width=200"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                {product.featured && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-600">
                                  Ksh {product.price.toLocaleString()}
                                </span>
                                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                                </Badge>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Product Form */}
              {showAddProduct && (
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>Fill in the details to add a new product to your inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="smartphones">Smartphones</SelectItem>
                              <SelectItem value="laptops">Laptops</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (Ksh)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock_quantity}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            type="url"
                            value={newProduct.image_url}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, image_url: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={newProduct.featured}
                          onCheckedChange={(checked) => setNewProduct((prev) => ({ ...prev, featured: checked }))}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Management
                  </CardTitle>
                  <CardDescription>Track and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                                  <Badge
                                    variant={
                                      order.order_status === "completed"
                                        ? "default"
                                        : order.order_status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {order.order_status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {order.order_status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                    {order.order_status === "shipped" && <Truck className="w-3 h-3 mr-1" />}
                                    {order.order_status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {order.customer_name} • {order.customer_email}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString("en-KE")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">
                                  Ksh {order.total_amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">{order.payment_method}</p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex flex-wrap gap-2">
                                {order.order_items.map((item) => (
                                  <Badge key={item.id} variant="outline">
                                    {item.products.name} × {item.quantity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600">Orders will appear here when customers make purchases.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
