# IEEE ITBA - Newsletter & Sender.net Direct Client Setup Guide

This document explains the client-side architecture, secret configuration, and subscriber management for the IEEE ITBA newsletter integration without using Google Cloud Functions or Firestore backend triggers (avoiding paid Google Cloud infrastructure).

---

## 1. Architecture Overview (No Google Cloud / No Functions)

```
[ Angular Client (Register/Profile) ] 
       │
       ├─► Updates Firestore user document (subscribedToNewsletter: boolean)
       │
       └─► SenderService (REST API Call)
                 │
                 ▼
     [ Sender.net REST API ] ──► (Sync Subscribers)
```

### Key Principles:
- **Zero GCP Cost**: No Firebase Cloud Functions, Google Cloud Secret Manager, or serverless compute triggers are used.
- **Client-Side Sync**: When a user opts in or out during registration (`RegisterComponent`) or profile edit (`GeneralComponent`), `SenderService` sends a direct API request to Sender.net.
- **Resilient Fallback**: If `senderApiKey` is empty or the network request fails, user registration and profile updates complete smoothly without blocking the user.

---

## 2. Configuring `senderApiKey`

To enable live synchronization with Sender.net:

1. Obtain an API Key from your [Sender.net Dashboard](https://app.sender.net/settings/tokens).
2. Open `src/app/secrets.ts`.
3. Set the `senderApiKey` variable:

```typescript
export const senderApiKey = 'your_sender_api_key_here';
```

*Note: If `senderApiKey` is empty (`''`), `SenderService` will log a notice in the browser console and bypass the HTTP call.*

---

## 3. Local Development Workflow

Start the Angular client and local emulators:

```bash
npm run dev
```

This starts:
- **Angular Client Dev Server**: `http://localhost:4200`
- **Firestore Emulator**: Port `8080`
- **Auth Emulator**: Port `9099`

---

## 4. User Email Extraction (Batch Export)

If you need to export all user emails for bulk mailing or campaign imports in Sender.net without paid cloud functions:

1. Edit `scripts/main.ts` and ensure `extractUserEmails()` is called.
2. Execute the extraction script:
   ```bash
   npm run scripts
   ```
3. A CSV and TXT file containing user emails will be generated in `scripts/mailing/output/`.
