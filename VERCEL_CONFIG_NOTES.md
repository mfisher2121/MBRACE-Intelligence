# Vercel Configuration Notes

## Cache Control Settings

### Sitemap.xml and robots.txt
- **Cache Duration**: 86400 seconds (24 hours)
- **Rationale**: 
  - Search engine crawlers typically check sitemaps daily
  - 24-hour cache balances freshness with server load
  - Allows for daily sitemap regeneration during builds
  - Short enough to reflect updates quickly
  - Long enough to avoid excessive crawler requests
  
### Cache Headers Explained
- `max-age=86400`: Browser/client cache for 24 hours
- `s-maxage=86400`: CDN/shared cache for 24 hours
- `public`: Allows caching by any cache (browsers, CDNs, proxies)

## Content-Type Headers

### sitemap.xml
- **Content-Type**: `application/xml`
- Required by sitemap protocol specification
- Ensures proper parsing by search engine crawlers

### robots.txt
- **Content-Type**: `text/plain`
- Standard for robots.txt files
- Ensures proper interpretation by crawlers
