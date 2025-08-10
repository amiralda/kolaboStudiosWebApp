#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Kolabo Studios Database${NC}"
echo "=================================================="

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase environment variables${NC}"
    echo -e "${YELLOW}Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables found${NC}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  psql not found. Installing PostgreSQL client...${NC}"
    
    # Install based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update && sudo apt-get install -y postgresql-client
    else
        echo -e "${RED}❌ Please install PostgreSQL client manually${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL client available${NC}"

# Test database connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if ! psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to database${NC}"
    echo -e "${YELLOW}Please check your DATABASE_URL in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database connection successful${NC}"

# Apply schema
echo -e "${BLUE}📋 Applying database schema...${NC}"
if psql "$DATABASE_URL" -f database/schema.sql; then
    echo -e "${GREEN}✅ Schema applied successfully${NC}"
else
    echo -e "${RED}❌ Failed to apply schema${NC}"
    exit 1
fi

# Apply seed data
echo -e "${BLUE}🌱 Applying seed data...${NC}"
if psql "$DATABASE_URL" -f database/seed-data.sql; then
    echo -e "${GREEN}✅ Seed data applied successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Seed data failed (this is okay if tables already have data)${NC}"
fi

# Test the setup
echo -e "${BLUE}🧪 Testing database setup...${NC}"
npm run db:test

echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo -e "${BLUE}📊 You can now:${NC}"
echo -e "  • Visit ${YELLOW}http://localhost:3000/admin/dashboard${NC} to see the admin panel"
echo -e "  • Run ${YELLOW}npm run dev${NC} to start the development server"
echo -e "  • Check ${YELLOW}http://localhost:3000${NC} to see your website"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo -e "  • ${YELLOW}npm run db:backup${NC} - Create database backup"
echo -e "  • ${YELLOW}npm run db:migrate${NC} - Run database migrations"
echo -e "  • ${YELLOW}npm run db:test${NC} - Test database connection"
