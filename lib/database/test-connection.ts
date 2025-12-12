import { createSupabaseServerClient } from './supabase'

async function testConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    const supabase = createSupabaseServerClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .limit(1)

    if (error) {
      throw error
    }

    console.log('✅ Database connection successful!')
    console.log('📊 Sample data:', data)

    // Test table existence
    const tables = [
      'users',
      'clients', 
      'orders',
      'payments',
      'files',
      'gallery_photos',
      'blog_posts',
      'contact_inquiries',
      'email_notifications',
      'analytics_events',
      'system_settings'
    ]

    console.log('🔍 Checking table structure...')
    
    for (const table of tables) {
      try {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (countError) {
          console.log(`❌ Table '${table}': ${countError.message}`)
        } else {
          console.log(`✅ Table '${table}': ${count} records`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': Error checking`)
      }
    }

    console.log('🎉 Database test completed successfully!')
    return true

  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Database connection failed:', detail)
    console.error('🔧 Please check your environment variables:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    console.error('   - DATABASE_URL (if using direct connection)')
    return false
  }
}

// Run the test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })
