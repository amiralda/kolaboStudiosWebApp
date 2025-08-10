#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Lighthouse Performance Audit for Kolabo Studios${NC}"
echo "=================================================================="

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${RED}❌ Lighthouse CLI not found. Installing...${NC}"
    npm install -g lighthouse
fi

# Create reports directory
mkdir -p lighthouse-reports

# Check if the app is running
echo -e "${YELLOW}🔍 Checking if app is running on localhost:3000...${NC}"
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ App not running on localhost:3000${NC}"
    echo -e "${YELLOW}Please run: npm run build && npm run start${NC}"
    exit 1
fi

echo -e "${GREEN}✅ App is running on localhost:3000${NC}"
echo ""

# Pages to audit
declare -a pages=(
    "/"
    "/about"
    "/galleries"
    "/contact"
    "/retouch-services"
)

declare -a page_names=(
    "home"
    "about"
    "galleries"
    "contact"
    "retouch-services"
)

# Run lighthouse for each page
for i in "${!pages[@]}"; do
    page="${pages[$i]}"
    name="${page_names[$i]}"
    
    echo -e "${BLUE}🔍 Auditing: ${name^} Page (${page})${NC}"
    
    lighthouse "http://localhost:3000${page}" \
        --output=json \
        --output=html \
        --output-path="lighthouse-reports/${name}" \
        --chrome-flags="--headless --no-sandbox --disable-gpu" \
        --quiet \
        --only-categories=performance,accessibility,best-practices,seo
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ${name^} audit complete${NC}"
    else
        echo -e "${RED}❌ ${name^} audit failed${NC}"
    fi
    
    # Small delay between audits
    sleep 2
done

echo ""
echo -e "${BLUE}📊 Generating Summary Report...${NC}"

# Run the summary script
node scripts/lighthouse-summary.js

echo ""
echo -e "${GREEN}🎉 Lighthouse audit complete!${NC}"
echo -e "${YELLOW}📁 Reports saved in: lighthouse-reports/${NC}"
echo -e "${YELLOW}🌐 Open HTML files in browser to view detailed reports${NC}"
echo ""
echo -e "${BLUE}📋 Quick Commands:${NC}"
echo -e "  View Home Report:     ${YELLOW}open lighthouse-reports/home.report.html${NC}"
echo -e "  View All Reports:     ${YELLOW}open lighthouse-reports/*.html${NC}"
echo -e "  Performance Monitor:  ${YELLOW}http://localhost:3000/performance-test${NC}"
