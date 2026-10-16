# Mentora - Online Learning Platform

Mentora is a full-stack online learning platform built with a React/Vite frontend and an Express/MongoDB backend. Users can browse and search courses, create accounts, enroll in courses, publish courses as instructors, and leave reviews after enrollment.

## Features

- Course catalog with:
  - Search by title and description
  - Category filtering
  - Maximum price filtering
  - Minimum rating filtering
  - Sorting by newest, price, or rating
  - Pagination
- User registration and sign-in
- Role-based access for `student`, `instructor`, and `admin`
- HTTP-only JWT authentication cookie
- Course creation for instructors and admins
- Chapter management for course instructors
- Student course enrollment
- Enrolled-student course reviews and ratings
- MongoDB persistence with Mongoose
- Responsive React interface built with Vite

## Tech Stack

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- JWT
- bcrypt
- Cookie Parser
- CORS
- dotenv

### Frontend

- React 19
- Vite
- Axios
- React Router
- Oxlint

## Project Structure

```text
.
├── Config/
│   └── Connect.DB.js          # MongoDB connection
├── Controllers/               # Request handlers
├── Middlewares/
│   └── authMiddlewares.js     # JWT authentication and role checks
├── Models/                    # Mongoose models
├── Routes/                    # API route definitions
├── frontend/                  # React/Vite application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── api.js             # Axios API client
│       ├── App.jsx
│       └── main.jsx
├── server.js                  # Express server entry point
├── package.json
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone <your-repository-url>
cd Udemy-Backend
npm install
cd frontend
npm install
cd ..
```

## Environment Variables

Create a `.env` file in the project root. Do not commit this file or expose its values publicly.

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/mentora
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

The backend uses these variables:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port used by the Express server | `5000` |
| `MONGO_URL` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret used to sign JWTs | Required |
| `FRONTEND_URL` | Allowed frontend origin for CORS | Deployed frontend URL |
| `NODE_ENV` | Controls production cookie security | Optional |

For local frontend development, you can optionally create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

When `VITE_API_URL` is not set, the frontend currently uses the deployed API URL configured in `frontend/src/api.js`.

## Running Locally

Start the backend from the repository root:

```bash
npm run dev
```

The API will be available at `http://localhost:5000` unless `PORT` is changed.

In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Vite will print the local frontend URL, normally `http://localhost:5173`.

## Production Commands

Build the frontend:

```bash
cd frontend
npm run build
```

Preview the production frontend build locally:

```bash
npm run preview
```

Start the backend in production mode:

```bash
npm start
```

Run the frontend linter:

```bash
cd frontend
npm run lint
```

## API Reference

The backend mounts the course router at `/api` and the enrollment router at `/api/enroll`.

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/signup` | Public | Create a user account and set the auth cookie |
| `POST` | `/api/signin` | Public | Sign in and set the auth cookie |

Example signup body:

```json
{
  "name": "Aisha Khan",
  "email": "aisha@example.com",
  "password": "strong-password",
  "role": "student"
}
```

Supported roles are `student`, `instructor`, and `admin`. New users default to `student` when no role is provided.

### Courses

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/courses` | Public | List courses with filters, sorting, and pagination |
| `GET` | `/api/courses/:courseID` | Public | Get one course with its chapters and reviews |
| `POST` | `/api/createCourse` | Instructor/Admin | Create one or more courses |
| `POST` | `/api/courses/:courseID/chapters` | Instructor/Admin | Add a chapter to an owned course |
| `DELETE` | `/api/courses/:courseID/chapters/:chapterID` | Instructor/Admin | Delete a chapter from an owned course |
| `POST` | `/api/courses/:courseID/reviews` | Student | Review a course after enrollment |

Supported course-list query parameters:

```text
category   Filter by category
maxPrice   Return courses at or below this price
minRating  Return courses at or above this rating
search     Search course title and description
sort       Mongoose sort fields, for example -createdAt or price
fields     Comma-separated fields to select
page       Page number, default 1
limit      Items per page, default 10
```

Example:

```text
GET /api/courses?category=Development&minRating=4&sort=-createdAt&page=1&limit=10
```

Example course body:

```json
{
  "title": "Modern JavaScript",
  "description": "Learn JavaScript from fundamentals to advanced concepts.",
  "price": 49,
  "category": "Development"
}
```

### Enrollment

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/enroll/:courseID` | Student | Enroll the authenticated student in a course |

A student cannot enroll in the same course more than once.

### Authentication and Cookies

Authentication uses a JWT stored in an HTTP-only cookie named `token`. Protected requests must include cookies. The frontend Axios client is configured with `withCredentials: true`, and the backend CORS configuration allows credentials.

In production, configure `FRONTEND_URL` to the exact deployed frontend origin and use HTTPS so secure cookies work correctly.

## Data Models

- **User:** name, email, hashed password, role, and optional profile information.
- **Course:** title, description, price, category, instructor, chapters, reviews, and average rating.
- **Enrollment:** user, course, and progress percentage. A user/course pair is unique.

## Current Deployments

The frontend API client has a deployed backend fallback:

```text
https://mini-udemy-nxp3.onrender.com
```

The backend CORS configuration has a deployed frontend fallback:

```text
https://mini-udemy-ten.vercel.app
```

For a different deployment, set `VITE_API_URL` in the frontend environment and `FRONTEND_URL` in the backend environment instead of relying on these fallbacks.

## Notes

- There is currently no automated test suite configured. The root `npm test` command is still the default placeholder.
- Keep `.env` files, JWT secrets, and database credentials private.
- MongoDB must be reachable before the backend can start successfully.
