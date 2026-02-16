# 🍕 Pizza42 - Auth0 CIAM Demo Application

A modern pizza ordering application showcasing Auth0's Customer Identity and Access Management (CIAM) capabilities.

## 🎯 Project Overview

This demo was built for the Auth0 CIAM Specialist tech challenge, showing how Auth0 solves identity challenges across three stakeholder groups:

- **🔒 Security Team:** Offloads credential management, implements PKCE flow, enforces email verification
- **⚡ Product Team:** Frictionless login, turnkey password reset, multiple auth methods
- **📊 Marketing Team:** Profile enrichment, custom claims, ready for personalization

## ✨ Features Implemented

- ✅ Universal Login with Auth0
- ✅ Email/Password Authentication
- ✅ Email Verification Enforcement
- ✅ Protected API with Scope Validation
- ✅ Profile Enrichment (orders in metadata)
- ✅ Custom Token Claims
- ✅ Training Mode (interactive demo feature)
- ✅ User Dashboard with Token Display

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Auth0:**

   See [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md) for detailed setup instructions

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open browser:**

   Navigate to [http://localhost:3001](http://localhost:3001)

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Auth0 Next.js SDK

## 📖 Key Files

- `app/api/auth/[auth0]/route.ts` - Auth0 SDK endpoints
- `app/api/orders/route.ts` - Protected order API
- `app/profile/page.tsx` - User dashboard
- `components/Header.tsx` - Nav with Training Mode toggle

## 🎓 Training Mode

Toggle Training Mode in the header to see educational annotations about Auth0 features - perfect for demos!

## 🔐 Security Highlights

- Authorization Code Flow with PKCE
- Email verification before orders
- Scope-based API authorization (`place:order`)
- Secure token storage (HTTP-only cookies)
- No client secrets in browser

## 📚 Documentation

- [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md) - Complete Auth0 configuration
- [Tech Challenge PDF](./CIAM%20Auth0%20Specialist%20Tech%20Challenge%20Jan%202026%20(1).pdf) - Original requirements

## 🚀 Next Steps

- [ ] Add Google Social Login
- [ ] Implement Passkeys/WebAuthn
- [ ] Add Account Linking
- [ ] Deploy to Vercel

## 🎉 What Makes This Special

1. Interactive Training Mode for demonstrations
2. Production-ready security patterns
3. Complete end-to-end flows
4. Comprehensive documentation
5. Business context (Security/Product/Marketing personas)

---

Built with ❤️ for Auth0 CIAM Specialist Challenge
