import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

export type User = {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  role: string
  created_at: string
}

export type Order = {
  id: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  shipping_address: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type OrderWithItems = Order & {
  order_items: {
    id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url: string
    }
  }[]
}

// Database helper functions
export const dbHelpers = {
  // User operations
  async createUser(userData: {
    email: string
    password_hash: string
    full_name: string
    phone?: string
    address?: string
  }) {
    const { data, error } = await supabase.from("users").insert(userData).select().single()

    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    return { data, error }
  },

  async getAdminByEmail(email: string) {
    const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    return { data, error }
  },

  async updateUser(id: string, userData: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  async updateAdmin(id: string, userData: Partial<User>) {
    const { data, error } = await supabase
      .from("admin_users")
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  // Product operations
  async getProducts(filters?: { category?: string; featured?: boolean }) {
    let query = supabase.from("products").select("*")

    if (filters?.category) {
      query = query.eq("category", filters.category)
    }

    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    return { data, error }
  },

  async getProductById(id: string) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    return { data, error }
  },

  async createProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("products").insert(productData).select().single()

    if (error) throw error
    return data
  },

  async updateProduct(id: string, productData: Partial<Product>) {
    const { data, error } = await supabase
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error
    return true
  },

  // Order operations
  async createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) throw error
    return data
  },

  async createOrderItems(
    orderItems: Array<{
      order_id: string
      product_id: string
      quantity: number
      price: number
    }>,
  ) {
    const { data, error } = await supabase.from("order_items").insert(orderItems).select()

    if (error) throw error
    return data
  },

  async getOrdersWithItems() {
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

    return { data, error }
  },

  async getUserOrders(userId: string) {
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return { data, error }
  },

  async getOrdersByEmail(email: string) {
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
      .eq("customer_email", email)
      .order("created_at", { ascending: false })

    return { data, error }
  },

  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from("orders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics operations
  async getAnalyticsData(timeRange: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    try {
      // Get total sales
      const { data: salesData, error: salesError } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .gte("created_at", startDate.toISOString())
        .eq("order_status", "delivered")

      // Get total orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, created_at")
        .gte("created_at", startDate.toISOString())

      // Get total customers (unique emails)
      const { data: customersData, error: customersError } = await supabase
        .from("orders")
        .select("customer_email")
        .gte("created_at", startDate.toISOString())

      // Get total products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id")

      // Get top products by sales
      const { data: topProductsData, error: topProductsError } = await supabase
        .from("order_items")
        .select(`
          quantity,
          price,
          products (
            name
          )
        `)
        .gte("created_at", startDate.toISOString())

      // Get recent orders
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from("orders")
        .select("id, customer_name, total_amount, order_status, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      // Calculate analytics
      const totalSales = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const totalOrders = ordersData?.length || 0
      const uniqueCustomers = new Set(customersData?.map(c => c.customer_email)).size
      const totalProducts = productsData?.length || 0

      // Calculate top products
      const productSales: { [key: string]: number } = {}
      topProductsData?.forEach(item => {
        const productName = (item.products as any)?.name || "Unknown"
        productSales[productName] = (productSales[productName] || 0) + (item.quantity * item.price)
      })

      const topProducts = Object.entries(productSales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4)
        .map(product => ({
          ...product,
          percentage: totalSales > 0 ? Math.round((product.sales / totalSales) * 100) : 0
        }))

      // Calculate growth (mock for now - would need historical data)
      const salesGrowth = totalSales > 0 ? 12.5 : 0 // Mock growth percentage
      const orderGrowth = totalOrders > 0 ? 8.3 : 0
      const customerGrowth = uniqueCustomers > 0 ? 15.7 : 0

      // Get sales by month (last 6 months)
      const salesByMonth = []
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date()
        monthDate.setMonth(monthDate.getMonth() - i)
        const monthName = monthDate.toLocaleDateString("en-US", { month: "short" })
        
        // If we have real data, use it; otherwise use mock data
        if (totalSales > 0) {
          // Mock monthly sales data based on total sales
          const monthlySales = Math.floor((totalSales / 6) * (0.8 + Math.random() * 0.4))
          salesByMonth.push({ month: monthName, sales: monthlySales })
        } else {
          // No real data, show empty months
          salesByMonth.push({ month: monthName, sales: 0 })
        }
      }

      console.log("Analytics calculation:", {
        totalSales,
        totalOrders,
        uniqueCustomers,
        totalProducts,
        topProducts: topProducts.length,
        recentOrders: recentOrdersData?.length || 0
      })

      return {
        totalSales,
        totalOrders,
        totalCustomers: uniqueCustomers,
        totalProducts,
        salesGrowth,
        orderGrowth,
        customerGrowth,
        topProducts,
        recentOrders: recentOrdersData?.map(order => ({
          id: order.id,
          customer: order.customer_name,
          amount: order.total_amount,
          status: order.order_status,
          date: order.created_at
        })) || [],
        salesByMonth
      }
    } catch (error) {
      console.error("Error calculating analytics:", error)
      // Return default empty data
      return {
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
      }
    }
  },

  // Customer operations
  async getCustomers() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        created_at,
        total_amount,
        order_status
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Group by customer email to get unique customers
    const customerMap = new Map()
    
    data?.forEach(order => {
      const email = order.customer_email
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          address: order.shipping_address,
          joinDate: order.created_at,
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: order.created_at,
          status: "active" as const
        })
      }
      
      const customer = customerMap.get(email)
      customer.totalOrders += 1
      customer.totalSpent += order.total_amount
      if (new Date(order.created_at) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.created_at
      }
    })

    // Convert to array and calculate status
    const customers = Array.from(customerMap.values()).map(customer => {
      let status: "active" | "inactive" | "vip" = "active"
      
      if (customer.totalSpent > 300000) {
        status = "vip"
      } else if (customer.totalOrders === 1 && new Date(customer.lastOrder) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        status = "inactive"
      }
      
      return { ...customer, status }
    })

    return customers
  },

  // Settings operations
  async getStoreSettings() {
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("setting_key, setting_value, setting_type")

      if (error) throw error

      // Convert settings array to object
      const settings: any = {}
      data?.forEach(setting => {
        let value: any = setting.setting_value
        
        // Convert based on type
        switch (setting.setting_type) {
          case 'number':
            value = parseFloat(setting.setting_value)
            break
          case 'boolean':
            value = setting.setting_value === 'true'
            break
          case 'json':
            try {
              value = JSON.parse(setting.setting_value)
            } catch {
              value = setting.setting_value
            }
            break
        }
        
        settings[setting.setting_key] = value
      })

      return {
        storeName: settings.store_name || "Mash Electronics",
        storeDescription: settings.store_description || "Your trusted source for quality electronics in Kenya",
        contactEmail: settings.contact_email || "info@mashelectronics.co.ke",
        contactPhone: settings.contact_phone || "+254700123456",
        address: settings.address || "Nairobi, Kenya",
        website: settings.website || "https://mashelectronics.co.ke",
        currency: settings.currency || "KSH",
        taxRate: settings.tax_rate?.toString() || "16",
        shippingCost: settings.shipping_cost?.toString() || "0",
        freeShippingThreshold: settings.free_shipping_threshold?.toString() || "5000",
        maintenanceMode: settings.maintenance_mode || false,
        emailNotifications: settings.email_notifications !== false,
        smsNotifications: settings.sms_notifications !== false,
        whatsappNotifications: settings.whatsapp_notifications !== false,
        orderConfirmationEmail: settings.order_confirmation_email !== false,
        lowStockAlerts: settings.low_stock_alerts !== false,
        newOrderAlerts: settings.new_order_alerts !== false
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      // Return default settings if table doesn't exist
      return {
        storeName: "Mash Electronics",
        storeDescription: "Your trusted source for quality electronics in Kenya",
        contactEmail: "info@mashelectronics.co.ke",
        contactPhone: "+254700123456",
        address: "Nairobi, Kenya",
        website: "https://mashelectronics.co.ke",
        currency: "KSH",
        taxRate: "16",
        shippingCost: "0",
        freeShippingThreshold: "5000",
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: true,
        whatsappNotifications: true,
        orderConfirmationEmail: true,
        lowStockAlerts: true,
        newOrderAlerts: true
      }
    }
  },

  async updateStoreSettings(settings: any) {
    try {
      // Convert settings object to array of key-value pairs
      const settingsArray = [
        { setting_key: 'store_name', setting_value: settings.storeName, setting_type: 'string' },
        { setting_key: 'store_description', setting_value: settings.storeDescription, setting_type: 'string' },
        { setting_key: 'contact_email', setting_value: settings.contactEmail, setting_type: 'string' },
        { setting_key: 'contact_phone', setting_value: settings.contactPhone, setting_type: 'string' },
        { setting_key: 'address', setting_value: settings.address, setting_type: 'string' },
        { setting_key: 'website', setting_value: settings.website, setting_type: 'string' },
        { setting_key: 'currency', setting_value: settings.currency, setting_type: 'string' },
        { setting_key: 'tax_rate', setting_value: settings.taxRate, setting_type: 'number' },
        { setting_key: 'shipping_cost', setting_value: settings.shippingCost, setting_type: 'number' },
        { setting_key: 'free_shipping_threshold', setting_value: settings.freeShippingThreshold, setting_type: 'number' },
        { setting_key: 'maintenance_mode', setting_value: settings.maintenanceMode.toString(), setting_type: 'boolean' },
        { setting_key: 'email_notifications', setting_value: settings.emailNotifications.toString(), setting_type: 'boolean' },
        { setting_key: 'sms_notifications', setting_value: settings.smsNotifications.toString(), setting_type: 'boolean' },
        { setting_key: 'whatsapp_notifications', setting_value: settings.whatsappNotifications.toString(), setting_type: 'boolean' },
        { setting_key: 'order_confirmation_email', setting_value: settings.orderConfirmationEmail.toString(), setting_type: 'boolean' },
        { setting_key: 'low_stock_alerts', setting_value: settings.lowStockAlerts.toString(), setting_type: 'boolean' },
        { setting_key: 'new_order_alerts', setting_value: settings.newOrderAlerts.toString(), setting_type: 'boolean' }
      ]

      // Update each setting
      for (const setting of settingsArray) {
        const { error } = await supabase
          .from("store_settings")
          .upsert(setting, { onConflict: 'setting_key' })

        if (error) throw error
      }

      return { success: true }
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  }
}
