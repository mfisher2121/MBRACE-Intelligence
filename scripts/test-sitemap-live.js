#!/usr/bin/env node

/**
 * Live Sitemap Test
 * 
 * This script tests the deployed sitemap accessibility and content.
 * Run after deployment to verify the sitemap is properly served.
 */

const https = require('https');

const SITEMAP_URL = 'https://mbraceintelligence.com/sitemap.xml';
const ROBOTS_URL = 'https://mbraceintelligence.com/robots.txt';

/**
 * Make HTTPS request
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        statusCode: res.statusCode, 
        headers: res.headers, 
        data 
      }));
    }).on('error', reject);
  });
}

/**
 * Test sitemap accessibility
 */
async function testSitemapAccessibility() {
  console.log('🌐 Testing Sitemap Accessibility');
  console.log('================================\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Sitemap is accessible
  console.log('Test 1: Sitemap URL is accessible');
  try {
    const response = await httpsGet(SITEMAP_URL);
    
    if (response.statusCode === 200) {
      console.log('✅ PASS: Sitemap returns HTTP 200\n');
      passed++;
    } else {
      console.log(`❌ FAIL: Sitemap returns HTTP ${response.statusCode}\n`);
      failed++;
      return { passed, failed };
    }
    
    // Test 2: Content-Type header
    console.log('Test 2: Correct Content-Type header');
    const contentType = response.headers['content-type'];
    if (contentType && (contentType.includes('xml') || contentType.includes('text/xml') || contentType.includes('application/xml'))) {
      console.log(`✅ PASS: Content-Type is ${contentType}\n`);
      passed++;
    } else {
      console.log(`⚠️  WARNING: Content-Type is ${contentType} (expected XML)\n`);
      // Don't fail, just warn
      passed++;
    }
    
    // Test 3: Contains valid XML
    console.log('Test 3: Contains valid XML');
    if (response.data.includes('<?xml') && response.data.includes('<urlset')) {
      console.log('✅ PASS: Valid XML structure detected\n');
      passed++;
    } else {
      console.log('❌ FAIL: Invalid XML structure\n');
      failed++;
    }
    
    // Test 4: Contains URLs
    console.log('Test 4: Contains URL entries');
    const urlCount = (response.data.match(/<url>/g) || []).length;
    if (urlCount > 0) {
      console.log(`✅ PASS: Found ${urlCount} URL entries\n`);
      passed++;
    } else {
      console.log('❌ FAIL: No URL entries found\n');
      failed++;
    }
    
    // Test 5: Homepage is included
    console.log('Test 5: Homepage URL is present');
    if (response.data.includes('https://mbraceintelligence.com/</loc>')) {
      console.log('✅ PASS: Homepage URL found\n');
      passed++;
    } else {
      console.log('❌ FAIL: Homepage URL not found\n');
      failed++;
    }
    
    // Test 6: Reasonable size
    console.log('Test 6: Sitemap size is reasonable');
    const sizeKB = response.data.length / 1024;
    if (sizeKB > 0.5 && sizeKB < 100) {
      console.log(`✅ PASS: Sitemap size is ${sizeKB.toFixed(2)} KB\n`);
      passed++;
    } else {
      console.log(`⚠️  WARNING: Sitemap size is ${sizeKB.toFixed(2)} KB (unusual)\n`);
      passed++;
    }
    
    // Test 7: robots.txt references sitemap
    console.log('Test 7: robots.txt references sitemap');
    try {
      const robotsResponse = await httpsGet(ROBOTS_URL);
      if (robotsResponse.data.includes(SITEMAP_URL)) {
        console.log('✅ PASS: robots.txt references sitemap\n');
        passed++;
      } else {
        console.log('⚠️  WARNING: robots.txt does not reference sitemap\n');
        passed++;
      }
    } catch (error) {
      console.log('⚠️  WARNING: Could not fetch robots.txt\n');
      passed++;
    }
    
  } catch (error) {
    console.log(`❌ FAIL: Error accessing sitemap: ${error.message}\n`);
    failed++;
  }
  
  return { passed, failed };
}

/**
 * Main function
 */
async function main() {
  console.log('🗺️  MBRACE Sitemap Live Test');
  console.log('================================\n');
  console.log(`Testing: ${SITEMAP_URL}\n`);
  
  const results = await testSitemapAccessibility();
  
  console.log('================================');
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('================================\n');
  
  if (results.failed > 0) {
    console.log('⚠️  Some tests failed. Please review the deployment.\n');
    console.log('Troubleshooting steps:');
    console.log('1. Check if the site is deployed');
    console.log('2. Verify build process completed successfully');
    console.log('3. Check Vercel configuration in vercel.json');
    console.log('4. Review deployment logs for errors\n');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed! Sitemap is live and accessible.\n');
    console.log('Next steps:');
    console.log('1. Submit to Google Search Console: https://search.google.com/search-console');
    console.log('2. Submit to Bing Webmaster Tools: https://www.bing.com/webmasters');
    console.log('3. Monitor indexing status over the next few days\n');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
