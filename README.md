# Hush AI Ambassador Program Dashboard 🚀

A full-stack platform for managing and growing the Hush AI Campus Ambassador program with smart onboarding, referral tracking, and performance analytics.

## Tech Stack
- **Frontend**: React (Vite) + CSS Modules + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: Google OAuth via Firebase Admin SDK

## Features
1. **Smart One-Tap Onboarding**: Google Login integration with a <60s onboarding flow.
2. **Ambassador Dashboard**: Real-time stats, engagement charts, and activity summaries.
3. **Referral System**: Unique link generation and automated tracking of clicks/signups.
4. **7-Day Activation**: Gamified task list to ensure new users stay engaged.
5. **Leaderboard**: Competitive rankings based on referral performance.
6. **Analytics**: Tracking user flow and drop-off points (stored in MongoDB).

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)
- Firebase Project

### 2. Backend Config
1. Go to the root directory and create/update the `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   FIREBASE_SERVICE_ACCOUNT={"your":"service-account-json"}
   ```
2. Run `npm install` in the root.

### 3. Frontend Config
1. Navigate to `/frontend` and update `src/firebase.js` with your Firebase Client Config.
2. Run `npm install` in the `/frontend` folder.

### 4. Running the App
- **Start Backend**: `npm start` (from root)
- **Start Frontend**: `npm run dev` (from `/frontend`)

## MongoDB Schema
- **Users**: Profile info, onboarding state, activation tasks, referral codes.
- **Referrals**: Tracker for clicks, signups, and conversion logs.
- **Analytics**: Event logs for user flow (login -> onboarding -> dashboard).

---
Built with ❤️ by Antigravity
