const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminData() {
  console.log('🧪 Testing Admin Data Connections...\n')

  try {
    // Test 1: Analytics Data
    console.log('1. Testing Analytics Data...')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const { data: salesData, error: salesError } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", startDate.toISOString())
      .eq("order_status", "delivered")

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id, created_at")
      .gte("created_at", startDate.toISOString())

    const { data: customersData, error: customersError } = await supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", startDate.toISOString())

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id")

    const totalSales = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const totalOrders = ordersData?.length || 0
    const uniqueCustomers = new Set(customersData?.map(c => c.customer_email)).size
    const totalProducts = productsData?.length || 0

    console.log(`   ✅ Total Sales: Ksh ${totalSales.toLocaleString()}`)
    console.log(`   ✅ Total Orders: ${totalOrders}`)
    console.log(`   ✅ Unique Customers: ${uniqueCustomers}`)
    console.log(`   ✅ Total Products: ${totalProducts}`)

    // Test 2: Customers Data
    console.log('\n2. Testing Customers Data...')
    const { data: customerOrders, error: customerError } = await supabase
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

    if (customerError) {
      console.log(`   ❌ Error: ${customerError.message}`)
    } else {
      const customerMap = new Map()
      customerOrders?.forEach(order => {
        const email = order.customer_email
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            name: order.customer_name,
            email: order.customer_email,
            totalOrders: 0,
            totalSpent: 0
          })
        }
        const customer = customerMap.get(email)
        customer.totalOrders += 1
        customer.totalSpent += order.total_amount
      })

      console.log(`   ✅ Found ${customerMap.size} unique customers`)
      console.log(`   ✅ Sample customer: ${Array.from(customerMap.values())[0]?.name || 'None'}`)
    }

    // Test 3: Settings Data
    console.log('\n3. Testing Settings Data...')
    const { data: settingsData, error: settingsError } = await supabase
      .from("store_settings")
      .select("setting_key, setting_value, setting_type")

    if (settingsError) {
      console.log(`   ⚠️  Settings table not found: ${settingsError.message}`)
      console.log('   💡 Run the setup-analytics-tables.sql script to create the settings table')
    } else {
      console.log(`   ✅ Found ${settingsData?.length || 0} settings`)
      const storeName = settingsData?.find(s => s.setting_key === 'store_name')?.setting_value
      console.log(`   ✅ Store Name: ${storeName || 'Not set'}`)
    }

    // Test 4: Products Data
    console.log('\n4. Testing Products Data...')
    const { data: products, error: productsListError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (productsListError) {
      console.log(`   ❌ Error: ${productsListError.message}`)
    } else {
      console.log(`   ✅ Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log(`   ✅ Sample product: ${products[0].name} - Ksh ${products[0].price.toLocaleString()}`)
      }
    }

    // Test 5: Orders Data
    console.log('\n5. Testing Orders Data...')
    const { data: orders, error: ordersListError } = await supabase
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

    if (ordersListError) {
      console.log(`   ❌ Error: ${ordersListError.message}`)
    } else {
      console.log(`   ✅ Found ${orders?.length || 0} orders`)
      if (orders && orders.length > 0) {
        console.log(`   ✅ Sample order: ${orders[0].customer_name} - Ksh ${orders[0].total_amount.toLocaleString()}`)
        console.log(`   ✅ Order items: ${orders[0].order_items?.length || 0} items`)
      }
    }

    console.log('\n🎉 Admin Data Test Complete!')
    console.log('\n📋 Summary:')
    console.log(`   • Analytics: ${totalSales > 0 ? '✅' : '⚠️'} Sales data available`)
    console.log(`   • Customers: ${customerMap?.size > 0 ? '✅' : '⚠️'} Customer data available`)
    console.log(`   • Settings: ${settingsData ? '✅' : '⚠️'} Settings table ${settingsData ? 'exists' : 'missing'}`)
    console.log(`   • Products: ${products?.length > 0 ? '✅' : '⚠️'} Product data available`)
    console.log(`   • Orders: ${orders?.length > 0 ? '✅' : '⚠️'} Order data available`)

    if (!settingsData) {
      console.log('\n🔧 Next Steps:')
      console.log('   1. Run the setup-analytics-tables.sql script in your Supabase SQL editor')
      console.log('   2. This will create the store_settings table with default values')
      console.log('   3. The admin settings page will then work with real data')
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAdminData() 