import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

// CORS headers - Allow both localhost and production
const getAllowedOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:5173', 'https://pizza42-frontend.vercel.app'];
  return allowedOrigins.includes(origin || '') ? origin : 'http://localhost:5173';
};

const getCorsHeaders = (request: NextRequest) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(request) || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');

    let user;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Token from React frontend - verify it
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
          headers: getCorsHeaders(req)
        });
      }

      user = await response.json();
    } else {
      // Try session-based auth for Next.js frontend
      const session = await auth0.getSession();
      user = session?.user;

      if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, {
          status: 401,
          headers: getCorsHeaders(req)
        });
      }
    }

    // Check if email is verified - CRITICAL requirement from Pizza42
    if (!user.email_verified) {
      return NextResponse.json({
        error: 'Please verify your email before placing an order. Check your inbox for the verification email.',
        emailVerified: false
      }, {
        status: 403,
        headers: getCorsHeaders(req)
      });
    }

    // Get the access token to validate scopes (optional)
    // const accessToken = await auth0.getAccessToken();

    // Parse the request body
    const body = await req.json();
    const { pizzaId, pizzaName, price } = body;

    if (!pizzaId || !pizzaName || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the order object
    const order = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      pizzaId,
      pizzaName,
      price,
      timestamp: new Date().toISOString(),
    };

    // TODO: In production, save this order to your database
    // For now, we'll update the user's Auth0 profile with this order

    try {
      // Call Auth0 Management API to update user metadata with order list
      const mgmtDomain = process.env.AUTH0_MGMT_DOMAIN;
      const managementToken = await getManagementApiToken();

      // First, get the current user to retrieve existing orders
      const getUserResponse = await fetch(`https://${mgmtDomain}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        headers: {
          'Authorization': `Bearer ${managementToken}`,
        },
      });

      let existingOrders = [];
      if (getUserResponse.ok) {
        const userData = await getUserResponse.json();
        existingOrders = userData.app_metadata?.orders || [];
      }

      // Add new order to the list and keep only the last 4 orders
      const updatedOrders = [...existingOrders, order].slice(-4);

      console.log('Updating user app_metadata with order list:', {
        userId: user.sub,
        totalOrders: updatedOrders.length,
        newOrder: order,
        keptMostRecent: 4
      });

      const updateResponse = await fetch(`https://${mgmtDomain}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${managementToken}`,
        },
        body: JSON.stringify({
          app_metadata: {
            orders: updatedOrders,
            totalOrders: updatedOrders.length,
            lastOrderDate: order.timestamp,
          },
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Failed to update user profile:', errorText);
      } else {
        console.log('✅ Successfully updated user app_metadata with order list');
      }
    } catch (profileError) {
      console.error('Error updating user profile:', profileError);
      // Don't fail the order if profile update fails
    }

    // Return success response with CORS headers
    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: `Your ${pizzaName} pizza has been ordered!`,
    }, {
      status: 200,
      headers: getCorsHeaders(req)
    });

  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, {
      status: 500,
      headers: getCorsHeaders(req)
    });
  }
}

// Helper function to get Management API token
async function getManagementApiToken() {
  const mgmtDomain = process.env.AUTH0_MGMT_DOMAIN; // Use management domain
  const clientId = process.env.MGMT_CLIENT_ID; // Use management client
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
