# IEEE ITBA - Newsletter & Sender.net Integration Setup Guide

This document explains the architecture, secret configuration, local emulator workflow, and testing procedures for the IEEE ITBA newsletter integration.

---

## 1. Architecture Overview

```
[ Angular Client (Register/Profile) ] 
       │
       ▼ Updates document
[ Firestore: users/{email} ]
       │
       ▼ Firestore Trigger (onUserWritten)
[ Cloud Function: onUserWritten ]
       │
       ▼ REST API Call
[ Sender.net API ] ──► (Sync Subscribers)

─────────────────────────────────────────────────────────────

[ Angular Client (Write News) ]
       │
       ▼ Sets listed: true
[ Firestore: blog-entries/{ref} ]
       │
       ▼ Firestore Trigger (onBlogEntryWritten)
[ Cloud Function: sendNewsAnnouncement ]
       │
       ├─► Queries users where subscribedToNewsletter == true
       ├─► Renders responsive HTML template
       ├─► Sends emails via Sender.net REST API
       └─► Updates blog-entries/{ref} with newsletterSentAt timestamp (Duplicate Guard)
```

---

## 2. Configuring `SENDER_API_KEY`

To communicate with Sender.net, a valid API Key from [Sender.net Dashboard](https://app.sender.net/settings/tokens) is required.

### Production Environment (Firebase Cloud Functions Secret)

Run the following command in the Firebase CLI:

```bash
firebase functions:secrets:set SENDER_API_KEY
```

Enter your Sender.net API Key when prompted. Access is granted to functions automatically via Cloud Secret Manager.

### Local Development / Emulator Environment

Create a `.env.local` file inside the `functions/` directory:

```env
SENDER_API_KEY=your_sender_api_key_here
```

*Note: If `SENDER_API_KEY` is missing or empty, Cloud Functions will safely log a mock warning without interrupting client operations or failing user signups.*

---

## 3. Local Emulator Workflow

Start the complete application stack including emulators:

```bash
npm run dev
```

This command runs:
- **Angular Client Dev Server**: `http://localhost:4200`
- **Firestore Emulator**: Port `8080`
- **Auth Emulator**: Port `9099`
- **Cloud Functions Emulator**: Port `5001`
- **Emulator Suite UI**: `http://localhost:4000`

---

## 4. Automatic Email Announcement Features

1. **Publication Trigger**: When a news entry in `blog-entries/{reference}` has `listed: true`, `onBlogEntryWritten` fires.
2. **Duplicate Guard**: Once sent, the function sets `newsletterSentAt: timestamp` on the article document. Subsequent edits to the article will skip sending duplicate emails.
3. **HTML Template**: Includes article title, author, cover image, clean plain-text excerpt, CTA button to `https://ieeeitba.org.ar/noticias/{reference}`, and unsubscribe instructions.

---

## 5. Existing User Migration

To populate `subscribedToNewsletter: false` on pre-existing Firestore user documents:

1. Edit `scripts/main.ts` to uncomment `await migrateSubscribedToNewsletter();`.
2. Run the migration script:
   ```bash
   npm run scripts
   ```
