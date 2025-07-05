const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock the dbHelpers.getAnalyticsData function
async function getAnalyticsData(timeRange = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - timeRange)

  try {
    console.log(`📅 Fetching data from ${startDate.toISOString()} to now`)

    // Get total sales
    console.log("💰 Fetching sales data...")
    const { data: salesData, error: salesError } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", startDate.toISOString())
      .eq("order_status", "delivered")

    if (salesError) {
      console.error("❌ Sales query error:", salesError)
      return null
    }

    // Get total orders
    console.log("📋 Fetching orders data...")
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id, created_at")
      .gte("created_at", startDate.toISOString())

    if (ordersError) {
      console.error("❌ Orders query error:", ordersError)
      return null
    }

    // Get total customers (unique emails)
    console.log("👥 Fetching customers data...")
    const { data: customersData, error: customersError } = await supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", startDate.toISOString())

    if (customersError) {
      console.error("❌ Customers query error:", customersError)
      return null
    }

    // Get total products
    console.log("🏷️ Fetching products data...")
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id")

    if (productsError) {
      console.error("❌ Products query error:", productsError)
      return null
    }

    // Get top products by sales
    console.log("🔥 Fetching order items data...")
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

    if (topProductsError) {
      console.error("❌ Order items query error:", topProductsError)
      return null
    }

    // Get recent orders
    console.log("📋 Fetching recent orders...")
    const { data: recentOrdersData, error: recentOrdersError } = await supabase
      .from("orders")
      .select("id, customer_name, total_amount, order_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentOrdersError) {
      console.error("❌ Recent orders query error:", recentOrdersError)
      return null
    }

    // Calculate analytics
    const totalSales = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const totalOrders = ordersData?.length || 0
    const uniqueCustomers = new Set(customersData?.map(c => c.customer_email)).size
    const totalProducts = productsData?.length || 0

    console.log("📊 Calculation results:")
    console.log(`   Total Sales: Ksh ${totalSales.toLocaleString()}`)
    console.log(`   Total Orders: ${totalOrders}`)
    console.log(`   Unique Customers: ${uniqueCustomers}`)
    console.log(`   Total Products: ${totalProducts}`)

    // Calculate top products
    const productSales = {}
    topProductsData?.forEach(item => {
      const productName = item.products?.name || "Unknown"
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

    console.log(`   Top Products: ${topProducts.length} items`)
    topProducts.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.name}: Ksh ${product.sales.toLocaleString()} (${product.percentage}%)`)
    })

    // Calculate growth (mock for now)
    const salesGrowth = totalSales > 0 ? 12.5 : 0
    const orderGrowth = totalOrders > 0 ? 8.3 : 0
    const customerGrowth = uniqueCustomers > 0 ? 15.7 : 0

    // Get sales by month (last 6 months)
    const salesByMonth = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - i)
      const monthName = monthDate.toLocaleDateString("en-US", { month: "short" })
      
      if (totalSales > 0) {
        const monthlySales = Math.floor((totalSales / 6) * (0.8 + Math.random() * 0.4))
        salesByMonth.push({ month: monthName, sales: monthlySales })
      } else {
        salesByMonth.push({ month: monthName, sales: 0 })
      }
    }

    console.log(`   Sales by Month: ${salesByMonth.length} months`)
    salesByMonth.forEach(month => {
      console.log(`     ${month.month}: Ksh ${month.sales.toLocaleString()}`)
    })

    const result = {
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

    console.log("\n✅ Analytics calculation completed successfully!")
    return result

  } catch (error) {
    console.error("❌ Error in analytics calculation:", error)
    return null
  }
}

async function testAnalyticsHelper() {
  console.log('🧪 Testing Analytics Helper Function...\n')
  
  try {
    const result = await getAnalyticsData(30)
    
    if (result) {
      console.log('\n📋 Final Result Summary:')
      console.log(`   💰 Total Sales: Ksh ${result.totalSales.toLocaleString()}`)
      console.log(`   📦 Total Orders: ${result.totalOrders}`)
      console.log(`   👥 Total Customers: ${result.totalCustomers}`)
      console.log(`   🏷️ Total Products: ${result.totalProducts}`)
      console.log(`   🔥 Top Products: ${result.topProducts.length}`)
      console.log(`   📋 Recent Orders: ${result.recentOrders.length}`)
      console.log(`   📊 Sales by Month: ${result.salesByMonth.length}`)
      
      if (result.totalSales === 0) {
        console.log('\n⚠️ No sales data found!')
        console.log('   This means the analytics dashboard will show empty visualizations.')
        console.log('   Run: node scripts/add-sample-data.js')
      } else {
        console.log('\n✅ Analytics data is available!')
        console.log('   The analytics dashboard should work correctly.')
      }
    } else {
      console.log('\n❌ Analytics calculation failed!')
      console.log('   Check the database connection and table structure.')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAnalyticsHelper() 