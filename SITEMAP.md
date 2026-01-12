# Sitemap Documentation

## Overview

This repository includes automated sitemap generation and validation for the MBRACE Intelligence website. The sitemap helps search engines discover and index all pages on the site.

## Files

- **`public/sitemap.xml`** - The sitemap file served to search engines
- **`scripts/generate-sitemap.js`** - Automated sitemap generation script
- **`scripts/test-sitemap.js`** - Sitemap validation test script
- **`public/robots.txt`** - References the sitemap location

## Sitemap URLs

The sitemap includes 19 URLs across the following sections:

### Main Pages
- Homepage (`/`)
- Consultation booking (`/consultation`)

### Calculator Flow (7 pages)
- Calculator landing (`/calculator`)
- Location selection (`/calculator/location`)
- Home type selection (`/calculator/home-type`)
- Current system details (`/calculator/current-system`)
- Income/eligibility (`/calculator/income`)
- Contact form (`/calculator/contact`)
- Results page (`/calculator/results`)

### Playbooks (4 pages)
- Playbooks hub (`/playbooks`)
- Nonprofit playbook (`/playbooks/nonprofit`)
- Low-income housing playbook (`/playbooks/low-income`)
- Contractor resources (`/playbooks/contractor`)

### Intelligence
- Market intelligence dashboard (`/intelligence`)

### Static HTML Pages (5 pages)
- `homeowner.html`
- `nonprofit.html`
- `lihtc.html`
- `contractor_partnership_onepager.html`
- `success.html`

## Usage

### Generate Sitemap

To regenerate the sitemap with current date:

```bash
npm run generate-sitemap
```

This will:
1. Generate sitemap XML with all routes
2. Validate the XML structure
3. Write to `public/sitemap.xml`
4. Display summary with URL count

### Validate Sitemap

To validate the existing sitemap locally:

```bash
npm run test:sitemap
```

This runs 8 validation tests:
1. File exists
2. Valid XML declaration
3. Contains urlset element
4. Contains URL entries
5. Homepage is included
6. Required elements present
7. Balanced XML tags
8. Reasonable file size

### Test Live Deployment

To test the sitemap after deployment:

```bash
npm run test:sitemap:live
```

This checks:
1. Sitemap URL is accessible (HTTP 200)
2. Correct Content-Type header
3. Valid XML structure
4. Contains URL entries
5. Homepage is present
6. Reasonable file size
7. Referenced in robots.txt

### Build Process

The sitemap is automatically regenerated during the build:

```bash
npm run build
```

This ensures the sitemap is always up-to-date with the latest date when deployed.

## Deployment

### Vercel Configuration

The `vercel.json` includes headers for proper sitemap serving:

- **Content-Type**: `application/xml`
- **Cache-Control**: 1 hour cache (3600 seconds)

### Testing After Deployment

After deployment, verify the sitemap is accessible:

1. **Direct access**: https://mbraceintelligence.com/sitemap.xml
2. **Via robots.txt**: https://mbraceintelligence.com/robots.txt (should reference sitemap)
3. **Google Search Console**: Submit sitemap URL for indexing

### Search Engine Submission

Submit the sitemap to search engines:

#### Google Search Console
1. Go to https://search.google.com/search-console
2. Select property: mbraceintelligence.com
3. Navigate to Sitemaps section
4. Submit: `https://mbraceintelligence.com/sitemap.xml`

#### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add/select site
3. Submit sitemap URL in Sitemaps section

## Maintenance

### Adding New Routes

When adding new routes to the application:

1. Add the route to `scripts/generate-sitemap.js` in the `routes` array
2. Include metadata: `path`, `priority`, `changefreq`
3. Run `npm run generate-sitemap`
4. Run `npm run test:sitemap` to validate

Example:

```javascript
const routes = [
  // ... existing routes
  { path: '/new-page', priority: 0.7, changefreq: 'monthly' },
];
```

### Priority Guidelines

- **1.0** - Homepage only
- **0.9** - Primary conversion pages (calculator entry)
- **0.8** - Important content hubs (playbooks, intelligence)
- **0.7** - Secondary pages (calculator steps, consultation)
- **0.6** - Tertiary pages (results, partnerships)
- **0.3** - Utility pages (success confirmation)

### Change Frequency

- **weekly** - Content updated regularly (homepage, playbooks, intelligence)
- **monthly** - Stable content with occasional updates (most pages)
- **yearly** - Rarely changing pages (success pages)

## Troubleshooting

### Sitemap Not Accessible After Deployment

1. Check build logs for sitemap generation
2. Verify `dist/web-build` contains `sitemap.xml`
3. Check Vercel deployment includes the file
4. Test URL directly: `curl https://mbraceintelligence.com/sitemap.xml`

### Sitemap Not Updating

1. Verify build command runs `generate-sitemap` script
2. Check if `public/sitemap.xml` was updated locally
3. Ensure changes are committed to git
4. Clear CDN cache if applicable

### Search Engines Not Crawling

1. Verify sitemap is accessible (HTTP 200)
2. Check robots.txt references sitemap
3. Submit sitemap manually in Search Console
4. Check Search Console for crawl errors
5. Verify no `noindex` meta tags on pages

## Monitoring

### Key Metrics to Track

1. **Sitemap submission status** in Google Search Console
2. **Number of indexed pages** vs sitemap URLs
3. **Crawl errors** for sitemap URLs
4. **Sitemap last fetch date** by search engines

### Debugging Output

The sitemap generation script includes logging:

```
🗺️  MBRACE Sitemap Generator
================================

📝 Generating sitemap...
✅ Validating sitemap...
✅ Sitemap is valid (19 URLs)
💾 Writing to .../public/sitemap.xml...
✅ Sitemap generated successfully!

📍 Location: .../public/sitemap.xml
🌐 URL: https://mbraceintelligence.com/sitemap.xml
```

## Technical Details

### XML Structure

The sitemap follows the [Sitemaps XML format](https://www.sitemaps.org/protocol.html):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mbraceintelligence.com/</loc>
    <lastmod>2026-01-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- more URLs -->
</urlset>
```

### Expo Router Integration

The sitemap accounts for Expo Router's file-based routing:
- Root `.tsx` files map to routes
- Layout file (`_layout.tsx`) defines route structure
- Static HTML files are also included

### Build Pipeline

1. **Pre-build**: `generate-sitemap` script runs
2. **Build**: `expo export:web` creates web bundle
3. **Output**: `dist/web-build/` includes sitemap.xml
4. **Deploy**: Vercel serves from output directory

## References

- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Vercel Static Files](https://vercel.com/docs/concepts/projects/project-configuration#public-directory)
- [Expo Router Documentation](https://docs.expo.dev/routing/introduction/)
