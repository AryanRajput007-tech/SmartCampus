# SmartCampus – Architecture Design & System Overview

SmartCampus is engineered as a clean, modular 3-tier full-stack application with an asynchronous micro-service design pattern for AI workloads.

---

## 1. High-Level Architecture Diagram

```
                             [ User's Browser ]
                                     |
                                     | HTTPS / JSON (REST APIs)
                                     v
                        +--------------------------+
                        |  React + TypeScript SPA  |
                        |      (Vite Dev/Prod)     |
                        +--------------------------+
                                     |
                                     | REST API + Bearer JWT
                                     v
                        +--------------------------+
                        |  Node.js + Express API   |
                        |       (TypeScript)       |
                        +--------------------------+
                               /            \
                Mongoose / TCP/IP          HTTP / JSON
                             /                \
                            v                  v
                 +-------------------+  +---------------------+
                 |   MongoDB Database|  |  Python FastAPI AI  |
                 | (Collections &    |  |  (TF-IDF, Cosine,   |
                 |  Compound Indexes)|  |   Gemini Assistant) |
                 +-------------------+  +---------------------+
                                                   |
                                                   | gRPC / HTTPS
                                                   v
                                        +---------------------+
                                        |  Google Gemini API  |
                                        +---------------------+
```

---

## 2. Core Architectural Principles

### Separation of Concerns & Security Boundaries
1. **Zero Client-Side Database Access**: The React frontend never connects to MongoDB directly. All persistence, query sanitization, and data mutations are mediated through the Express backend.
2. **AI Gateway Pattern**: The React client communicates only with the Node.js backend. When AI analysis is needed (e.g. `/api/ai/match` or `/api/ai/chat`), the Node backend acts as an orchestration gateway to the Python FastAPI microservice.
3. **Secret Isolation**: Sensitive keys—specifically `JWT_SECRET`, database connection credentials, and the `GEMINI_API_KEY`—reside strictly on the server layer. Even if the client bundle is inspected, no secrets are leaked.
4. **Resilient Fallback Design**: If the Python AI service or Google Gemini API becomes unavailable or network latency spikes, the Node backend and FastAPI services automatically degrade to deterministic heuristic rules (e.g., set-theoretic skill intersection and structured placement advice) without crashing the user session.

---

## 3. Component Breakdown

### Frontend Tier (`frontend/`)
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite for rapid Hot Module Replacement (HMR) and optimized rollup production bundles.
- **Routing**: React Router v6 using declarative layout routes (`MainLayout` for public landing/auth and `DashboardLayout` for student and admin workspaces).
- **State & Authentication**: React Context (`AuthContext`) paired with Axios interceptors that automatically attach Bearer tokens from `localStorage` and handle 401 session expirations.
- **Design System**: Vanilla CSS tokens (CSS Variables) implementing responsive cards, status badges, modal overlays, accessible forms, and tabular layouts without heavy third-party CSS dependencies.

### Backend Tier (`backend/`)
- **Runtime**: Node.js with Express and TypeScript.
- **Authentication**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, alongside bcrypt salted hashing (10 rounds) for passwords.
- **Database Driver**: Mongoose with strongly-typed schemas, pre-save lifecycle hooks, and compound unique indexing (`{ studentId: 1, jobId: 1 }`) to enforce duplicate prevention.
- **Layered Pattern**:
  - `controllers/`: HTTP request handling, validation, and JSON response assembly.
  - `middleware/`: Authentication checks, role-based authorization (`requireRole`), and centralized error management.
  - `models/`: Mongoose documents and business domain schemas.
  - `services/`: External integrations such as the `AiService` client with timeout safeguards.
  - `routes/`: RESTful route mappings.

### AI Service Tier (`ai-service/`)
- **Runtime**: Python 3.11+ with FastAPI and Uvicorn.
- **Vectorization**: Scikit-learn's `TfidfVectorizer` extracting unigram and bigram term frequencies across student profiles and job postings.
- **Similarity Computation**: Cosine similarity measuring angular proximity in high-dimensional vector space.
- **Composite Algorithm**:
  $$\text{Score} = \min(100, \max(0, \text{round}((0.70 \times \text{SkillOverlapRatio} + 0.30 \times \text{CosineSimilarity}) \times 100)))$$
  *(With a high baseline guarantee $\ge 85\%$ when $100\%$ of mandatory technical skills are matched).*
- **Generative AI**: Google Gemini API integration generating contextual interview suggestions and resume tailoring advice.

---

## 4. Data Flow Walkthroughs

### Flow A: Student Applies for an Opportunity
1. Student clicks **"Apply Now"** on `/jobs/:id`.
2. React frontend issues `POST /api/jobs/:id/apply` with `Authorization: Bearer <token>`.
3. Express `authenticate` middleware decodes the JWT and validates the signature.
4. Express `authorize('STUDENT')` middleware verifies the student role.
5. `jobController.applyForJob` queries MongoDB for the job and verifies the application deadline has not elapsed.
6. The controller checks for existing submissions by querying `{ studentId, jobId }`.
7. If already applied, it responds with `409 Conflict`.
8. If novel, an `Application` document is created with status `Applied`.
9. Express responds with `201 Created` and populated job/applicant metadata.
10. React UI updates dynamically to display `"✓ Already Applied"`.

### Flow B: AI Job Matching
1. Student requests a match on `/ai-matcher?jobId=...`.
2. React sends `POST /api/ai/match` to the Node backend.
3. Node backend fetches the student's verified skills and project summaries from MongoDB.
4. Node backend invokes Python FastAPI at `POST http://localhost:8000/ai/match`.
5. FastAPI executes:
   - Direct skill normalization and case-insensitive set intersection.
   - TF-IDF vector fitting on the concatenated student text vs job text.
   - Cosine similarity computation.
   - Weighted score calculation (0–100) and recommendation string generation.
6. FastAPI returns JSON to Node backend.
7. Node backend forwards the result to React.
8. React renders the circular gauge, matched skills (green pills), missing skills (red pills), and recommendation narrative.
