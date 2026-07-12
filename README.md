# Personal Address Book

Production-style MERN application with JWT auth, contact management, geocoding, nearby search, Google People sync, avatar upload, and a React dashboard.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React 19, Vite, TailwindCSS
- Auth: JWT, bcryptjs, Google Sign-In (Google Identity Services)
- Integrations: Geoapify Geocoding API, Google OAuth2, Google People API, OpenStreetMap + Leaflet (contact location map)

## Project Structure

```text
root
|- backend
`- frontend
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Copy the templates and fill in real values:

```bash
backend/.env.example -> backend/.env
frontend/.env.example -> frontend/.env
```

### 3. MongoDB setup

- Start a local MongoDB server, or use MongoDB Atlas.
- Set `MONGODB_URI` in `backend/.env`.
- Example local value:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/personal_address_book
```

## Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/personal_address_book
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000
GEOAPIFY_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
```

## Frontend Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

## Geoapify Setup

1. Create an account at Geoapify.
2. Generate an API key.
3. Put the key in `GEOAPIFY_API_KEY`.

The backend geocodes contact addresses on create and update.

## Google OAuth Setup

1. Create a Google Cloud project.
2. Enable OAuth consent screen.
3. Create OAuth client credentials.
4. Add `http://localhost:5000/api/google/callback` as an authorized redirect URI.
5. Fill `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in `backend/.env`.

## Google People API Setup

1. In the same Google Cloud project, enable Google People API.
2. Keep the OAuth credentials from the previous step.
3. Use the dashboard action to connect Google.
4. After authorization, use the sync action to import contacts.

## Google Sign-In (Login/Register) Setup

This is separate from the Google People sync above: it lets a user log in or register using their Google identity, using the same OAuth client as a Google Identity Services ("Sign in with Google") button.

1. In the same Google Cloud OAuth client (Web application type), add an **Authorized JavaScript origin** for the frontend URL, e.g. `http://localhost:5173` (and your production URL later). This is separate from the "Authorized redirect URIs" used by the People sync flow.
2. Set `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` to the same value as `GOOGLE_CLIENT_ID` in `backend/.env` (client IDs are not secret).
3. The backend verifies the Google ID token server-side with `google-auth-library`, using `GOOGLE_CLIENT_ID` as the expected audience — no client secret is needed for this flow.
4. If a Google account's email matches an existing local account, the accounts are linked (`googleId` is attached); otherwise a new user is created with no password.

## Run Commands

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Main API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`

### Contacts

- `GET /api/contacts`
- `GET /api/contacts/:id`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `PATCH /api/contacts/:id/favorite`
- `GET /api/contacts/nearby?lat=...&lng=...&radius=...`

### Other

- `GET /api/dashboard/stats`
- `GET /api/google/connect`
- `GET /api/google/callback`
- `POST /api/google/sync`
- `POST /api/upload/avatar`

## Notes

- Avatar files are stored locally in `backend/uploads/`.
- Google contact sync upserts contacts by `owner + googleId`.
- Nearby search uses MongoDB geospatial queries on a `2dsphere` index.
- The frontend attaches JWT automatically through a centralized Axios client.
- Contact location maps use OpenStreetMap tiles via Leaflet — no API key required.
