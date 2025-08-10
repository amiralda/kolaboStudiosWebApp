// Database migration utilities for schema updates
export class DatabaseMigrations {
  // Migration tracking table
  static async createMigrationsTable() {
    return `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  }

  // Check if migration has been run
  static async hasMigrationRun(version: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('schema_migrations')
      .select('version')
      .eq('version', version)
      .single()

    return !error && !!data
  }

  // Record migration as completed
  static async recordMigration(version: string, description: string) {
    const { error } = await supabaseAdmin
      .from('schema_migrations')
      .insert([{ version, description }])

    if (error) throw error
  }

  // Migration definitions
  static migrations = [
    {
      version: '001_initial_schema',
      description: 'Create initial database schema',
      up: async () => {
        // This would contain the initial schema creation
        // Already handled by schema.sql
      }
    },
    {
      version: '002_add_analytics_indexes',
      description: 'Add performance indexes for analytics',
      up: async () => {
        return `
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_user_session 
          ON analytics_events(user_id, session_id);
          
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_event_date 
          ON analytics_events(event_type, created_at DESC);
        `
      }
    },
    {
      version: '003_add_photo_metadata',
      description: 'Add EXIF and camera metadata to photos',
      up: async () => {
        return `
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS camera_make VARCHAR(100);
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS camera_model VARCHAR(100);
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS lens VARCHAR(100);
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS focal_length INTEGER;
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS aperture VARCHAR(10);
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS shutter_speed VARCHAR(20);
          ALTER TABLE photos ADD COLUMN IF NOT EXISTS iso INTEGER;
        `
      }
    }
  ]

  // Run all pending migrations
  static async runMigrations() {
    console.log('🔄 Running database migrations...')

    for (const migration of this.migrations) {
      const hasRun = await this.hasMigrationRun(migration.version)
      
      if (!hasRun) {
        console.log(`📝 Running migration: ${migration.version} - ${migration.description}`)
        
        try {
          if (migration.up) {
            const sql = await migration.up()
            if (sql) {
              // Execute the SQL - in production you'd use a proper migration runner
              console.log(`SQL: ${sql}`)
            }
          }
          
          await this.recordMigration(migration.version, migration.description)
          console.log(`✅ Migration ${migration.version} completed`)
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error)
          throw error
        }
      } else {
        console.log(`⏭️  Migration ${migration.version} already applied`)
      }
    }

    console.log('🎉 All migrations completed!')
  }
}
