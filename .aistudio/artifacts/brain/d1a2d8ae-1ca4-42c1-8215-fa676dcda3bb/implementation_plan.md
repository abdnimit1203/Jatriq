# Implementation Plan: Firebase Firestore Database Integration

Integrate Google Firebase Firestore into Jatriq Tour Operator to persist all tour packages, site configurations, and customer booking inquiries in real-time, connecting seamlessly to your existing Firebase Project.

---

## 1. What You Need to Provide

To connect your existing Firebase project, you only need to provide:
- **Firebase Project ID**: The unique ID of your project from the [Firebase Console](https://console.firebase.google.com/) (found in Project Settings > General, e.g. `my-jatriq-project` or `tour-agency-89abc`).
*Note: You do NOT need to manually copy API keys, download config files, or edit database code. AI Studio will automatically configure and link the project credentials once you provide the Project ID.*

---

## 2. Architecture & Data Collections

The application will store data in three primary Firestore collections:

```
Firestore Database
├── packages/              # All active tour packages
│   ├── {packageId}        # Title, pricing, itinerary, inclusions, 3 gallery images, SEO slug
├── site_config/           # Agency settings document
│   └── main_config        # Agency name, phone, WhatsApp number, announcement banner, email
└── bookings/              # Customer tour reservations & booking inquiries
    └── {bookingId}        # Customer name, phone, tour slug, travel date, guests, status
```

---

## 3. Implementation Steps

### Step 1: Firebase Provisioning via AI Studio Tooling
- Prompt the user to enter their **Firebase Project ID**.
- Trigger the interactive Firebase Setup flow using `show_aistudio_ui` / `set_up_firebase` with the specified `project_id` and `platform: "web"`.
- Verify terms acceptance and provision the database automatically.
- AI Studio generates `firebase-applet-config.json` containing the environment credentials.

### Step 2: Firebase Client SDK Setup
- Install the official `firebase` npm package (`npm i firebase`).
- Create `src/lib/firebase.ts` to initialize Firebase App, Firestore instance, and Auth helpers with safety guards for offline fallback.

### Step 3: Security Rules (`firestore.rules`)
- Write production-grade security rules:
  - **`packages` collection**: Anyone can read (`allow read: if true`). Only authorized admin can create, update, or delete packages.
  - **`site_config` collection**: Public read access for website visitors; write access restricted to admin.
  - **`bookings` collection**: Public customers can submit booking forms (`allow create: if true`); read and manage access restricted to admin.
- Deploy rules using the automated deployment tool.

### Step 4: Real-Time Data Synchronization (`DataContext.tsx`)
- Enhance `DataContext.tsx` to subscribe to Firestore via `onSnapshot`:
  - Automatically loads cloud packages from Firestore on startup.
  - When an admin adds, edits, or deletes a tour package, changes sync instantly across all visitor browsers.
  - Keeps local caching active so the app remains fast and responsive even with weak mountain connectivity.
  - One-click "Seed Firestore" button in Admin Dashboard to migrate default sample packages into the cloud database with 1 click.

### Step 5: Customer Booking Submission (`BookingPage.tsx`)
- Connect the booking form directly to Firestore's `bookings` collection.
- When a customer submits a booking:
  - Automatically generates a unique booking reference ID.
  - Saves customer name, WhatsApp number, email, chosen tour package, date, and group size to Firestore.
  - Displays instant confirmation and opens the direct WhatsApp message with pre-filled details.
- Add a "Bookings & Inquiries" viewer tab in `AdminDashboardPage.tsx` so the tour operator can review and manage customer reservations in real-time.

---

## 4. Verification & Testing

1. **Connection Test**: Validate Firebase initialization against your Project ID.
2. **Package Cloud Sync**: Add a new tour package in the Admin panel and verify it immediately appears on the public website and in Firestore.
3. **Booking Flow**: Submit a sample booking on `/booking` and verify the document is saved into Firestore and viewable in the Admin panel.
4. **Offline Resilience**: Verify the website still loads smoothly with fallback data if network access is interrupted.
