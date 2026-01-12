# Deployment Checklist for Sitemap

This checklist ensures the sitemap is properly deployed and accessible to search engines.

## Pre-Deployment

- [ ] Run `npm run test:sitemap` to validate sitemap structure
- [ ] Verify sitemap contains all expected URLs (19 URLs currently)
- [ ] Check `lastmod` date is current
- [ ] Review `robots.txt` references sitemap correctly
- [ ] Ensure `vercel.json` has proper headers configured

## During Deployment

- [ ] Run `npm run build` (automatically generates sitemap)
- [ ] Verify build output includes `sitemap.xml` in `dist/web-build/`
- [ ] Check build logs show sitemap generation succeeded
- [ ] Confirm no build errors related to static assets

## Post-Deployment Verification

### 1. Direct Access Test
- [ ] Visit https://mbraceintelligence.com/sitemap.xml
- [ ] Verify it returns XML (not 404)
- [ ] Check Content-Type header is `application/xml`
- [ ] Confirm all 19 URLs are present

### 2. Robots.txt Verification
- [ ] Visit https://mbraceintelligence.com/robots.txt
- [ ] Verify it contains: `Sitemap: https://mbraceintelligence.com/sitemap.xml`

### 3. XML Validation
Use online validators:
- [ ] https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] https://websiteseochecker.com/sitemap-validator/

### 4. Search Engine Submission

#### Google Search Console
- [ ] Log in to https://search.google.com/search-console
- [ ] Select property: mbraceintelligence.com
- [ ] Go to Sitemaps section
- [ ] Submit: `https://mbraceintelligence.com/sitemap.xml`
- [ ] Wait for Google to process (can take hours to days)
- [ ] Check for any errors in Search Console

#### Bing Webmaster Tools
- [ ] Log in to https://www.bing.com/webmasters
- [ ] Add/select site
- [ ] Go to Sitemaps section
- [ ] Submit: `https://mbraceintelligence.com/sitemap.xml`
- [ ] Monitor for processing status

## Testing Commands

Run these locally before and after deployment:

```bash
# Validate sitemap structure
npm run test:sitemap

# Regenerate sitemap with current date
npm run generate-sitemap

# Test with curl (after deployment)
curl -I https://mbraceintelligence.com/sitemap.xml

# View sitemap content (after deployment)
curl https://mbraceintelligence.com/sitemap.xml
```

## Monitoring

### Week 1
- [ ] Check Search Console for sitemap processing
- [ ] Verify no crawl errors
- [ ] Monitor number of indexed pages

### Week 2-4
- [ ] Compare indexed pages vs sitemap URLs
- [ ] Check for any 404s on sitemap URLs
- [ ] Review crawl frequency in Search Console

### Ongoing
- [ ] Update sitemap when adding new routes
- [ ] Regenerate monthly to keep `lastmod` fresh
- [ ] Monitor Search Console for issues

## Troubleshooting

### Sitemap returns 404
1. Check if file exists in build output: `dist/web-build/sitemap.xml`
2. Verify Vercel configuration in `vercel.json`
3. Check deployment logs for errors
4. Try manual upload to Vercel dashboard

### Wrong Content-Type
1. Verify `vercel.json` headers configuration
2. Check for conflicting headers in server config
3. Test with `curl -I` to see actual headers

### Search engines not crawling
1. Verify sitemap is accessible (HTTP 200)
2. Check `robots.txt` is not blocking
3. Ensure no `noindex` meta tags on pages
4. Wait 1-2 weeks for initial crawl
5. Use "Request Indexing" in Search Console for key pages

### URLs not being indexed
1. Check if URLs are accessible (not 404)
2. Verify no `noindex` directives
3. Check for redirect chains
4. Ensure pages have meaningful content
5. Check Search Console for specific crawl errors

## Quick Reference

| Task | Command | Expected Result |
|------|---------|----------------|
| Generate | `npm run generate-sitemap` | ✅ Sitemap is valid (19 URLs) |
| Validate | `npm run test:sitemap` | ✅ All tests passed |
| Build | `npm run build` | Sitemap generated during build |
| Check live | `curl https://mbraceintelligence.com/sitemap.xml` | XML content returned |
| Check headers | `curl -I https://mbraceintelligence.com/sitemap.xml` | Content-Type: application/xml |

## Success Criteria

✅ Sitemap accessible at correct URL  
✅ Returns valid XML with proper Content-Type  
✅ Contains all 19 application URLs  
✅ Referenced in robots.txt  
✅ Submitted to Google Search Console  
✅ Submitted to Bing Webmaster Tools  
✅ No crawl errors after 1 week  
✅ Pages beginning to appear in search index  

---

**Last Updated**: 2026-01-12  
**Sitemap URL**: https://mbraceintelligence.com/sitemap.xml  
**Documentation**: See [SITEMAP.md](./SITEMAP.md) for complete details
