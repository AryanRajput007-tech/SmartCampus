# SmartCampus – Full Stack Placement Management & AI Assistant

SmartCampus is a production-style college placement management platform engineered for undergraduate students and campus recruitment administrators. It bridges traditional placement workflows with practical, explainable AI matching algorithms and career coaching.

---

## 1. Project Overview & Problem Statement

### The Problem
Traditional college placement management typically relies on disjointed spreadsheets, mass email circulars, and rigid forms. Students struggle to identify which job openings align with their actual technical skill sets, lack tailored feedback on missing prerequisites, and have limited access to interactive interview coaching. Meanwhile, placement officers are overwhelmed manually tracking student application stages, duplicate submissions, and recruitment metrics.

### The Solution
SmartCampus unifies the entire placement lifecycle into a cohesive, responsive web platform:
- **For Students**: Profile builder, real-time job search with multi-parameter filtering, duplicate-protected 1-click applications, an **Explainable AI Job Matcher** (TF-IDF & Cosine Similarity), and an **AI Placement Assistant** powered by Google Gemini.
- **For Placement Admins**: Full recruitment funnel analytics (Applied, Shortlisted, Interview, Selected, Rejected), job posting management, student directory search, and inline candidate status progression.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Axios, Modern Vanilla CSS Design Tokens |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose, JWT (jsonwebtoken), bcryptjs, CORS, Dotenv |
| **Database** | MongoDB with Mongoose Schemas & Compound Unique Indexes |
| **AI / ML Service** | Python 3.11+, FastAPI, Uvicorn, Scikit-learn (TF-IDF Vectorizer & Cosine Similarity), NumPy, Google Gemini API (`google-genai`) |
| **Testing** | Jest, Supertest, MongoDB Memory Server (`mongodb-memory-server`), Pytest, HTTPX |
| **DevOps / Tooling** | Docker, Docker Compose, Git, GitHub |

---

## 3. Architecture & Data Flow

```
                 React + TypeScript SPA (Port 5173)
                         |
                         | REST API / JSON (Bearer JWT)
                         v
               Node.js + Express + TypeScript (Port 5000)
                    /                          \
          TCP/IP   /                            \  HTTP / JSON
                  v                              v
           MongoDB (Port 27017)        Python FastAPI AI Service (Port 8000)
           (Schemas & Unique Indexes)             |
                                            AI / ML Features
                                                  |
                                      +-----------+-----------+
                                      |                       |
                               TF-IDF Job Matcher       Google Gemini API
```

### Security & Integrity Highlights
- **Zero Client-Side DB Exposure**: The React frontend never connects directly to MongoDB or external AI keys.
- **Node as API Gateway**: The Node backend acts as an authenticated orchestrator for AI matching and chat requests.
- **Graceful Fallbacks**: If the Gemini API or Python service is temporarily unreachable, the system gracefully falls back to deterministic rule-based algorithms without crashing.
- **Duplicate Prevention**: Enforced at the database engine level via compound unique index `{ studentId: 1, jobId: 1 }`.

---

## 4. Repository Structure

```
smartcampus/
│
├── frontend/                     # React + TypeScript + Vite Client
│   ├── src/
│   │   ├── components/           # Reusable UI (Navbar, Sidebar, Button, Input, Modal, JobCard, etc.)
│   │   ├── pages/                # Public, Student, and Admin page views
│   │   ├── layouts/              # MainLayout & DashboardLayout
│   │   ├── context/              # AuthContext (state & session lifecycle)
│   │   ├── services/             # Axios API services (auth, jobs, student, admin, AI)
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── index.css             # Vanilla CSS design system
│   │   ├── App.tsx               # Route hierarchy & ProtectedRoute guards
│   │   └── main.tsx              # React DOM entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                      # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/               # Database and environment configurations
│   │   ├── controllers/          # Business logic handlers (auth, student, job, admin, AI)
│   │   ├── middleware/           # JWT verification, role authorization, centralized error handling
│   │   ├── models/               # Mongoose schemas (User, StudentProfile, Job, Application)
│   │   ├── routes/               # Express route definitions
│   │   ├── services/             # AI service HTTP client with fallback logic
│   │   ├── scripts/              # Database seed script (admin, students, jobs, applications)
│   │   ├── tests/                # Jest + Supertest test suite with MongoDB Memory Server
│   │   ├── types/                # TypeScript backend types
│   │   ├── app.ts                # Express application assembly
│   │   └── server.ts             # HTTP server bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── Dockerfile
│
├── ai-service/                   # Python FastAPI AI Microservice
│   ├── app/
│   │   ├── models/               # Pydantic schemas (MatchRequest, MatchResponse, ChatRequest)
│   │   ├── routes/               # FastAPI endpoints (/ai/match, /ai/chat)
│   │   ├── services/             # TF-IDF Matcher & Gemini Assistant service
│   │   ├── utils/                # NLP text cleaners & tokenizer utilities
│   │   └── main.py               # FastAPI application entry point
│   ├── tests/                    # Pytest test suite (test_matcher.py, test_chat.py)
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                         # Comprehensive Engineering Documentation
│   ├── architecture.md           # Architectural patterns, data flows, and trade-offs
│   ├── api-documentation.md      # REST API contracts, status codes, and JSON schemas
│   └── interview-notes.md        # Technical interview explanations for B.Tech students
│
├── .gitignore                    # Git exclusions
├── .env.example                  # Root environment template
├── docker-compose.yml            # Multi-container orchestration
└── README.md                     # Master documentation
```

---

## 5. Database Schema Design

### 1. `User`
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, hashed via bcrypt, excluded by default via `select: false`)
- `role` (Enum: `STUDENT` | `ADMIN`, default: `STUDENT`)
- `timestamps` (`createdAt`, `updatedAt`)

### 2. `StudentProfile`
- `userId` (ObjectId referencing `User`, unique, indexed)
- `phone` (String)
- `college` (String)
- `degree` (String)
- `graduationYear` (Number)
- `skills` (Array of Strings, indexed for search)
- `projects` (Array of `{ title, description, technologies, link }`)
- `experience` (Array of `{ company, role, duration, description }`)
- `preferredRoles` (Array of Strings)
- `resumeUrl` (String)

### 3. `Job`
- `title` (String, required, text-indexed)
- `company` (String, required, text-indexed)
- `description` (String, required)
- `requiredSkills` (Array of Strings, required, indexed)
- `location` (String, required)
- `employmentType` (Enum: `Full-time` | `Internship` | `Part-time` | `Contract`)
- `salaryRange` (String)
- `postedBy` (ObjectId referencing `User`)
- `applicationDeadline` (Date)
- `timestamps` (`createdAt`, `updatedAt`)

### 4. `Application`
- `studentId` (ObjectId referencing `User`, required, indexed)
- `jobId` (ObjectId referencing `Job`, required, indexed)
- `status` (Enum: `Applied` | `Shortlisted` | `Interview` | `Selected` | `Rejected`, default: `Applied`)
- `appliedAt` (Date, default: Date.now)
- **Constraint**: Compound Unique Index: `{ studentId: 1, jobId: 1 }` (Prevents duplicate applications).

---

## 6. Demo Credentials

The database seed script initializes the following test accounts:

| Role | Email | Password | Profile Focus |
|---|---|---|---|
| **Admin** | `admin@smartcampus.edu` | `Admin@12345` | Placement Officer / Recruiter Console |
| **Student 1** | `rahul.sharma@smartcampus.edu` | `Student@12345` | Full Stack (React, Node.js, TS, MongoDB) |
| **Student 2** | `priya.patel@smartcampus.edu` | `Student@12345` | AI / ML (Python, Scikit-learn, FastAPI, SQL) |
| **Student 3** | `amit.verma@smartcampus.edu` | `Student@12345` | Cloud & QA (Docker, Jest, Supertest, Postman) |

*Note: The Login page includes 1-click auto-fill buttons for these accounts for instant evaluation.*

---

## 7. Installation & Local Development Setup

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **Python**: v3.10+ (tested on Python 3.11/3.13)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or Docker

---

### Step 1: Clone and Configure Environment Variables

```bash
# Clone the repository
git clone https://github.com/AryanRajput007-tech/SmartCampus.git
cd smartcampus

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp frontend/.env.example frontend/.env
```

If you wish to use Google Gemini for live conversational AI, add your API key in `ai-service/.env`:
```ini
GEMINI_API_KEY=AIzaSy...
```
*(If omitted, the AI assistant automatically uses its built-in placement advisory fallback engine!)*

---

### Step 2: Set Up Backend

```bash
cd backend
npm install

# Seed the database with sample admin, students, jobs, and applications
npm run seed

# Start backend in development mode (hot reload via ts-node-dev)
npm run dev
```
Backend runs at: `http://localhost:5000` (Health check: `http://localhost:5000/health`)

---

### Step 3: Set Up Python AI Service

Open a second terminal window:

```bash
cd ai-service

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server with Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
AI Service runs at: `http://localhost:8000` (Swagger Docs: `http://localhost:8000/docs`)

---

### Step 4: Set Up Frontend

Open a third terminal window:

```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 8. Running with Docker Compose

To start all services (MongoDB, Backend, AI Service, and Frontend) with a single command:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- AI Microservice: `http://localhost:8000`
- MongoDB: `localhost:27017`

---

## 9. Automated Testing Suites

SmartCampus includes comprehensive automated tests across both the Node.js backend and the Python AI service.

### Running Backend Tests (Jest + Supertest)
Backend tests execute against an automated in-memory MongoDB server (`mongodb-memory-server`), ensuring tests run cleanly in any environment without mutating local database data:

```bash
cd backend
npm test
```

Test coverage includes:
- Student and Admin user registration
- Validation of email syntax, password minimum length, and missing fields
- Duplicate email conflict handling (`409 Conflict`)
- Login with valid and invalid credentials
- Protected route access (`/api/auth/me`)
- Role-based authorization (`403 Forbidden` for students accessing admin endpoints)
- Admin job creation and retrieval with query filters
- Student job applications and duplicate application prevention (`409 Conflict`)
- Multi-applicant support and application status tracking

### Running AI Service Tests (Pytest)

```bash
cd ai-service
pytest -v
```

Test coverage includes:
- `/health` check status and metadata
- Exact match scenario (verifying score $\ge 80\%$ and empty missing skills list)
- Partial match scenario (validating skill categorization into matched vs missing)
- Zero overlap scenario (verifying low score and appropriate gap recommendation)
- Empty skills edge-case handling
- Assistant chat endpoint responses and fallback generation
- Request schema validation (empty strings rejected with `422 Unprocessable Entity`)

---

## 10. Future Enhancements

1. **Automated Resume PDF Parser**: Integrate `pdfplumber` into the Python microservice to automatically parse uploaded PDF resumes and extract skills directly into the student profile.
2. **WebSocket Real-Time Notifications**: Broadcast instant notifications to students when recruiters update their application status to `Interview` or `Selected`.
3. **Interview Slot Scheduling**: Allow administrators to configure interview calendar slots and students to reserve specific interview times directly from their dashboard.
