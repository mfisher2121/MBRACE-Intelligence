#!/usr/bin/env node

/**
 * Sitemap Generator for MBRACE Intelligence
 * 
 * This script generates a sitemap.xml file based on the application routes
 * and validates its XML structure.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mbraceintelligence.com';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Define all routes with their metadata
const routes = [
  // Homepage
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  
  // Calculator Flow
  { path: '/calculator', priority: 0.9, changefreq: 'monthly' },
  { path: '/calculator/location', priority: 0.7, changefreq: 'monthly' },
  { path: '/calculator/home-type', priority: 0.7, changefreq: 'monthly' },
  { path: '/calculator/current-system', priority: 0.7, changefreq: 'monthly' },
  { path: '/calculator/income', priority: 0.7, changefreq: 'monthly' },
  { path: '/calculator/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/calculator/results', priority: 0.6, changefreq: 'monthly' },
  
  // Playbooks / Resource Center
  { path: '/playbooks', priority: 0.8, changefreq: 'weekly' },
  { path: '/playbooks/nonprofit', priority: 0.8, changefreq: 'weekly' },
  { path: '/playbooks/low-income', priority: 0.8, changefreq: 'weekly' },
  { path: '/playbooks/contractor', priority: 0.8, changefreq: 'weekly' },
  
  // Market Intelligence
  { path: '/intelligence', priority: 0.8, changefreq: 'weekly' },
  
  // Consultation
  { path: '/consultation', priority: 0.7, changefreq: 'monthly' },
  
  // Static HTML Pages
  { path: '/homeowner.html', priority: 0.7, changefreq: 'monthly' },
  { path: '/nonprofit.html', priority: 0.7, changefreq: 'monthly' },
  { path: '/lihtc.html', priority: 0.7, changefreq: 'monthly' },
  { path: '/contractor_partnership_onepager.html', priority: 0.6, changefreq: 'monthly' },
  { path: '/success.html', priority: 0.3, changefreq: 'yearly' },
];

/**
 * Generate sitemap XML content
 */
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  \n';
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${route.path}</loc>\n`;
    xml += `    <lastmod>${CURRENT_DATE}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '\n</urlset>\n';
  return xml;
}

/**
 * Validate XML structure
 */
function validateSitemap(content) {
  const issues = [];
  
  // Check required tags
  if (!content.includes('<?xml')) {
    issues.push('Missing XML declaration');
  }
  if (!content.includes('<urlset')) {
    issues.push('Missing urlset tag');
  }
  if (!content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    issues.push('Missing or incorrect xmlns attribute');
  }
  
  // Count URLs
  const urlCount = (content.match(/<url>/g) || []).length;
  if (urlCount === 0) {
    issues.push('No URLs found in sitemap');
  }
  
  // Check for balanced tags
  const openTags = (content.match(/<url>/g) || []).length;
  const closeTags = (content.match(/<\/url>/g) || []).length;
  if (openTags !== closeTags) {
    issues.push('Unbalanced <url> tags');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    urlCount
  };
}

/**
 * Main function
 */
function main() {
  console.log('🗺️  MBRACE Sitemap Generator');
  console.log('================================\n');
  
  // Generate sitemap
  console.log('📝 Generating sitemap...');
  const sitemapContent = generateSitemap();
  
  // Validate
  console.log('✅ Validating sitemap...');
  const validation = validateSitemap(sitemapContent);
  
  if (!validation.valid) {
    console.error('❌ Sitemap validation failed:');
    validation.issues.forEach(issue => console.error(`   - ${issue}`));
    process.exit(1);
  }
  
  console.log(`✅ Sitemap is valid (${validation.urlCount} URLs)`);
  
  // Write to file
  console.log(`💾 Writing to ${SITEMAP_PATH}...`);
  
  // Ensure public directory exists
  const publicDir = path.dirname(SITEMAP_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
  
  console.log('✅ Sitemap generated successfully!\n');
  console.log('📍 Location:', SITEMAP_PATH);
  console.log('🌐 URL:', `${DOMAIN}/sitemap.xml`);
  console.log('\n💡 Tip: Test accessibility at https://mbraceintelligence.com/sitemap.xml after deployment\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, validateSitemap, routes };
