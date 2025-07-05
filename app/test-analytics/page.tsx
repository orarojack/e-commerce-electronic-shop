"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { 
  Database, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function TestAnalyticsPage() {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const [errors, setErrors] = useState<string[]>([])

  const runDatabaseTests = async () => {
    setLoading(true)
    setErrors([])
    const results: any = {}
    
    console.log("🧪 Starting database tests...")

    try {
      // Test 1: Check products table
      console.log("📦 Testing products table...")
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, price, created_at")
        .limit(5)

      if (productsError) {
        setErrors(prev => [...prev, `Products error: ${productsError.message}`])
        results.products = { error: productsError.message }
      } else {
        results.products = { 
          count: products?.length || 0, 
          data: products?.slice(0, 3) || [],
          success: true 
        }
      }

      // Test 2: Check orders table
      console.log("📋 Testing orders table...")
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, customer_name, total_amount, order_status, created_at")
        .limit(5)

      if (ordersError) {
        setErrors(prev => [...prev, `Orders error: ${ordersError.message}`])
        results.orders = { error: ordersError.message }
      } else {
        results.orders = { 
          count: orders?.length || 0, 
          data: orders?.slice(0, 3) || [],
          success: true 
        }
      }

      // Test 3: Check order_items table
      console.log("📦 Testing order_items table...")
      const { data: orderItems, error: orderItemsError } = await supabase
        .from("order_items")
        .select(`
          id,
          quantity,
          price,
          order_id,
          product_id,
          products (
            name
          )
        `)
        .limit(5)

      if (orderItemsError) {
        setErrors(prev => [...prev, `Order items error: ${orderItemsError.message}`])
        results.orderItems = { error: orderItemsError.message }
      } else {
        results.orderItems = { 
          count: orderItems?.length || 0, 
          data: orderItems?.slice(0, 3) || [],
          success: true 
        }
      }

      // Test 4: Check recent orders with items
      console.log("🔗 Testing orders with items...")
      const { data: ordersWithItems, error: ordersWithItemsError } = await supabase
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
        .limit(3)

      if (ordersWithItemsError) {
        setErrors(prev => [...prev, `Orders with items error: ${ordersWithItemsError.message}`])
        results.ordersWithItems = { error: ordersWithItemsError.message }
      } else {
        results.ordersWithItems = { 
          count: ordersWithItems?.length || 0, 
          data: ordersWithItems?.map(order => ({
            id: order.id,
            customer: order.customer_name,
            total: order.total_amount,
            items: order.order_items?.length || 0
          })) || [],
          success: true 
        }
      }

      // Test 5: Calculate analytics manually
      console.log("📊 Calculating analytics manually...")
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const { data: recentOrders, error: recentOrdersError } = await supabase
        .from("orders")
        .select("total_amount, order_status, created_at")
        .gte("created_at", startDate.toISOString())

      if (recentOrdersError) {
        setErrors(prev => [...prev, `Recent orders error: ${recentOrdersError.message}`])
        results.analytics = { error: recentOrdersError.message }
      } else {
        const totalSales = recentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
        const deliveredOrders = recentOrders?.filter(order => order.order_status === 'delivered').length || 0
        
        results.analytics = {
          totalSales,
          totalOrders: recentOrders?.length || 0,
          deliveredOrders,
          success: true
        }
      }

      console.log("✅ All tests completed")
      setTestResults(results)

    } catch (error: any) {
      console.error("❌ Test failed:", error)
      setErrors(prev => [...prev, `General error: ${error.message}`])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDatabaseTests()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Database Test
            </h1>
            <p className="text-gray-600 mt-1">Testing database connectivity and data for analytics</p>
          </div>
          <Button onClick={runDatabaseTests} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Testing..." : "Run Tests"}
          </Button>
        </div>

        {/* Error Summary */}
        {errors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                Errors Found ({errors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Test */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products Table
                {testResults.products?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : testResults.products?.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </CardTitle>
              <CardDescription>Testing products data</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.products?.success ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600">{testResults.products.count}</p>
                  <p className="text-sm text-gray-600">Products found</p>
                  {testResults.products.data.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sample products:</p>
                      {testResults.products.data.map((product: any, index: number) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {product.name} - Ksh {product.price?.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : testResults.products?.error ? (
                <div className="text-red-600">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{testResults.products.error}</p>
                </div>
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </CardContent>
          </Card>

          {/* Orders Test */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Orders Table
                {testResults.orders?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : testResults.orders?.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </CardTitle>
              <CardDescription>Testing orders data</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.orders?.success ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">{testResults.orders.count}</p>
                  <p className="text-sm text-gray-600">Orders found</p>
                  {testResults.orders.data.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sample orders:</p>
                      {testResults.orders.data.map((order: any, index: number) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {order.customer_name} - Ksh {order.total_amount?.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : testResults.orders?.error ? (
                <div className="text-red-600">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{testResults.orders.error}</p>
                </div>
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </CardContent>
          </Card>

          {/* Order Items Test */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items Table
                {testResults.orderItems?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : testResults.orderItems?.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </CardTitle>
              <CardDescription>Testing order items data</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.orderItems?.success ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-purple-600">{testResults.orderItems.count}</p>
                  <p className="text-sm text-gray-600">Order items found</p>
                  {testResults.orderItems.data.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sample items:</p>
                      {testResults.orderItems.data.map((item: any, index: number) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {item.products?.name || 'Unknown'} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : testResults.orderItems?.error ? (
                <div className="text-red-600">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{testResults.orderItems.error}</p>
                </div>
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Test */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Analytics Calculation
                {testResults.analytics?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : testResults.analytics?.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </CardTitle>
              <CardDescription>Testing analytics calculations</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.analytics?.success ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      Ksh {testResults.analytics.totalSales?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total sales (30 days)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{testResults.analytics.totalOrders}</p>
                      <p className="text-xs text-gray-600">Total orders</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{testResults.analytics.deliveredOrders}</p>
                      <p className="text-xs text-gray-600">Delivered</p>
                    </div>
                  </div>
                </div>
              ) : testResults.analytics?.error ? (
                <div className="text-red-600">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{testResults.analytics.error}</p>
                </div>
              ) : (
                <div className="text-gray-500">Loading...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Next steps based on test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!testResults.products?.success || testResults.products?.count === 0) && (
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <p className="font-medium text-yellow-800">⚠️ No Products Found</p>
                  <p className="text-yellow-700 text-sm">Add some products to your catalog first</p>
                </div>
              )}
              
              {(!testResults.orders?.success || testResults.orders?.count === 0) && (
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <p className="font-medium text-yellow-800">⚠️ No Orders Found</p>
                  <p className="text-yellow-700 text-sm">Run the sample data script: <code className="bg-yellow-200 px-1 rounded">node scripts/add-sample-data.js</code></p>
                </div>
              )}
              
              {testResults.analytics?.success && testResults.analytics.totalSales === 0 && (
                <div className="p-3 bg-blue-100 rounded-lg">
                  <p className="font-medium text-blue-800">ℹ️ No Recent Sales</p>
                  <p className="text-blue-700 text-sm">The analytics dashboard shows data from the last 30 days. Add some recent orders to see visualizations.</p>
                </div>
              )}
              
              {errors.length === 0 && testResults.analytics?.success && testResults.analytics.totalSales > 0 && (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="font-medium text-green-800">✅ All Tests Passed</p>
                  <p className="text-green-700 text-sm">Your analytics dashboard should be working correctly. Check the admin analytics page.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 