import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Initialize Auth0 with full configuration
export const auth0 = new Auth0Client({
  secret: process.env.AUTH0_SECRET!,
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  appBaseUrl: process.env.APP_BASE_URL!,
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
  },
  routes: {
    callback: '/api/auth/callback',
  }
});
