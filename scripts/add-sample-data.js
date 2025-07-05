const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addSampleData() {
  console.log('📊 Adding Sample Data for Analytics...\n')

  try {
    // First, let's check if we have products
    const { data: existingProducts, error: productsError } = await supabase
      .from("products")
      .select("id, name")

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return
    }

    if (!existingProducts || existingProducts.length === 0) {
      console.log('❌ No products found. Please add some products first.')
      return
    }

    console.log(`✅ Found ${existingProducts.length} products`)

    // Create sample orders for the last 30 days
    const sampleOrders = [
      {
        customer_name: "John Doe",
        customer_email: "john.doe@email.com",
        customer_phone: "+254700123456",
        total_amount: 45000,
        payment_method: "mpesa",
        payment_status: "paid",
        order_status: "delivered",
        shipping_address: "Nairobi, Kenya",
        notes: "Sample order 1"
      },
      {
        customer_name: "Jane Smith",
        customer_email: "jane.smith@email.com",
        customer_phone: "+254700234567",
        total_amount: 32000,
        payment_method: "mpesa",
        payment_status: "paid",
        order_status: "delivered",
        shipping_address: "Mombasa, Kenya",
        notes: "Sample order 2"
      },
      {
        customer_name: "Mike Johnson",
        customer_email: "mike.johnson@email.com",
        customer_phone: "+254700345678",
        total_amount: 28000,
        payment_method: "mpesa",
        payment_status: "paid",
        order_status: "shipped",
        shipping_address: "Kisumu, Kenya",
        notes: "Sample order 3"
      },
      {
        customer_name: "Sarah Wilson",
        customer_email: "sarah.wilson@email.com",
        customer_phone: "+254700456789",
        total_amount: 55000,
        payment_method: "mpesa",
        payment_status: "paid",
        order_status: "delivered",
        shipping_address: "Nakuru, Kenya",
        notes: "Sample order 4"
      },
      {
        customer_name: "David Brown",
        customer_email: "david.brown@email.com",
        customer_phone: "+254700567890",
        total_amount: 38000,
        payment_method: "mpesa",
        payment_status: "paid",
        order_status: "processing",
        shipping_address: "Eldoret, Kenya",
        notes: "Sample order 5"
      }
    ]

    // Create orders with dates spread over the last 30 days
    const orders = []
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderDate = new Date()
      orderDate.setDate(orderDate.getDate() - (i * 5)) // Spread orders over 25 days
      
      orders.push({
        ...sampleOrders[i],
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString()
      })
    }

    console.log('📝 Creating sample orders...')
    
    // Insert orders
    const { data: createdOrders, error: ordersError } = await supabase
      .from("orders")
      .insert(orders)
      .select()

    if (ordersError) {
      console.error('Error creating orders:', ordersError)
      return
    }

    console.log(`✅ Created ${createdOrders.length} orders`)

    // Create order items for each order
    console.log('📦 Creating order items...')
    
    const orderItems = []
    for (const order of createdOrders) {
      // Add 1-3 random products to each order
      const numItems = Math.floor(Math.random() * 3) + 1
      const selectedProducts = existingProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems)

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 2) + 1
        const price = Math.floor(Math.random() * 20000) + 5000 // Random price between 5000-25000
        
        orderItems.push({
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price: price,
          created_at: order.created_at
        })
      }
    }

    const { data: createdOrderItems, error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select()

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError)
      return
    }

    console.log(`✅ Created ${createdOrderItems.length} order items`)

    // Verify the data
    console.log('\n🔍 Verifying data...')
    
    const { data: verifyOrders, error: verifyError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (verifyError) {
      console.error('Error verifying data:', verifyError)
    } else {
      console.log(`✅ Verification complete: ${verifyOrders.length} orders with items`)
      
      const totalSales = verifyOrders.reduce((sum, order) => sum + order.total_amount, 0)
      const totalItems = verifyOrders.reduce((sum, order) => sum + (order.order_items?.length || 0), 0)
      
      console.log(`📊 Total Sales: Ksh ${totalSales.toLocaleString()}`)
      console.log(`📦 Total Items: ${totalItems}`)
    }

    console.log('\n🎉 Sample data added successfully!')
    console.log('\n📋 Next Steps:')
    console.log('   1. Go to your admin analytics page')
    console.log('   2. You should now see visualizations with real data')
    console.log('   3. The charts will show sales, orders, and customer information')

  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  }
}

addSampleData() 