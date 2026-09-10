# SmartCampus – REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require an `Authorization` header formatted as:
```http
Authorization: Bearer <JWT_TOKEN>
```

Consistent Response Format:
```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

// Error
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## 1. Authentication APIs (`/api/auth`)

### Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@smartcampus.edu",
  "password": "Student@12345",
  "role": "STUDENT",
  "college": "Institute of Engineering & Technology",
  "degree": "B.Tech in Computer Science",
  "skills": ["React", "TypeScript", "Node.js"]
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "6732f91...",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@smartcampus.edu",
      "role": "STUDENT"
    }
  }
}
```
- **Error Codes**: `400 Bad Request`, `409 Conflict`

### Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "rahul.sharma@smartcampus.edu",
  "password": "Student@12345"
}
```
- **Response**: `200 OK`
- **Error Codes**: `400 Bad Request`, `401 Unauthorized`

### Get Current User Profile
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Access**: Authenticated (Student / Admin)
- **Response**: `200 OK`

---

## 2. Student APIs (`/api/students`)

### Get Student Profile
- **Method**: `GET`
- **URL**: `/api/students/profile`
- **Access**: Authenticated (`STUDENT` only)
- **Response**: `200 OK`

### Update Student Profile
- **Method**: `PUT`
- **URL**: `/api/students/profile`
- **Access**: Authenticated (`STUDENT` only)
- **Request Body**:
```json
{
  "phone": "+91 98765 43210",
  "college": "National Institute of Technology",
  "degree": "B.Tech in Computer Science",
  "graduationYear": 2026,
  "skills": ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
  "projects": [
    {
      "title": "SmartCampus Portal",
      "description": "Full-stack recruitment and AI matching platform.",
      "technologies": ["React", "TypeScript", "FastAPI"],
      "link": "https://github.com/example/smartcampus"
    }
  ],
  "experience": [
    {
      "company": "Tech Labs",
      "role": "SDE Intern",
      "duration": "3 Months",
      "description": "Developed REST APIs with Node.js and Express."
    }
  ],
  "resumeUrl": "https://drive.google.com/my-resume.pdf"
}
```
- **Response**: `200 OK`

---

## 3. Job Openings APIs (`/api/jobs`)

### Browse Jobs (with Search & Filters)
- **Method**: `GET`
- **URL**: `/api/jobs?search=react&location=remote&employmentType=Full-time`
- **Access**: Public
- **Query Parameters**:
  - `search` (string): Searches title, company, description, and requiredSkills
  - `location` (string): Case-insensitive location filter
  - `employmentType` (string): Full-time, Internship, Part-time, Contract
  - `skills` (string): Comma-separated skill keywords
  - `page` (number): Default `1`
  - `limit` (number): Default `10`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Jobs retrieved successfully.",
  "count": 5,
  "page": 1,
  "totalPages": 1,
  "data": [ ... ]
}
```

### Get Job Details by ID
- **Method**: `GET`
- **URL**: `/api/jobs/:id`
- **Access**: Public
- **Response**: `200 OK`
- **Error Codes**: `400 Invalid ID`, `404 Job Not Found`

### Apply for Job
- **Method**: `POST`
- **URL**: `/api/jobs/:id/apply`
- **Access**: Authenticated (`STUDENT` only)
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Application submitted successfully!",
  "data": {
    "_id": "6732f91...",
    "studentId": "...",
    "jobId": "...",
    "status": "Applied",
    "appliedAt": "2026-09-10T15:30:00.000Z"
  }
}
```
- **Error Codes**: `400 Deadline Passed`, `404 Job Not Found`, `409 Already Applied`

---

## 4. Student Applications APIs (`/api/applications`)

### Get My Applications
- **Method**: `GET`
- **URL**: `/api/applications/my`
- **Access**: Authenticated (`STUDENT` only)
- **Response**: `200 OK`

### Get Application by ID
- **Method**: `GET`
- **URL**: `/api/applications/:id`
- **Access**: Authenticated (Owner student or Admin)
- **Response**: `200 OK`
- **Error Codes**: `403 Forbidden`, `404 Not Found`

---

## 5. Admin APIs (`/api/admin`)

### Get Placement Dashboard Statistics
- **Method**: `GET`
- **URL**: `/api/admin/dashboard/stats`
- **Access**: Authenticated (`ADMIN` only)
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Admin dashboard statistics retrieved.",
  "data": {
    "totalStudents": 150,
    "totalJobs": 12,
    "totalApplications": 320,
    "selectedCount": 28,
    "statusOverview": {
      "Applied": 140,
      "Shortlisted": 75,
      "Interview": 45,
      "Selected": 28,
      "Rejected": 32
    },
    "recentApplications": [ ... ]
  }
}
```

### Post New Job
- **Method**: `POST`
- **URL**: `/api/admin/jobs`
- **Access**: Authenticated (`ADMIN` only)
- **Request Body**:
```json
{
  "title": "Full Stack Developer",
  "company": "InnoTech Solutions",
  "description": "Building next-gen SaaS portals using React and Node.",
  "requiredSkills": ["React", "TypeScript", "Node.js", "MongoDB"],
  "location": "Bengaluru / Remote",
  "employmentType": "Full-time",
  "salaryRange": "₹8,00,000 - ₹12,00,000 / year",
  "applicationDeadline": "2026-10-31"
}
```
- **Response**: `201 Created`

### Update Job
- **Method**: `PUT`
- **URL**: `/api/admin/jobs/:id`
- **Access**: Authenticated (`ADMIN` only)
- **Response**: `200 OK`

### Delete Job
- **Method**: `DELETE`
- **URL**: `/api/admin/jobs/:id`
- **Access**: Authenticated (`ADMIN` only)
- **Response**: `200 OK`

### Get Registered Students Directory
- **Method**: `GET`
- **URL**: `/api/admin/students`
- **Access**: Authenticated (`ADMIN` only)
- **Response**: `200 OK`

### Get Review Applications (with filters)
- **Method**: `GET`
- **URL**: `/api/admin/applications?jobId=...&status=Applied`
- **Access**: Authenticated (`ADMIN` only)
- **Response**: `200 OK`

### Update Application Status
- **Method**: `PATCH`
- **URL**: `/api/admin/applications/:id/status`
- **Access**: Authenticated (`ADMIN` only)
- **Request Body**:
```json
{
  "status": "Interview"
}
```
- **Valid Status Values**: `Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`
- **Response**: `200 OK`

---

## 6. AI Endpoints (`/api/ai`)

### Job Compatibility Matcher
- **Method**: `POST`
- **URL**: `/api/ai/match`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "jobId": "6732f91...",
  "skills": ["React", "TypeScript", "Node.js", "MongoDB"],
  "requiredSkills": ["React", "TypeScript", "Node.js", "MongoDB", "Docker"],
  "jobDescription": "Full stack engineer proficient with React and Docker."
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Job matching analysis completed.",
  "data": {
    "match_score": 85,
    "matched_skills": ["React", "TypeScript", "Node.js", "MongoDB"],
    "missing_skills": ["Docker"],
    "recommendation": "Solid competitive match (85%). You meet 4 of 5 requirements. To maximize your interview chances, focus on brushing up on: Docker.",
    "semantic_similarity": 0.78,
    "skill_overlap_ratio": 0.80
  }
}
```

### AI Placement Assistant
- **Method**: `POST`
- **URL**: `/api/ai/chat`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "message": "How should I structure my resume for campus placements?"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Assistant response generated.",
  "data": {
    "response": "### Resume Best Practices\n1. Single-Page Rule: For undergrad placements, keep your resume to 1 page...",
    "source": "gemini"
  }
}
```
