#!/usr/bin/env node

/**
 * Sitemap Validation Test
 * 
 * This script validates the sitemap.xml file structure and content.
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

function runTests() {
  console.log('🧪 Running Sitemap Validation Tests');
  console.log('====================================\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: File exists
  console.log('Test 1: Sitemap file exists');
  if (fs.existsSync(SITEMAP_PATH)) {
    console.log('✅ PASS: sitemap.xml exists\n');
    passed++;
  } else {
    console.log('❌ FAIL: sitemap.xml not found\n');
    failed++;
    return { passed, failed };
  }
  
  // Read the file
  const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  
  // Test 2: Valid XML declaration
  console.log('Test 2: Valid XML declaration');
  if (content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.log('✅ PASS: Valid XML declaration\n');
    passed++;
  } else {
    console.log('❌ FAIL: Invalid or missing XML declaration\n');
    failed++;
  }
  
  // Test 3: Contains urlset
  console.log('Test 3: Contains urlset element');
  if (content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    console.log('✅ PASS: Valid urlset element with namespace\n');
    passed++;
  } else {
    console.log('❌ FAIL: Missing or invalid urlset element\n');
    failed++;
  }
  
  // Test 4: Contains URLs
  console.log('Test 4: Contains URL entries');
  const urlCount = (content.match(/<url>/g) || []).length;
  if (urlCount > 0) {
    console.log(`✅ PASS: Found ${urlCount} URL entries\n`);
    passed++;
  } else {
    console.log('❌ FAIL: No URL entries found\n');
    failed++;
  }
  
  // Test 5: Homepage is included
  console.log('Test 5: Homepage is included');
  if (content.includes('<loc>https://mbraceintelligence.com/</loc>')) {
    console.log('✅ PASS: Homepage URL found\n');
    passed++;
  } else {
    console.log('❌ FAIL: Homepage URL not found\n');
    failed++;
  }
  
  // Test 6: Required elements present
  console.log('Test 6: Required elements in URLs');
  const hasLoc = content.includes('<loc>');
  const hasLastmod = content.includes('<lastmod>');
  const hasChangefreq = content.includes('<changefreq>');
  const hasPriority = content.includes('<priority>');
  
  if (hasLoc && hasLastmod && hasChangefreq && hasPriority) {
    console.log('✅ PASS: All required URL elements present\n');
    passed++;
  } else {
    console.log('❌ FAIL: Missing required URL elements\n');
    if (!hasLoc) console.log('   - Missing <loc>\n');
    if (!hasLastmod) console.log('   - Missing <lastmod>\n');
    if (!hasChangefreq) console.log('   - Missing <changefreq>\n');
    if (!hasPriority) console.log('   - Missing <priority>\n');
    failed++;
  }
  
  // Test 7: Balanced tags
  console.log('Test 7: Balanced XML tags');
  const openUrl = (content.match(/<url>/g) || []).length;
  const closeUrl = (content.match(/<\/url>/g) || []).length;
  const openUrlset = (content.match(/<urlset/g) || []).length;
  const closeUrlset = (content.match(/<\/urlset>/g) || []).length;
  
  if (openUrl === closeUrl && openUrlset === closeUrlset) {
    console.log('✅ PASS: All XML tags are balanced\n');
    passed++;
  } else {
    console.log('❌ FAIL: Unbalanced XML tags\n');
    failed++;
  }
  
  // Test 8: File size check
  console.log('Test 8: File size is reasonable');
  const stats = fs.statSync(SITEMAP_PATH);
  const fileSizeKB = stats.size / 1024;
  if (fileSizeKB > 0.5 && fileSizeKB < 50) {
    console.log(`✅ PASS: File size is ${fileSizeKB.toFixed(2)} KB\n`);
    passed++;
  } else {
    console.log(`❌ FAIL: File size is unusual: ${fileSizeKB.toFixed(2)} KB\n`);
    failed++;
  }
  
  return { passed, failed };
}

// Run tests
const results = runTests();

console.log('====================================');
console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log('====================================\n');

if (results.failed > 0) {
  console.log('⚠️  Some tests failed. Please review the sitemap.xml file.\n');
  process.exit(1);
} else {
  console.log('🎉 All tests passed! Sitemap is valid.\n');
  process.exit(0);
}
