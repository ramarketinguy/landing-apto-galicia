// Vercel Serverless Function - Meta Conversions API Proxy
// This function sends server-side events to Meta, bypassing ad blockers

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const PIXEL_ID = process.env.META_PIXEL_ID || '890295370288342';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';

    if (!ACCESS_TOKEN) {
        console.error('META_ACCESS_TOKEN not configured');
        return res.status(500).json({ error: 'Server configuration error: missing access token' });
    }

    try {
        const { event_name, event_time, event_id, event_source_url, user_data, custom_data, action_source } = req.body;

        const eventData = {
            data: [{
                event_name: event_name || 'PageView',
                event_time: event_time || Math.floor(Date.now() / 1000),
                event_id: event_id || undefined,
                event_source_url: event_source_url || undefined,
                action_source: action_source || 'website',
                user_data: {
                    client_ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress,
                    client_user_agent: req.headers['user-agent'],
                    ...(user_data || {})
                },
                custom_data: custom_data || {}
            }]
        };

        // Add test_event_code if configured (for testing in Events Manager)
        if (TEST_EVENT_CODE) {
            eventData.test_event_code = TEST_EVENT_CODE;
        }

        const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Meta CAPI Error:', JSON.stringify(result));
            return res.status(response.status).json({ error: 'Meta API error', details: result });
        }

        console.log('Meta CAPI Success:', JSON.stringify(result));
        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('CAPI Proxy Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
