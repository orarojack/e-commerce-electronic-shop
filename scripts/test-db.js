const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hyzbccmlzdyhgedfhene.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5emJjY21semR5aGdlZGZoZW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzEyMjIsImV4cCI6MjA2NzIwNzIyMn0.yeWKYOl7ltXtI1szrEw_yiuHGk7AY_5FYHqDUc5qrEA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test products table
    console.log('\n1. Testing products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
    } else {
      console.log(`Found ${products?.length || 0} products:`)
      products?.forEach(product => {
        console.log(`- ${product.name} (Ksh ${product.price.toLocaleString()})`)
      })
    }

    // Test users table
    console.log('\n2. Testing users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(3)
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
    } else {
      console.log(`Found ${users?.length || 0} users`)
    }

    // Test admin_users table
    console.log('\n3. Testing admin_users table...')
    const { data: admins, error: adminsError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(3)
    
    if (adminsError) {
      console.error('Error fetching admin_users:', adminsError)
    } else {
      console.log(`Found ${admins?.length || 0} admin users`)
    }

    // Check if tables exist
    console.log('\n4. Checking table structure...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
    } else {
      console.log('Available tables:')
      tables?.forEach(table => {
        console.log(`- ${table.table_name}`)
      })
    }

  } catch (error) {
    console.error('Connection error:', error)
  }
}

testDatabase() 