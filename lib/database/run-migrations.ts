import { createSupabaseServerClient } from './supabase'
import fs from 'fs'
import path from 'path'

async function runMigrations() {
  console.log('🚀 Running database migrations...')
  
  try {
    const supabase = createSupabaseServerClient()
    
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📋 Executing ${statements.length} SQL statements...`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        })
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} warning:`, error.message)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err)
        console.log(`❌ Statement ${i + 1} failed:`, detail)
        errorCount++
      }
    }

    console.log(`✅ Migration completed: ${successCount} successful, ${errorCount} warnings/errors`)
    
    // Verify critical tables exist
    const criticalTables = ['users', 'orders', 'payments', 'gallery_photos']
    
    for (const table of criticalTables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
        
      if (error) {
        throw new Error(`Critical table '${table}' is not accessible: ${error.message}`)
      }
    }

    console.log('🎉 All critical tables verified!')
    return true

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    console.error('❌ Migration failed:', detail)
    return false
  }
}

// Run migrations
runMigrations()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Migration error:', error)
    process.exit(1)
  })
