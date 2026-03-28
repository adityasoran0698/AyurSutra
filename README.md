# 🌿 AyurSutra — Connect. Consult. Heal.

> A full-stack Panchakarma therapy management platform that digitizes the entire lifecycle of Ayurvedic treatment — from smart booking and session tracking to multi-channel patient notifications and **AI-powered wellness analytics**.

**Live Demo:** [ayur-sutra-coral.vercel.app](https://ayur-sutra-coral.vercel.app)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [How the Booking System Works](#how-the-booking-system-works)
- [AI & Wellness Intelligence](#ai--wellness-intelligence)
- [Wellness Scoring Algorithm](#wellness-scoring-algorithm)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## About the Project

Panchakarma is gaining global recognition for detoxification, rejuvenation, and chronic disease management — contributing to a projected **USD 16 billion Ayurveda market by 2026**. Yet most clinics still rely on manual scheduling and paper records.

**AyurSutra** bridges this gap with a modern, patient-centric web platform that:

- Automates therapy scheduling with intelligent slot management
- Tracks patient health progress session-by-session
- Delivers multi-channel notifications (SMS, email, in-app)
- **Analyzes patient feedback using NLP-based sentiment analysis** to extract emotional recovery signals
- **Computes a composite AI wellness score** from five clinical dimensions after every session
- **Visualizes recovery trends** using sentiment analysis and vitals data on an interactive improvement chart
- Gives doctors a real-time view of all their patients

---

## Features

### For Patients
- 🗓️ **Smart Therapy Booking** — choose a therapy and doctor; the system automatically assigns the earliest available date using a constraint-aware slot allocation algorithm
- 📊 **Session Dashboard** — view all bookings, session statuses, and progress bars at a glance
- 📝 **Session Feedback** — submit pain, stress, energy, sleep quality, and free-text notes after each completed session; free-text is processed by an **NLP sentiment engine** in real time
- 📈 **AI Improvement Chart** — see a **composite AI wellness score** plotted over every session, giving a data-driven view of health recovery
- 🔔 **Multi-channel Notifications** — receive booking confirmations via SMS, email, and in-app

### For Doctors
- 👥 **Patient Management** — view all assigned patients grouped by booking
- ✅ **Session Status Control** — mark sessions as completed or missed in one click
- 📅 **Upcoming Sessions Chart** — an area chart of sessions scheduled over the next 14 days
- 🩺 **Per-patient AI Progress View** — see pie charts and **AI-generated improvement charts** tracking every patient's wellness score across their full therapy
- ✍️ **Blog Publishing** — write and publish Ayurveda articles for the community

### Platform-wide
- 🔐 Role-based access (patient / doctor) enforced across UI and API
- 🌐 Responsive design — works on mobile, tablet, and desktop
- ⚡ Real-time toast notifications for all actions

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| TailwindCSS v4 | Styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Charts and data visualization |
| Framer Motion | Animations |
| React Hook Form | Form management |
| **Sentiment.js** | **Client-side NLP for real-time sentiment scoring of session feedback** |
| React Toastify | Toast notifications |
| shadcn/ui | UI component primitives |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| cookie-parser | HTTP cookie handling |
| Nodemailer | Email notifications (Gmail SMTP) |
| Twilio | SMS notifications |
| **node-cron** | **Scheduled background jobs for auto-rescheduling missed sessions** |
| dotenv | Environment variable management |

---

## Project Structure

```
AyurSutra/
│
├── backend/
│   ├── controllers/
│   │   ├── bookingController.js     # Smart slot assignment + session generation
│   │   └── sessionController.js    # Session completion + post-procedure alerts
│   ├── models/
│   │   ├── user.js                  # Patient & doctor schema (role-conditional fields)
│   │   ├── booking.js               # Booking + embedded sessions + AI feedback + sentiment scores
│   │   ├── Therapy.js               # Therapy catalog with slots and instructions
│   │   └── Blogs.js                 # Doctor-authored blog posts
│   ├── routes/
│   │   ├── user.js                  # Auth, profile, doctors, patients
│   │   ├── therapy.js               # Therapy CRUD
│   │   ├── booking.js               # Booking lifecycle + AI feedback ingestion
│   │   └── blogs.js                 # Blog CRUD
│   ├── services/
│   │   └── auth.js                  # JWT generate + validate
│   ├── utils/
│   │   └── notificationService.js   # SMS + email + in-app (parallel, non-blocking)
│   ├── connectDB.js                 # MongoDB connection
│   └── index.js                     # App entry point, middleware, routes, cron jobs
│
├── frontend/
│   ├── public/
│   │   └── bg.jpg                   # Background image
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Role-adaptive navigation
│   │   │   ├── PatientCard.jsx      # Doctor's per-patient dialog with AI charts
│   │   │   └── improvmentChart.jsx  # Recharts area chart rendering AI wellness scores
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Landing page
│   │   │   ├── LoginPage.jsx        # Role-aware login
│   │   │   ├── RegisterPage.jsx     # Patient + doctor registration
│   │   │   ├── Therapies.jsx        # Searchable therapy catalog
│   │   │   ├── BookTherapies.jsx    # Booking flow
│   │   │   ├── PatientDashboard.jsx # Patient home with AI charts + NLP feedback
│   │   │   ├── DoctorDashbaord.jsx  # Doctor home with patient management
│   │   │   ├── AddTherapy.jsx       # Doctor therapy creation form
│   │   │   └── Blog.jsx             # Blog list + doctor publish modal
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # React entry point
│   │   └── ProtectedRoute.jsx       # Auth guard component
│   └── vite.config.js
│
└── jsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Twilio account (for SMS)
- Gmail account with App Password enabled (for email)

### 1. Clone the repository

```bash
git clone https://github.com/adityasoran0698/AyurSutra.git
cd AyurSutra
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

```bash
npm run dev
```

The server runs on `http://localhost:8000`.

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# MongoDB
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ayursutra

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=8000

# Twilio (SMS)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1xxxxxxxxxx

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** For Gmail, enable 2-Factor Authentication and generate an **App Password** from your Google account settings. Do not use your regular Gmail password.

---

## API Reference

### Auth — `/user`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/user/register` | Register a new patient or doctor | Public |
| `POST` | `/user/login` | Login and receive JWT cookie | Public |
| `POST` | `/user/logout` | Clear auth cookie | Public |
| `GET` | `/user/me` | Get current user from cookie | Cookie |
| `GET` | `/user/doctors` | List all doctors | Public |
| `GET` | `/user/patients` | Get doctor's assigned patients | Doctor |

### Therapies — `/therapy`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/therapy` | Get all active therapies | Public |
| `GET` | `/therapy/:id` | Get a single therapy | Public |
| `POST` | `/therapy/add-therapy` | Create a new therapy | Doctor |

### Bookings — `/bookings`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/bookings` | Create a booking (auto-schedules date) | Patient |
| `GET` | `/bookings` | Get all bookings for current patient | Patient |
| `PATCH` | `/bookings/update/:bookingId` | Update sessions + progress | Doctor |
| `POST` | `/bookings/:bookingId/:sessionIndex` | Submit session feedback (triggers NLP scoring) | Patient |
| `DELETE` | `/bookings/delete/:id` | Delete a booking | Doctor |
| `PATCH` | `/bookings/auto-reschedule` | Reschedule all missed sessions | Any |
| `PATCH` | `/bookings/:id/auto-schedule` | Reschedule a single booking | Any |

### Blogs — `/blogs`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/blogs/all-blogs` | Get all blog posts | Public |
| `POST` | `/blogs/add-blogs/:id` | Create a blog post | Doctor |

---

## Data Models

### User
```js
{
  fullname: String,
  email: String (unique),
  phoneNumber: String,
  password: String (bcrypt hashed),
  role: "patient" | "doctor",

  // Doctor-only fields
  specialization: String,
  experience: Number,
  qualification: String
}
```

### Therapy
```js
{
  name: String,
  description: String,
  duration: Number,        // days (= number of sessions)
  price: Number,
  slotsPerDay: Number,     // max bookings per day (default: 5)
  createdBy: ObjectId,     // ref: User (doctor)
  isActive: Boolean,
  instructions: {
    pre: [String],
    post: [String]
  }
}
```

### Booking
```js
{
  therapyId: ObjectId,
  doctorId: ObjectId,
  patientId: ObjectId,
  date: Date,              // auto-assigned start date
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
  sessions: [{
    sessionDate: Date,
    status: "scheduled" | "completed" | "missed",
    notifications: [{
      type: "pre-procedure" | "post-procedure" | "in-app",
      message: String,
      sent: Boolean,
      sentAt: Date
    }],
    // Patient feedback (raw inputs fed into AI scoring pipeline)
    feedbackText: String,  // free-text — processed by NLP sentiment engine
    pain: Number,          // 0–10
    stress: Number,        // 0–10
    energy: Number,        // 0–10
    sleep: "poor" | "average" | "good",
    // AI-computed outputs
    sentiment: String,           // NLP sentiment label derived from feedbackText
    improvementScore: Number     // composite AI wellness score (0–10)
  }],
  progress: {
    completedSessions: Number,
    totalSessions: Number,
    recoveryNotes: String
  }
}
```

---

## How the Booking System Works

When a patient books a therapy, the system does not simply record today's date. Instead it runs a **slot-aware forward search**:

```
Start from today
↓
Count existing bookings for (doctor + therapy + date)
↓
If count < slotsPerDay → assign this date ✅
If count >= slotsPerDay → move to next day and repeat
↓
Once a date is found, generate one session per day
for the full therapy duration (e.g. 7 days → 7 sessions)
↓
Send confirmation via SMS + email + in-app (parallel)
```

This prevents overbooking and ensures every patient gets a real, available slot automatically — no manual calendar management needed.

---

## AI & Wellness Intelligence

AyurSutra integrates AI at multiple points across the patient journey — not as a single isolated feature, but woven into booking, feedback, visualization, and scheduling.

### NLP Sentiment Analysis
Every time a patient submits session feedback, the free-text `feedbackText` field is passed through **Sentiment.js**, a client-side natural language processing library. It tokenizes the input, scores each word against a pre-built AFINN lexicon, and returns a signed sentiment value that is then normalized to a 0–10 scale. This means even open-ended patient notes — *"I felt a lot lighter today"* or *"still quite sore"* — are automatically quantified and factored into the wellness score, without any manual tagging or doctor intervention.

### Composite Wellness Scoring
The raw clinical inputs (pain, stress, energy, sleep) and the NLP sentiment score are fused into a single `improvementScore` per session. See the [Wellness Scoring Algorithm](#wellness-scoring-algorithm) section below for the full formula. This score is persisted on the session document and is available for future ML model training.

### AI Improvement Chart
The per-session `improvementScore` values are plotted as an **interactive Recharts area chart** on both the Patient Dashboard and the Doctor's per-patient view. This gives a continuous, data-driven picture of how the patient is responding to therapy — making it easy to spot plateaus, improvements, or regressions across the full treatment duration.

### Auto-Rescheduling Engine
A `node-cron` background job runs on a schedule to detect sessions with `status: "missed"` and automatically re-runs the slot allocation algorithm to find the next available date. This keeps therapy continuity intact without any manual doctor intervention, and re-dispatches notifications to the patient once rescheduled.

### AI-Ready Data Schema
Every session document stores both the raw feedback inputs (usable as ML features) and the AI-computed outputs (`sentiment`, `improvementScore`). This schema is intentionally forward-compatible — plugging in a Python ML model, a vector store, or a recommendation engine in the future requires no structural changes to the database.

---

## Wellness Scoring Algorithm

After each session, a **composite AI wellness score (0–10)** is calculated from the patient's feedback using five equally weighted dimensions:

```
painScore    = 10 - pain          (lower pain = better)
stressScore  = 10 - stress        (lower stress = better)
energyScore  = energy             (higher = better)
sleepScore   = poor(2) | average(5) | good(8)
sentimentScore = Sentiment.js NLP on feedbackText → normalized to 0–10

finalScore = (painScore + stressScore + energyScore + sleepScore + sentimentScore) / 5
```

These scores are plotted as an area chart across sessions, giving both patients and doctors a visual trend of health improvement over the course of the therapy.

---

## Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | [ayur-sutra-coral.vercel.app](https://ayur-sutra-coral.vercel.app) |
| Backend | Render.com | `https://ayursutra-2-tl11.onrender.com` |
| Database | MongoDB Atlas | Cloud-hosted |

The frontend uses `vercel.json` to handle client-side routing (SPA fallback). CORS is configured on the backend to only accept requests from the Vercel domain and `localhost:5173`.

---

## Page Description

| Page | Description |
|---|---|
| **Home** | Landing page with features, how-it-works, and testimonials |
| **Therapies** | Searchable catalog of Panchakarma therapies |
| **Book Therapy** | Doctor selection and auto-scheduled booking |
| **Patient Dashboard** | Session cards, progress bars, pie chart, AI improvement chart |
| **Doctor Dashboard** | Patient list, upcoming sessions chart, session management |
| **Blog** | Community articles published by doctors |

---

## Author

**Aditya Soran**
GitHub: [@adityasoran0698](https://github.com/adityasoran0698)

---

> *AyurSutra — Bringing the wisdom of Panchakarma into the digital age.*
