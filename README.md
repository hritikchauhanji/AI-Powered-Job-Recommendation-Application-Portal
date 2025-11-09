# AI-Powered Job Recommendation & Application Portal

> A modern full-stack web application leveraging Machine Learning to provide intelligent job recommendations. Built with React, Node.js, MongoDB, and Python ML API.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Folder Structure](#folder-structure)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)
- [AI Model Workflow](#ai-model-workflow)
- [Testing Strategy](#testing-strategy)
- [Deployment Guide](#deployment-guide)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## Project Overview

This full-stack application connects job seekers with relevant opportunities using AI-powered recommendations. The platform supports three user roles (Candidates, Recruiters, Admins) with dedicated dashboards, secure JWT authentication with refresh tokens, real-time notifications, and comprehensive analytics.

**Key Highlights:**
- AI-driven job matching based on skills and experience
- Real-time application tracking
- Secure authentication with automatic token refresh
- Role-based access control
- Admin analytics dashboard
- Cloud-based file storage (Cloudinary)

---

## Features

### For Candidates
- User registration with profile image upload
- Secure login with JWT authentication
- Complete profile management (skills, experience, education)
- Resume upload (PDF)
- AI-powered job recommendations
- Advanced job search with filters
- Apply for jobs with cover letters
- Track application status (pending, shortlisted, accepted, rejected)

### For Recruiters
- Post new job listings
- Edit and manage job postings
- View candidate applications
- Recruiter dashboard with statistics
- Update application status

### For Admins
- System-wide analytics dashboard
- User management (view all users, change roles, delete users)
- Job approval/rejection workflow
- View pending jobs
- System oversight and moderation

### Security Features
- JWT-based authentication
- HTTP-only refresh tokens
- Automatic token refresh (no repeated logins)
- Password reset via email OTP
- Bcrypt password hashing
- Protected routes with role-based permissions

---

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for auth
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud file storage
- **Nodemailer** - Email service
- **Multer** - File upload middleware

### AI/ML
- **Python** - ML backend language
- **Flask/FastAPI** - Python web framework
- **scikit-learn** - ML library (TF-IDF, Cosine Similarity)
- **NLTK/spaCy** - Natural Language Processing
- **pandas** - Data manipulation

### DevOps
- **Docker** - Containerization (optional)
- **GitHub Actions** - CI/CD pipeline
- **Vercel/Netlify** - Frontend hosting
- **Render/Railway** - Backend hosting

---

## Architecture

```
┌─────────────────┐                 ┌──────────────────┐
│                 │   REST API      │                  │
│   Frontend      │ ◄──────────────►│   Backend        │
│   (React +      │   WebSocket     │   (Node.js +     │
│   Redux)        │                 │   Express)       │
│                 │                 │                  │
└─────────────────┘                 └──────────────────┘
        │                                     │
        │                                     │
        │                                     ▼
        │                            ┌──────────────────┐
        │                            │                  │
        │                            │   MongoDB        │
        │                            │   Database       │
        │                            │                  │
        │                            └──────────────────┘
        │
        │   REST API
        │   (Job Recommendations)
        ▼
┌─────────────────┐
│                 │
│   ML API        │
│   (Flask/       │
│   FastAPI)      │
│                 │
└─────────────────┘
```

---

## Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['condidate', 'recruiter', 'admin']),
  skills: [String],
  experience: Number,
  location: String,
  education: String,
  resume: { url: String, public_id: String },
  profileImage: { url: String, public_id: String },
  refreshToken: String,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Jobs
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  skillsRequired: [String],
  location: String,
  salary: { min: Number, max: Number },
  jobType: String (enum: ['Full-time', 'Part-time', 'Contract', 'Internship']),
  experienceRequired: Number,
  companyName: String,
  recruiterId: ObjectId (ref: 'User'),
  status: String (enum: ['active', 'pending', 'closed']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Applications
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  jobId: ObjectId (ref: 'Job'),
  status: String (enum: ['pending', 'shortlisted', 'accepted', 'rejected']),
  coverLetter: String,
  appliedOn: Date,
  reviewedOn: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ER Diagram
```
┌──────────┐           ┌──────────────┐           ┌─────────┐
│   User   │ 1       * │ Application  │ *       1 │   Job   │
│          ├───────────┤              ├───────────┤         │
│  _id     │           │  userId      │           │  _id    │
│  name    │           │  jobId       │           │  title  │
│  email   │           │  status      │           │ recruiter│
│  role    │           │  coverLetter │           │         │
└──────────┘           └──────────────┘           └─────────┘
```

---

## Folder Structure

```
project-root/
│
├── backend/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   ├── admin.controller.js
│   │   └── recommendation.controller.js
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   └── application.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── admin.routes.js
│   │   └── recommendation.routes.js
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── error.middleware.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── validators/          # Input validation
│   ├── database/            # Database seeds
│   │   ├── seed/
│   │   │   ├── users.seed.js
│   │   │   ├── jobs.seed.js
│   │   │   └── applications.seed.js
│   │   ├── index.js
│   │   └── README.md
│   ├── constants.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios config with interceptors
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── jobsSlice.js
│   │   │   │   ├── applicationsSlice.js
│   │   │   │   ├── userSlice.js
│   │   │   │   └── adminSlice.js
│   │   │   ├── hooks.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── ml_api/
│   ├── app.py                  # Flask/FastAPI app
│   ├── model.py                # ML model logic
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE_DIAGRAM.png
│   ├── ER_DIAGRAM.png
│   ├── JobPortal.postman_collection.json
│   └── swagger.yaml
│
├── .gitignore
├── README.md
└── docker-compose.yml (optional)
```

---

## API Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint              | Description                | Auth Required |
|--------|-----------------------|----------------------------|---------------|
| POST   | `/register`           | Register new user          | No            |
| POST   | `/login`              | Login user                 | No            |
| POST   | `/logout`             | Logout user                | Yes           |
| POST   | `/refresh-token`      | Refresh access token       | No (Cookie)   |
| POST   | `/forgot-password`    | Request password reset     | No            |
| POST   | `/reset-password`     | Reset password with OTP    | No            |

### User Routes (`/api/users`)

| Method | Endpoint              | Description                | Auth Required | Role          |
|--------|-----------------------|----------------------------|---------------|---------------|
| GET    | `/profile`            | Get user profile           | Yes           | All           |
| PUT    | `/profile`            | Update profile             | Yes           | Candidate     |
| POST   | `/profile-image`      | Upload profile image       | Yes           | All           |
| POST   | `/resume`             | Upload resume              | Yes           | Candidate     |
| POST   | `/change-password`    | Change password            | Yes           | All           |

### Job Routes (`/api/jobs`)

| Method | Endpoint              | Description                | Auth Required | Role          |
|--------|-----------------------|----------------------------|---------------|---------------|
| GET    | `/`                   | Get all jobs (with filters)| No            | Public        |
| GET    | `/:jobId`             | Get job by ID              | No            | Public        |
| POST   | `/`                   | Create new job             | Yes           | Recruiter     |
| PUT    | `/:jobId`             | Update job                 | Yes           | Recruiter     |
| DELETE | `/:jobId`             | Delete job                 | Yes           | Recruiter     |
| GET    | `/recruiter/my-jobs`  | Get recruiter's jobs       | Yes           | Recruiter     |

### Application Routes (`/api/applications`)

| Method | Endpoint              | Description                | Auth Required | Role          |
|--------|-----------------------|----------------------------|---------------|---------------|
| POST   | `/apply`              | Apply for job              | Yes           | Candidate     |
| GET    | `/my-applications`    | Get user's applications    | Yes           | Candidate     |
| GET    | `/job/:jobId`         | Get job applications       | Yes           | Recruiter     |
| PUT    | `/:applicationId/status` | Update application status | Yes        | Recruiter     |

### Recommendation Routes (`/api/recommendations`)

| Method | Endpoint              | Description                | Auth Required | Role          |
|--------|-----------------------|----------------------------|---------------|---------------|
| GET    | `/`                   | Get AI job recommendations | Yes           | Candidate     |

### Admin Routes (`/api/admin`)

| Method | Endpoint              | Description                | Auth Required | Role          |
|--------|-----------------------|----------------------------|---------------|---------------|
| GET    | `/overview`           | Get dashboard analytics    | Yes           | Admin         |
| GET    | `/users`              | Get all users              | Yes           | Admin         |
| DELETE | `/users/:userId`      | Delete user                | Yes           | Admin         |
| PUT    | `/users/:userId/role` | Change user role           | Yes           | Admin         |
| GET    | `/pending-jobs`       | Get pending jobs           | Yes           | Admin         |
| PUT    | `/jobs/:jobId/approve`| Approve job                | Yes           | Admin         |
| PUT    | `/jobs/:jobId/reject` | Reject job                 | Yes           | Admin         |

**Full API documentation available in `/docs/swagger.yaml` and Postman collection.**

---

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Python 3.8+
- Cloudinary account
- SMTP email credentials (Gmail)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd project-root/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
FRONTEND_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=20min
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RESEND_API_KEY=
ML_API_URL=http://localhost:8001/api

NODE_ENV=development
```

4. **Seed the database** (Optional, for demo data)
```bash
node database/index.js
```

5. **Start the server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

### Frontend Setup

1. **Navigate to frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. **Start development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### ML API Setup

1. **Navigate to ml_api**
```bash
cd ../ml_api
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file**
```env
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-portal
```

5. **Start ML API**
```bash
python app.py
```

ML API runs on `http://localhost:5001`

---

## AI Model Workflow

### Overview
The ML recommendation engine uses Natural Language Processing to match candidate skills with job requirements.

### Process Flow
1. **Data Collection**: Candidate profile (skills, experience) and all active jobs
2. **Text Processing**: 
   - Extract skills from candidate profile
   - Extract required skills from job descriptions
   - Tokenize and clean text
3. **Vectorization**: Convert text to numerical vectors using TF-IDF
4. **Similarity Calculation**: Compute cosine similarity between candidate and jobs
5. **Ranking**: Sort jobs by similarity score
6. **Return**: Top 5 recommended jobs

### Technologies Used
- **TF-IDF Vectorizer** - Convert text to feature vectors
- **Cosine Similarity** - Measure similarity between vectors
- **NLTK/spaCy** - Text preprocessing
- **pandas** - Data manipulation

### API Integration
```javascript
// Backend calls ML API
const response = await axios.post('http://localhost:5001/recommend', {
  candidate: {
    skills: ['React', 'Node.js', 'MongoDB'],
    experience: 2
  }
});
```

---

## Testing Strategy

### Unit Tests
- **Backend**: Jest + Supertest
  - Model validation
  - Utility functions
  - Auth helpers (JWT, bcrypt)
- **Frontend**: React Testing Library + Jest
  - Component rendering
  - User interactions
  - Redux state changes
- **ML API**: PyTest
  - Model predictions
  - API endpoints

### Integration Tests
- Auth flow (register, login, refresh token)
- Job CRUD operations
- Application workflow
- Admin operations

### End-to-End Tests
- **Cypress/Playwright**
  - User registration and login
  - Job search and application
  - Recruiter job posting
  - Admin approval workflow

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: npm test
      - name: Run frontend tests
        run: npm test
```

---

## Deployment Guide

### Backend Deployment (Render/Railway)

1. **Create account** on Render or Railway
2. **Connect GitHub repository**
3. **Set environment variables** (all from `.env`)
4. **Deploy** from main branch
5. **Verify** API endpoint is accessible

### Frontend Deployment (Vercel/Netlify)

1. **Create account** on Vercel or Netlify
2. **Import project** from GitHub
3. **Set build command**: `npm run build`
4. **Set output directory**: `dist`
5. **Add environment variable**: `VITE_API_BASE_URL=<backend-url>`
6. **Deploy**

### ML API Deployment (Render/AWS Lambda)

1. **Dockerize Flask app** (optional)
2. **Deploy to Render** or AWS Lambda
3. **Update backend** with ML API URL
4. **Test** recommendation endpoint

### Database (MongoDB Atlas)

1. **Create cluster** on MongoDB Atlas
2. **Get connection string**
3. **Update** `MONGODB_URI` in all services
4. **Whitelist IP addresses** or allow all

---

## Future Enhancements

- **Advanced AI Models**: BERT, GPT for better recommendations
- **In-app Messaging**: Chat between candidates and recruiters
- **Video Interviews**: Integrated video call feature
- **Analytics Dashboard**: Advanced charts and insights
- **Mobile App**: React Native or Flutter app
- **Internationalization**: Multi-language support
- **Progressive Web App**: Offline capabilities
- **Email Notifications**: Job alerts and updates
- **Social Login**: OAuth with Google, LinkedIn
- **API Rate Limiting**: Prevent abuse
- **Caching**: Redis for improved performance

---

## Contributors

- **Hritik Chauhan** - Full Stack Developer
- **Email**: hritikchji@gmail.com

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- React and Redux Toolkit teams
- MongoDB and Mongoose
- Express.js community
- Tailwind CSS
- All open-source contributors

---

**If you found this project helpful, please give it a star!**

---

_This project was built as part of an Advanced Full Stack Development Internship Assignment._
