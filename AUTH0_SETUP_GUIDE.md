# Auth0 Setup Guide for Pizza42 Demo

## 🎯 Overview
This guide will help you configure your Auth0 tenant to work with the Pizza42 demo application.

## ✅ Application Configuration

### Step 1: Configure Your Application Settings

Go to **Applications > Applications** in your Auth0 Dashboard and update your application:

1. **Application URIs:**
   - **Allowed Callback URLs:**
     ```
     http://localhost:3001/api/auth/callback
     ```

   - **Allowed Logout URLs:**
     ```
     http://localhost:3001
     ```

   - **Allowed Web Origins:**
     ```
     http://localhost:3001
     ```

2. **Application Type:** Single Page Application (SPA)

3. **Token Endpoint Authentication Method:** None (for SPA)

### Step 2: Enable Refresh Token Rotation

Under **Application Settings > Advanced Settings > Grant Types**, ensure:
- ✅ Authorization Code
- ✅ Refresh Token
- ✅ Implicit (optional, for legacy support)

## 🔐 API Configuration

### Step 3: Create the Pizza42 API

1. Go to **Applications > APIs**
2. Click **Create API**
3. Configure:
   - **Name:** Pizza42 API
   - **Identifier:** `https://pizza42-api`
   - **Signing Algorithm:** RS256

4. Under **Permissions (Scopes)**, add:
   - **Scope:** `place:order`
   - **Description:** Place pizza orders

## 👤 Database Connection

### Step 4: Configure Email Verification

1. Go to **Authentication > Database**
2. Select your database connection (usually "Username-Password-Authentication")
3. Under **Settings**:
   - ✅ Enable "Requires Verification"
   - ✅ Enable "Disable Sign Ups" (if you want controlled access)

## 🔑 Management API Access

### Step 5: Grant Management API Permissions

Your application needs to update user profiles. Configure:

1. Go to **Applications > APIs > Auth0 Management API**
2. Go to **Machine to Machine Applications** tab
3. Find your application and authorize it with these scopes:
   - `read:users`
   - `update:users`
   - `update:users_app_metadata`

## 📧 Email Templates (Optional but Recommended)

### Step 6: Customize Email Verification Template

1. Go to **Branding > Email Templates**
2. Select **Verification Email (using Link)**
3. Customize with Pizza42 branding:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .button {
      background-color: #DC2626;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Welcome to Pizza42! 🍕</h1>
  <p>Please verify your email address to start ordering delicious pizzas.</p>
  <p><a href="{{ url }}" class="button">Verify Email</a></p>
  <p>Or copy this link: {{ url }}</p>
</body>
</html>
```

## 🌐 Social Connections (Coming Next)

### Step 7: Enable Google Social Login

1. Go to **Authentication > Social**
2. Click **+ Create Connection**
3. Select **Google**
4. Use Auth0 Dev Keys for testing, or add your own:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add redirect URI: `https://pizza42-ishan.cic-demo-platform.auth0app.com/login/callback`

## 🔄 Actions (Profile Enrichment)

### Step 8: Create Post-Login Action for Order History

1. Go to **Actions > Flows > Login**
2. Click **+ Create Action**
3. Name: **Add Order History to Token**
4. Code:

\`\`\`javascript
exports.onExecutePostLogin = async (event, api) => {
  // Add order history from app_metadata to ID token
  if (event.user.app_metadata && event.user.app_metadata.lastOrder) {
    api.idToken.setCustomClaim('https://pizza42.com/last_order', event.user.app_metadata.lastOrder);
    api.idToken.setCustomClaim('https://pizza42.com/last_order_date', event.user.app_metadata.lastOrderDate);
  }

  // Add a custom claim showing this is a Pizza42 customer
  api.idToken.setCustomClaim('https://pizza42.com/customer_since', event.user.created_at);
};
\`\`\`

5. **Deploy** the action
6. Add it to the **Login** flow by dragging it into the flow diagram

## 🔐 Passkeys Configuration (Coming Soon)

### Step 9: Enable WebAuthn/Passkeys

1. Go to **Authentication > Multifactor Auth**
2. Enable **WebAuthn with FIDO Security Keys**
3. Configure for passwordless authentication

## ✅ Verification Checklist

Before testing the application, ensure:

- [ ] Application callback URLs are configured
- [ ] API is created with `place:order` scope
- [ ] Email verification is enabled on database connection
- [ ] Management API permissions granted
- [ ] Post-Login Action is deployed and added to flow
- [ ] (Optional) Google Social connection enabled
- [ ] (Optional) Email templates customized

## 🚀 Testing the Setup

1. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open http://localhost:3001

3. Test flows:
   - [ ] Sign up with email/password
   - [ ] Check email for verification link
   - [ ] Verify email
   - [ ] Login after verification
   - [ ] Place an order (should succeed)
   - [ ] View profile to see tokens
   - [ ] Check ID token for custom claims

## 📝 Notes

- The demo uses **app_metadata** to store orders (production apps should use a database)
- Custom claims use namespaced format: `https://pizza42.com/claim_name`
- Training Mode toggle is implemented in the UI to showcase features

## 🎯 What Makes This Demo Special

1. **Interactive Training Mode:** Toggle to see Auth0 feature explanations
2. **Visual Email Verification:** Clear indicators and blocking behavior
3. **Token Transparency:** View decoded tokens in profile page
4. **Production-Ready Patterns:** PKCE flow, proper scope validation, email verification
5. **Business Context:** Framed around Pizza42's Security, Product, and Marketing needs

## 🆘 Troubleshooting

**Issue:** "Callback URL mismatch"
- **Fix:** Ensure `http://localhost:3001/api/auth/callback` is in Allowed Callback URLs

**Issue:** "Invalid audience"
- **Fix:** Check that API identifier in Auth0 matches `https://pizza42-api`

**Issue:** Email not sending
- **Fix:** Check Auth0 Dashboard > Monitoring > Logs for email errors

**Issue:** Management API errors
- **Fix:** Verify Machine to Machine application has required scopes

---

## 🎉 Ready to Present!

Once configured, you can demonstrate:
- ✅ Universal Login with branding
- ✅ Email verification enforcement
- ✅ Secure API with scope validation
- ✅ Profile enrichment with custom claims
- ✅ Training mode for educational demos
- 🔜 Social login (Google)
- 🔜 Passkeys
- 🔜 Account linking
