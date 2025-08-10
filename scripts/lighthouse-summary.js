const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bright: '\x1b[1m'
};

function getScoreColor(score) {
    if (score >= 90) return colors.green;
    if (score >= 50) return colors.yellow;
    return colors.red;
}

function getScoreEmoji(score) {
    if (score >= 90) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
}

function getWebVitalColor(value, metric) {
    if (metric === 'lcp') {
        if (value <= 2500) return colors.green;
        if (value <= 4000) return colors.yellow;
        return colors.red;
    }
    if (metric === 'fid') {
        if (value <= 100) return colors.green;
        if (value <= 300) return colors.yellow;
        return colors.red;
    }
    if (metric === 'cls') {
        if (value <= 0.1) return colors.green;
        if (value <= 0.25) return colors.yellow;
        return colors.red;
    }
    return colors.white;
}

async function generateSummary() {
    const reportsDir = path.join(process.cwd(), 'lighthouse-reports');
    
    console.log(`${colors.blue}${colors.bright}📊 KOLABO STUDIOS - LIGHTHOUSE PERFORMANCE AUDIT${colors.reset}`);
    console.log('='.repeat(60));
    console.log('');

    if (!fs.existsSync(reportsDir)) {
        console.log(`${colors.red}❌ Reports directory not found at: ${reportsDir}${colors.reset}`);
        console.log(`${colors.yellow}💡 Run the audit first: ./scripts/run-lighthouse.sh${colors.reset}`);
        return;
    }

    const jsonFiles = fs.readdirSync(reportsDir).filter(file => file.endsWith('.report.json'));
    
    if (jsonFiles.length === 0) {
        console.log(`${colors.red}❌ No JSON reports found in: ${reportsDir}${colors.reset}`);
        console.log(`${colors.yellow}💡 Make sure the audit completed successfully${colors.reset}`);
        return;
    }

    console.log(`${colors.cyan}Found ${jsonFiles.length} audit reports${colors.reset}`);
    console.log('');

    const allScores = {
        performance: [],
        accessibility: [],
        bestPractices: [],
        seo: []
    };

    const coreWebVitals = {
        lcp: [],
        fid: [],
        cls: [],
        fcp: [],
        ttfb: []
    };

    // Process each report
    for (const file of jsonFiles.sort()) {
        try {
            const filePath = path.join(reportsDir, file);
            const reportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            const pageName = file.replace('.report.json', '').replace(/-/g, ' ').toUpperCase();
            const categories = reportData.lhr.categories;
            const audits = reportData.lhr.audits;

            console.log(`${colors.cyan}${colors.bright}📄 ${pageName} PAGE${colors.reset}`);
            console.log('-'.repeat(40));

            // Lighthouse scores
            const perfScore = Math.round(categories.performance.score * 100);
            const a11yScore = Math.round(categories.accessibility.score * 100);
            const bpScore = Math.round(categories['best-practices'].score * 100);
            const seoScore = Math.round(categories.seo.score * 100);

            console.log(`Performance:     ${getScoreEmoji(perfScore)} ${getScoreColor(perfScore)}${perfScore}/100${colors.reset}`);
            console.log(`Accessibility:   ${getScoreEmoji(a11yScore)} ${getScoreColor(a11yScore)}${a11yScore}/100${colors.reset}`);
            console.log(`Best Practices:  ${getScoreEmoji(bpScore)} ${getScoreColor(bpScore)}${bpScore}/100${colors.reset}`);
            console.log(`SEO:             ${getScoreEmoji(seoScore)} ${getScoreColor(seoScore)}${seoScore}/100${colors.reset}`);

            // Core Web Vitals
            const lcp = audits['largest-contentful-paint']?.numericValue || 0;
            const fid = audits['max-potential-fid']?.numericValue || 0;
            const cls = audits['cumulative-layout-shift']?.numericValue || 0;
            const fcp = audits['first-contentful-paint']?.numericValue || 0;
            const ttfb = audits['server-response-time']?.numericValue || 0;

            console.log('');
            console.log(`${colors.magenta}Core Web Vitals:${colors.reset}`);
            console.log(`LCP: ${lcp < 2500 ? '🟢' : lcp < 4000 ? '🟡' : '🔴'} ${getWebVitalColor(lcp, 'lcp')}${(lcp/1000).toFixed(2)}s${colors.reset} (Largest Contentful Paint)`);
            console.log(`FID: ${fid < 100 ? '🟢' : fid < 300 ? '🟡' : '🔴'} ${getWebVitalColor(fid, 'fid')}${fid.toFixed(0)}ms${colors.reset} (First Input Delay)`);
            console.log(`CLS: ${cls < 0.1 ? '🟢' : cls < 0.25 ? '🟡' : '🔴'} ${getWebVitalColor(cls, 'cls')}${cls.toFixed(3)}${colors.reset} (Cumulative Layout Shift)`);
            console.log(`FCP: ${fcp < 1800 ? '🟢' : fcp < 3000 ? '🟡' : '🔴'} ${(fcp/1000).toFixed(2)}s${colors.reset} (First Contentful Paint)`);
            console.log(`TTFB: ${ttfb < 800 ? '🟢' : ttfb < 1800 ? '🟡' : '🔴'} ${ttfb.toFixed(0)}ms${colors.reset} (Time to First Byte)`);

            // Store scores for averages
            allScores.performance.push(perfScore);
            allScores.accessibility.push(a11yScore);
            allScores.bestPractices.push(bpScore);
            allScores.seo.push(seoScore);

            coreWebVitals.lcp.push(lcp);
            coreWebVitals.fid.push(fid);
            coreWebVitals.cls.push(cls);
            coreWebVitals.fcp.push(fcp);
            coreWebVitals.ttfb.push(ttfb);

            console.log('');

        } catch (error) {
            console.log(`${colors.red}❌ Error processing ${file}: ${error.message}${colors.reset}`);
        }
    }

    // Calculate averages
    const avgPerf = Math.round(allScores.performance.reduce((a, b) => a + b, 0) / allScores.performance.length);
    const avgA11y = Math.round(allScores.accessibility.reduce((a, b) => a + b, 0) / allScores.accessibility.length);
    const avgBP = Math.round(allScores.bestPractices.reduce((a, b) => a + b, 0) / allScores.bestPractices.length);
    const avgSEO = Math.round(allScores.seo.reduce((a, b) => a + b, 0) / allScores.seo.length);

    const avgLCP = coreWebVitals.lcp.reduce((a, b) => a + b, 0) / coreWebVitals.lcp.length;
    const avgFID = coreWebVitals.fid.reduce((a, b) => a + b, 0) / coreWebVitals.fid.length;
    const avgCLS = coreWebVitals.cls.reduce((a, b) => a + b, 0) / coreWebVitals.cls.length;
    const avgFCP = coreWebVitals.fcp.reduce((a, b) => a + b, 0) / coreWebVitals.fcp.length;
    const avgTTFB = coreWebVitals.ttfb.reduce((a, b) => a + b, 0) / coreWebVitals.ttfb.length;

    console.log(`${colors.blue}${colors.bright}🎯 OVERALL WEBSITE PERFORMANCE${colors.reset}`);
    console.log('='.repeat(60));
    console.log(`Performance:     ${getScoreEmoji(avgPerf)} ${getScoreColor(avgPerf)}${avgPerf}/100${colors.reset}`);
    console.log(`Accessibility:   ${getScoreEmoji(avgA11y)} ${getScoreColor(avgA11y)}${avgA11y}/100${colors.reset}`);
    console.log(`Best Practices:  ${getScoreEmoji(avgBP)} ${getScoreColor(avgBP)}${avgBP}/100${colors.reset}`);
    console.log(`SEO:             ${getScoreEmoji(avgSEO)} ${getScoreColor(avgSEO)}${avgSEO}/100${colors.reset}`);
    console.log('');
    console.log(`${colors.magenta}Average Core Web Vitals:${colors.reset}`);
    console.log(`LCP: ${avgLCP < 2500 ? '🟢' : avgLCP < 4000 ? '🟡' : '🔴'} ${getWebVitalColor(avgLCP, 'lcp')}${(avgLCP/1000).toFixed(2)}s${colors.reset}`);
    console.log(`FID: ${avgFID < 100 ? '🟢' : avgFID < 300 ? '🟡' : '🔴'} ${getWebVitalColor(avgFID, 'fid')}${avgFID.toFixed(0)}ms${colors.reset}`);
    console.log(`CLS: ${avgCLS < 0.1 ? '🟢' : avgCLS < 0.25 ? '🟡' : '🔴'} ${getWebVitalColor(avgCLS, 'cls')}${avgCLS.toFixed(3)}${colors.reset}`);
    console.log(`FCP: ${avgFCP < 1800 ? '🟢' : avgFCP < 3000 ? '🟡' : '🔴'} ${(avgFCP/1000).toFixed(2)}s${colors.reset}`);
    console.log(`TTFB: ${avgTTFB < 800 ? '🟢' : avgTTFB < 1800 ? '🟡' : '🔴'} ${avgTTFB.toFixed(0)}ms${colors.reset}`);
    console.log('');

    // Overall grade
    const overallScore = Math.round((avgPerf + avgA11y + avgBP + avgSEO) / 4);
    let grade = 'A+';
    if (overallScore < 95) grade = 'A';
    if (overallScore < 90) grade = 'B+';
    if (overallScore < 85) grade = 'B';
    if (overallScore < 80) grade = 'C+';
    if (overallScore < 75) grade = 'C';
    if (overallScore < 70) grade = 'D';
    if (overallScore < 60) grade = 'F';

    console.log(`${colors.bright}🏆 OVERALL GRADE: ${getScoreColor(overallScore)}${grade} (${overallScore}/100)${colors.reset}`);
    console.log('');

    // Recommendations
    console.log(`${colors.yellow}${colors.bright}💡 RECOMMENDATIONS FOR IMPROVEMENT${colors.reset}`);
    console.log('='.repeat(60));
    
    if (avgPerf < 90) {
        console.log(`${colors.red}🔧 Performance (${avgPerf}/100):${colors.reset}`);
        console.log('   • Optimize and compress images');
        console.log('   • Enable lazy loading for below-the-fold content');
        console.log('   • Minimize JavaScript and CSS bundles');
        console.log('   • Use a Content Delivery Network (CDN)');
        console.log('   • Enable browser caching');
        console.log('');
    }
    
    if (avgLCP > 2500) {
        console.log(`${colors.red}🔧 Largest Contentful Paint (${(avgLCP/1000).toFixed(2)}s):${colors.reset}`);
        console.log('   • Optimize hero images and use WebP/AVIF formats');
        console.log('   • Preload critical resources');
        console.log('   • Reduce server response time');
        console.log('   • Remove render-blocking resources');
        console.log('');
    }
    
    if (avgCLS > 0.1) {
        console.log(`${colors.red}🔧 Cumulative Layout Shift (${avgCLS.toFixed(3)}):${colors.reset}`);
        console.log('   • Set explicit width and height for images');
        console.log('   • Reserve space for dynamic content');
        console.log('   • Avoid inserting content above existing content');
        console.log('   • Use CSS aspect-ratio for responsive images');
        console.log('');
    }

    if (avgA11y < 95) {
        console.log(`${colors.red}🔧 Accessibility (${avgA11y}/100):${colors.reset}`);
        console.log('   • Add alt text to all images');
        console.log('   • Ensure proper color contrast ratios');
        console.log('   • Use semantic HTML elements');
        console.log('   • Add ARIA labels where needed');
        console.log('');
    }

    if (avgSEO < 95) {
        console.log(`${colors.red}🔧 SEO (${avgSEO}/100):${colors.reset}`);
        console.log('   • Add meta descriptions to all pages');
        console.log('   • Optimize page titles');
        console.log('   • Add structured data markup');
        console.log('   • Improve internal linking');
        console.log('');
    }

    if (avgPerf >= 90 && avgLCP <= 2500 && avgCLS <= 0.1 && avgA11y >= 95 && avgSEO >= 95) {
        console.log(`${colors.green}🎉 Excellent! Your website is well optimized across all metrics.${colors.reset}`);
        console.log(`${colors.green}   Users will have a fast, accessible, and SEO-friendly experience.${colors.reset}`);
        console.log('');
    }

    console.log(`${colors.cyan}📁 Detailed HTML reports: ${colors.yellow}lighthouse-reports/*.html${colors.reset}`);
    console.log(`${colors.cyan}📊 Performance monitor: ${colors.yellow}http://localhost:3000/performance-test${colors.reset}`);
    console.log('');
    console.log(`${colors.blue}🚀 Next steps:${colors.reset}`);
    console.log('   1. Open HTML reports in browser for detailed analysis');
    console.log('   2. Address the recommendations above');
    console.log('   3. Re-run audit to measure improvements');
    console.log('   4. Monitor real user metrics in production');
}

generateSummary().catch(console.error);
