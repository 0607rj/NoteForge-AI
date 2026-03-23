# ExamNotesAI

ExamNotesAI is a full-stack AI-powered study assistant that helps students generate exam-focused notes, summarize YouTube learning content, convert voice lectures into structured notes, and build formula sheets.

The project is organized as a monorepo with:
- `client` (React + Vite frontend)
- `server` (Node.js + Express backend)

## Features

- Google sign-in (Firebase on frontend + JWT cookie auth on backend)
- AI note generation by topic, class level, and exam type
- Revision mode with optional diagram/chart flags in generated notes
- Notes history and single-note viewing
- YouTube summarizer workflow
- Voice-to-notes workflow (audio upload endpoint)
- Formula sheet generator
- PDF export for generated notes
- Stripe checkout route for credit purchase flow

## Deployed Links

- Frontend (Live App): https://notesforge-ai.netlify.app/
- Backend (API Base): https://noteforge-ai.onrender.com

## Tech Stack

Frontend:
- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Recharts
- Mermaid
- Firebase Auth

Backend:
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT + cookie-based auth
- Stripe
- Multer (file uploads)
- PDFKit

AI Integration:
- Gemini API (via backend service)

## Project Structure

```text
1.ExamNotesAI/
  client/   # React app
  server/   # Express API
  package.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Firebase project (for Google auth)
- Gemini API key
- Stripe keys (for payment flow)

## Local Setup

### 1) Install dependencies

Install dependencies for each app:

```bash
cd server
npm install

cd ../client
npm install
```

Optional root dependencies (if needed by your workflow):

```bash
cd ..
npm install
```

### 2) Configure environment variables

Security note:
- Never commit `.env` files or real API keys/secrets to GitHub.
- Keep all values below as placeholders locally and set real values only in your deployment platform secrets.

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Create a `.env` file in `client/`:

```env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### 3) Run the apps

Start backend:

```bash
cd server
npm run dev
```

Start frontend in a second terminal:

```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

## Available Scripts

Client (`client/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

Server (`server/package.json`):
- `npm run dev` - start server with nodemon
- `npm start` - start server with node

## API Overview

Base URL: `http://localhost:5000`

Auth:
- `POST /api/auth/google`
- `GET /api/auth/logout`

User:
- `GET /api/user/currentuser`

Notes:
- `POST /api/notes/generate-notes`
- `GET /api/notes/getnotes`
- `GET /api/notes/:id`

Tools:
- `POST /api/tools/youtube-summarize`
- `POST /api/tools/voice-transcribe` (multipart file field: `audio`)
- `POST /api/tools/formula-sheet`

PDF:
- `POST /api/pdf/generate-pdf`

Credits:
- `POST /api/credits/order`

## Important Notes

- Auth uses HTTP-only JWT cookies. Ensure `CLIENT_URL` and frontend origin are correct for CORS.
- In production, cookie settings switch to `SameSite=None` and `secure=true`.
- YouTube and voice features are currently template-driven in prompts and can be extended with real transcript/speech APIs.

## Troubleshooting

- If requests fail with CORS errors:
  - Verify `CLIENT_URL` in `server/.env`.
  - Make sure frontend uses the same backend URL as `VITE_SERVER_URL`.
- If login appears successful but user is not persisted:
  - Confirm browser accepts cookies.
  - Check that frontend requests use `withCredentials: true`.
- If DB connection fails:
  - Validate `MONGODB_URL` and IP/network access in MongoDB provider.

## Future Improvements

- Add webhook route wiring for Stripe event processing
- Mount credits routes in `server/index.js`
- Add real YouTube transcript extraction pipeline
- Add real speech-to-text provider integration
- Add tests for controllers and routes
- Add Docker setup and CI pipeline

## License

No license file is currently defined in the repository.
Add a `LICENSE` file if you plan to distribute this project publicly.
