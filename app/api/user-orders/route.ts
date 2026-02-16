import { NextResponse, NextRequest } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.substring(7);

    // Verify the token with Auth0
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, {
        status: 401,
        headers: corsHeaders
      });
    }

    const user = await response.json();

    // Get Management API token
    const managementToken = await getManagementApiToken();
    const mgmtDomain = process.env.AUTH0_MGMT_DOMAIN;

    // Fetch user's app_metadata from Auth0
    const getUserResponse = await fetch(`https://${mgmtDomain}/api/v2/users/${encodeURIComponent(user.sub)}`, {
      headers: {
        'Authorization': `Bearer ${managementToken}`,
      },
    });

    if (!getUserResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, {
        status: 500,
        headers: corsHeaders
      });
    }

    const userData = await getUserResponse.json();
    const orders = userData.app_metadata?.orders || [];

    return NextResponse.json({
      orders: orders.reverse() // Most recent first
    }, {
      status: 200,
      headers: corsHeaders
    });

  } catch (error: any) {
    console.error('User orders API error:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Helper function to get Management API token
async function getManagementApiToken() {
  const mgmtDomain = process.env.AUTH0_MGMT_DOMAIN;
  const clientId = process.env.MGMT_CLIENT_ID;
  const clientSecret = process.env.MGMT_CLIENT_SECRET;

  const response = await fetch(`https://${mgmtDomain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${mgmtDomain}/api/v2/`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Management API token error:', errorText);
    throw new Error('Failed to get management API token');
  }

  const data = await response.json();
  return data.access_token;
}
