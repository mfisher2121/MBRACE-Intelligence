/**
 * MBRACE Calculator — Netlify Edge Function for Meta Conversions API
 * 
 * This edge function handles server-side event tracking for Meta CAPI.
 * It hashes PII (email, phone) server-side before sending to Meta,
 * ensuring privacy compliance while maintaining attribution.
 * 
 * SETUP:
 * 1. Create file at: netlify/edge-functions/capi-handler.js
 * 2. Add to netlify.toml:
 *    [[edge_functions]]
 *    function = "capi-handler"
 *    path = "/api/capi"
 * 3. Set environment variables in Netlify dashboard:
 *    - META_PIXEL_ID
 *    - META_ACCESS_TOKEN
 *    - META_TEST_EVENT_CODE (optional, for testing)
 */

// Netlify Edge Function handler
export default async (request, context) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    
    // Extract user data
    const {
      email,
      phone,
      address,
      city,
      state,
      zip,
      event_name = 'Lead',
      event_source_url,
      client_ip_address,
      client_user_agent,
      fbc, // Facebook click ID (from _fbc cookie)
      fbp, // Facebook browser ID (from _fbp cookie)
      external_id, // Your internal user/submission ID
      custom_data = {}
    } = body;

    // Get IP and User Agent from request if not provided
    const ip = client_ip_address || request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || '';
    const userAgent = client_user_agent || request.headers.get('user-agent') || '';

    // Hash function using SHA-256
    async function hashValue(value) {
      if (!value) return null;
      
      // Normalize: lowercase, trim whitespace
      const normalized = String(value).toLowerCase().trim();
      
      // SHA-256 hash
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Normalize phone number (remove non-digits, ensure country code)
    function normalizePhone(phone) {
      if (!phone) return null;
      let digits = phone.replace(/\D/g, '');
      // Add US country code if not present
      if (digits.length === 10) {
        digits = '1' + digits;
      }
      return digits;
    }

    // Hash user data
    const hashedEmail = await hashValue(email);
    const hashedPhone = await hashValue(normalizePhone(phone));
    const hashedCity = await hashValue(city);
    const hashedState = await hashValue(state);
    const hashedZip = await hashValue(zip);
    const hashedExternalId = external_id ? await hashValue(external_id) : null;

    // Build user_data object (only include non-null values)
    const user_data = {};
    if (hashedEmail) user_data.em = [hashedEmail];
    if (hashedPhone) user_data.ph = [hashedPhone];
    if (hashedCity) user_data.ct = [hashedCity];
    if (hashedState) user_data.st = [hashedState];
    if (hashedZip) user_data.zp = [hashedZip];
    if (hashedExternalId) user_data.external_id = [hashedExternalId];
    if (ip) user_data.client_ip_address = ip;
    if (userAgent) user_data.client_user_agent = userAgent;
    if (fbc) user_data.fbc = fbc;
    if (fbp) user_data.fbp = fbp;

    // Build event payload
    const event = {
      event_name: event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: event_source_url || request.headers.get('referer') || '',
      user_data: user_data,
      custom_data: {
        ...custom_data,
        content_category: 'heat_pump_incentive_calculator',
        content_name: 'mbrace_calculator_submission'
      }
    };

    // Build API request
    const pixelId = Deno.env.get('META_PIXEL_ID');
    const accessToken = Deno.env.get('META_ACCESS_TOKEN');
    const testEventCode = Deno.env.get('META_TEST_EVENT_CODE');

    if (!pixelId || !accessToken) {
      console.error('Missing META_PIXEL_ID or META_ACCESS_TOKEN');
      return new Response(JSON.stringify({ error: 'Configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events`;
    
    const payload = {
      data: [event],
      access_token: accessToken
    };

    // Add test event code if present (for testing in Events Manager)
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    // Send to Meta CAPI
    const metaResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta CAPI error:', metaResult);
      return new Response(JSON.stringify({ 
        error: 'Meta API error', 
        details: metaResult 
      }), {
        status: metaResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Success response
    return new Response(JSON.stringify({ 
      success: true, 
      events_received: metaResult.events_received,
      fbtrace_id: metaResult.fbtrace_id
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('CAPI handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle CORS preflight
export const config = {
  path: '/api/capi'
};
