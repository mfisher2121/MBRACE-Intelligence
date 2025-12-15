# Meta Conversions API (CAPI) Integration Guide
## Server-Side Event Tracking for MBRACE Calculator

---

## Overview

This guide covers server-side event tracking using Meta's Conversions API (CAPI). Server-side tracking:

1. **Works with ad blockers** — Events fire from your server, not the browser
2. **Privacy compliant** — PII is hashed server-side before transmission
3. **Better attribution** — More events reach Meta vs. browser-side pixel
4. **iOS 14+ compatible** — Not affected by ATT tracking limitations

---

## Architecture

```
┌─────────────────────┐
│  User's Browser     │
│  ─────────────────  │
│  Calculator Form    │
│  Submit button      │
└─────────┬───────────┘
          │ POST form data
          ▼
┌─────────────────────┐
│  Netlify Edge       │
│  Function           │
│  ─────────────────  │
│  /api/capi          │
│  • Hash email       │
│  • Hash phone       │
│  • Build event      │
└─────────┬───────────┘
          │ POST hashed data
          ▼
┌─────────────────────┐
│  Meta CAPI          │
│  ─────────────────  │
│  graph.facebook.com │
│  /v18.0/{pixel}/    │
│  events             │
└─────────────────────┘
```

---

## Setup Steps

### 1. Create the Edge Function

Place the edge function at:
```
/netlify/edge-functions/capi-handler.js
```

(File already created in this package)

### 2. Update netlify.toml

Add this to your `netlify.toml`:

```toml
[[edge_functions]]
function = "capi-handler"
path = "/api/capi"
```

### 3. Set Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `META_PIXEL_ID` | Your Facebook Pixel ID | Events Manager → Data Sources → Your Pixel |
| `META_ACCESS_TOKEN` | Conversions API token | Events Manager → Settings → Conversions API → Generate Token |
| `META_TEST_EVENT_CODE` | (Optional) Test code for debugging | Events Manager → Test Events |

### 4. Generate Access Token

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click Settings
4. Scroll to "Conversions API"
5. Click "Generate access token"
6. Copy and save securely — it won't be shown again

---

## Client-Side Integration

Add this code to your calculator after form submission:

```javascript
// After form submission, fire CAPI event
async function fireCAPIEvent(formData) {
  try {
    // Get Facebook cookies if present
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');
    
    const response = await fetch('/api/capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // User data (will be hashed server-side)
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        
        // Event metadata
        event_name: 'Lead',
        event_source_url: window.location.href,
        
        // Facebook cookies for deduplication
        fbc: fbc,
        fbp: fbp,
        
        // Your internal ID (for matching later)
        external_id: formData.submission_id || formData.email,
        
        // Custom data for reporting
        custom_data: {
          building_type: formData.building_type,
          utility: formData.utility,
          income_level: formData.income_level,
          estimated_incentive_low: formData.incentive_low,
          estimated_incentive_high: formData.incentive_high
        }
      })
    });
    
    const result = await response.json();
    console.log('CAPI event sent:', result);
    
  } catch (error) {
    // Don't block user experience on tracking failures
    console.error('CAPI error:', error);
  }
}

// Helper to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
```

### Integration with Calculator Form

Update your form submission handler:

```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Collect form data
  collectStepData();
  
  // Show loading state
  goToStep('loading');
  
  // Fire CAPI event (don't await — let it run async)
  fireCAPIEvent(formData);
  
  // Continue with your existing flow...
  // Send to n8n webhook, show results, etc.
});
```

---

## Event Parameters Reference

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `event_name` | string | Event type: 'Lead', 'Purchase', 'CompleteRegistration', etc. |
| `event_time` | integer | Unix timestamp (seconds) — auto-generated |
| `action_source` | string | Always 'website' for web events |

### User Data (Hashed Server-Side)

| Parameter | Meta Key | Description |
|-----------|----------|-------------|
| `email` | `em` | Email address |
| `phone` | `ph` | Phone number (normalized with country code) |
| `city` | `ct` | City name |
| `state` | `st` | State/region (2-letter code) |
| `zip` | `zp` | ZIP/postal code |
| `external_id` | `external_id` | Your internal user ID |

### Browser Data (Sent Unhashed)

| Parameter | Description |
|-----------|-------------|
| `client_ip_address` | User's IP (from request headers) |
| `client_user_agent` | Browser user agent string |
| `fbc` | Facebook click ID cookie |
| `fbp` | Facebook browser ID cookie |

### Custom Data

| Parameter | Description |
|-----------|-------------|
| `custom_data` | Object with any custom properties for reporting |

---

## Testing

### 1. Enable Test Mode

Set `META_TEST_EVENT_CODE` environment variable to your test code from Events Manager.

### 2. Submit Test Event

Fill out the calculator with test data and submit.

### 3. Check Events Manager

Go to Events Manager → Test Events. You should see your event appear within a few seconds.

### 4. Verify Hashing

In the test event details, check that:
- `em` (email) is hashed (64-character hex string)
- `ph` (phone) is hashed
- `client_ip_address` and `client_user_agent` are present

### 5. Remove Test Mode

Once verified, remove `META_TEST_EVENT_CODE` from environment variables for production.

---

## Deduplication

If you're also running browser-side pixel, you need to deduplicate events.

### Option 1: Use Event ID

Generate a unique event ID for each submission and send it to both browser pixel and CAPI:

```javascript
// Generate unique event ID
const eventId = `mbrace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Browser pixel
fbq('track', 'Lead', { content_name: 'calculator' }, { eventID: eventId });

// CAPI (add to payload)
{
  event_id: eventId,
  // ... other params
}
```

### Option 2: Server-Only (Recommended)

Disable browser-side Lead event and rely entirely on CAPI. This is simpler and more reliable.

```javascript
// Remove this from your browser code:
// fbq('track', 'Lead');

// Only use CAPI for Lead events
fireCAPIEvent(formData);
```

Keep browser pixel only for PageView events.

---

## Troubleshooting

### Event Not Appearing in Events Manager

1. Check Netlify function logs for errors
2. Verify environment variables are set correctly
3. Ensure access token is valid (regenerate if needed)
4. Check that pixel ID matches your Events Manager

### "Invalid Parameter" Error

1. Verify phone numbers are normalized correctly
2. Check that email format is valid
3. Ensure all required fields are present

### Low Event Match Rate

1. Include more user data parameters (city, state, zip)
2. Ensure Facebook cookies (`fbc`, `fbp`) are being captured
3. Verify hashing is working correctly (check test events)

### CORS Errors

The edge function includes CORS headers. If you still see CORS issues:
1. Verify the function is deployed correctly
2. Check that the path matches your netlify.toml configuration

---

## Security Notes

1. **Never log PII** — The edge function hashes data before logging
2. **Access token security** — Never expose access token in client-side code
3. **HTTPS only** — Netlify enforces HTTPS by default
4. **Rate limiting** — Meta has rate limits; batch events if sending high volume

---

## Files in This Package

```
/calculator/
├── netlify/
│   └── edge-functions/
│       └── capi-handler.js    # Edge function for CAPI
├── netlify.toml               # Updated with edge function config
└── CAPI_INTEGRATION.md        # This file
```
