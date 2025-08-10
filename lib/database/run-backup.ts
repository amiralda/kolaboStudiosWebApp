import { createSupabaseServerClient } from './supabase'
import fs from 'fs'
import path from 'path'

async function createBackup() {
  console.log('💾 Creating database backup...')
  
  try {
    const supabase = createSupabaseServerClient()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backups')
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

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
      'system_settings'
    ]

    const backupData: Record<string, any[]> = {}

    // Export each table
    for (const table of tables) {
      console.log(`📤 Backing up table: ${table}`)
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.log(`⚠️  Warning: Could not backup table '${table}':`, error.message)
        backupData[table] = []
      } else {
        backupData[table] = data || []
        console.log(`✅ Backed up ${data?.length || 0} records from '${table}'`)
      }
    }

    // Save backup file
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)
    const backupContent = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tables: backupData,
      metadata: {
        totalTables: tables.length,
        totalRecords: Object.values(backupData).reduce((sum, records) => sum + records.length, 0)
      }
    }

    fs.writeFileSync(backupFile, JSON.stringify(backupContent, null, 2))
    
    console.log(`✅ Backup created successfully: ${backupFile}`)
    console.log(`📊 Backup contains ${backupContent.metadata.totalRecords} records across ${backupContent.metadata.totalTables} tables`)

    // Clean up old backups (keep last 10)
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .sort()
      .reverse()

    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10)
      for (const file of filesToDelete) {
        fs.unlinkSync(path.join(backupDir, file))
        console.log(`🗑️  Deleted old backup: ${file}`)
      }
    }

    return true

  } catch (error) {
    console.error('❌ Backup failed:', error.message)
    return false
  }
}

// Run backup
createBackup()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Backup error:', error)
    process.exit(1)
  })
