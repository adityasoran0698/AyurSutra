# 🌿 AyurSutra — AI-Powered Panchakarma Care

> An intelligent Ayurvedic therapy platform that uses **NLP-driven wellness scoring**, **predictive slot allocation**, and **multi-channel AI-assisted notifications** to deliver a fully automated, data-driven healing experience.

**Live Demo:** [ayur-sutra-coral.vercel.app](https://ayur-sutra-coral.vercel.app) &nbsp;|&nbsp; **Backend:** [ayursutra-2-tl11.onrender.com](https://ayursutra-2-tl11.onrender.com)

---

## 🤖 AI & Intelligence at a Glance

AyurSutra is not just a booking system — it is an **AI-augmented clinical platform** that learns from patient feedback, automates scheduling decisions, and surfaces recovery intelligence for every session.

| AI Capability | What It Does |
|---|---|
| 🧠 **NLP Sentiment Engine** | Runs `Sentiment.js` on free-text session notes to extract emotional recovery signals |
| 📊 **Composite Wellness Scoring** | Fuses 5 clinical dimensions into a single 0–10 improvement score per session |
| 📅 **Smart Slot Allocation** | Forward-searches availability in real time to prevent overbooking without any manual calendar work |
| 🔔 **Automated Multi-Channel Alerts** | Fires parallel SMS + email + in-app notifications triggered by booking and session events |
| 📈 **Recovery Trend Visualization** | Plots per-session wellness scores as an area chart, giving patients and doctors a visual healing trajectory |
| 🔄 **Auto-Rescheduling Engine** | Detects missed sessions and automatically reschedules them across the booking lifecycle |

---

## 🧠 Core AI Features — Deep Dive

### 1. NLP-Powered Wellness Scoring

After every completed session, AyurSutra computes a **composite wellness score (0–10)** by fusing structured clinical inputs with unstructured natural language:

```
painScore      = 10 − pain          (lower pain → higher score)
stressScore    = 10 − stress        (lower stress → higher score)
energyScore    = energy             (higher energy → higher score)
sleepScore     = poor(2) | average(5) | good(8)
sentimentScore = Sentiment.js NLP on free-text notes → normalized 0–10

finalScore = (painScore + stressScore + energyScore + sleepScore + sentimentScore) / 5
```

**Why this matters:** Most health apps track only structured vitals. AyurSutra is the only platform in this space that incorporates **real-time NLP sentiment analysis** on patient narratives to produce a richer, more holistic recovery signal.

The sentiment scores are stored on the session document and plotted as an **interactive Recharts area chart** — giving both patients and doctors a continuous, data-driven view of healing progress across the full therapy duration.

---

### 2. Intelligent Slot Allocation Algorithm

When a patient books a therapy, AyurSutra runs a **constraint-aware forward search** instead of blindly assigning today's date:

```
Start from today
  ↓
Count existing bookings for (doctor × therapy × date)
  ↓
If count < slotsPerDay  →  assign this date ✅
If count ≥ slotsPerDay  →  advance to next day, repeat
  ↓
Once a valid date is found:
  Generate one session per day × full therapy duration
  (e.g., 14-day Panchakarma → 14 sequential sessions)
  ↓
Dispatch confirmation: SMS + email + in-app (parallel, non-blocking)
```

This is effectively a **greedy scheduling algorithm** with per-day capacity constraints — eliminating double-booking and manual calendar management entirely.

---

### 3. Auto-Rescheduling Engine

The platform includes a `node-cron`-powered background job that:

- Scans all bookings for sessions with status `missed`
- Re-runs the slot allocation algorithm for each missed session
- Updates session dates and re-dispatches notifications automatically

This keeps therapy continuity intact without any manual doctor intervention.

---

### 4. Multi-Channel Notification Intelligence

Notifications are fired at two key clinical moments:

| Trigger | Channels | Content |
|---|---|---|
| **Booking confirmed** | SMS (Twilio) + Email (Nodemailer) + In-App | Therapy name, doctor, start date, pre-procedure instructions |
| **Session completed** | SMS + Email + In-App | Post-procedure care instructions from `therapy.instructions.post` |

All three channels run in **parallel via `Promise.all`** — non-blocking, fault-tolerant, and logged per session in the `notifications` sub-document array.

---

### 5. AI-Ready Data Architecture

Every session stores a rich, ML-ready document:

```js
{
  sessionDate: Date,
  status: "scheduled" | "completed" | "missed",

  // Structured clinical vitals (ML features)
  pain: Number,        // 0–10
  stress: Number,      // 0–10
  energy: Number,      // 0–10
  sleep: "poor" | "average" | "good",

  // Unstructured NLP input
  feedbackText: String,

  // AI-computed outputs
  sentiment: String,           // NLP label
  improvementScore: Number,    // 0–10 composite score

  // Notification audit trail
  notifications: [{
    type: "pre-procedure" | "post-procedure" | "in-app",
    message: String,
    sent: Boolean,
    sentAt: Date
  }]
}
```

This schema is designed for future extensibility — plugging in a Python ML model, a vector embedding store, or a recommendation engine requires no schema changes.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)

---

## ✨ Features

### For Patients
- 🗓️ **AI-Scheduled Booking** — slot allocation runs automatically; patients never see a calendar conflict
- 📊 **Session Dashboard** — booking cards, progress bars, and session status at a glance
- 📝 **Post-Session Feedback** — pain, stress, energy, sleep quality, and open-ended notes (NLP-analyzed)
- 📈 **Improvement Chart** — composite wellness score plotted across every session
- 🔔 **Multi-Channel Alerts** — SMS, email, and in-app confirmations and care instructions

### For Doctors
- 👥 **Patient Intelligence View** — all assigned patients grouped by booking, with per-patient analytics
- ✅ **Session Control** — mark sessions completed or missed in one click; rescheduling is automatic
- 📅 **14-Day Demand Chart** — area chart of upcoming sessions to anticipate clinic load
- 🩺 **Per-Patient Recovery Analytics** — pie charts and improvement curves for every booking
- ✍️ **Blog Publishing** — publish Ayurveda articles for the patient community

### Platform-Wide
- 🔐 Role-based access (patient / doctor) enforced at both UI and API layers
- 🌐 Fully responsive — mobile, tablet, and desktop
- ⚡ Real-time toast notifications for every user action

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| TailwindCSS v4 | Styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Wellness trend charts and session analytics |
| Framer Motion | Animations and transitions |
| React Hook Form | Form management |
| **Sentiment.js** | **Client-side NLP for wellness scoring** |
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
| **Twilio** | **Automated SMS notifications** |
| **node-cron** | **Scheduled background jobs (auto-reschedule)** |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
AyurSutra/
│
├── backend/
│   ├── controllers/
│   │   ├── bookingController.js     # Smart slot allocation + session generation
│   │   └── sessionController.js    # Session completion + post-procedure alerts
│   ├── models/
│   │   ├── user.js                  # Patient & doctor schema (role-conditional fields)
│   │   ├── booking.js               # Booking + embedded sessions + AI feedback schema
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
│   │   └── notificationService.js   # Parallel SMS + email + in-app (non-blocking)
│   ├── connectDB.js                 # MongoDB connection
│   └── index.js                     # App entry point, middleware, cron jobs, routes
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx           # Role-adaptive navigation
│       │   ├── PatientCard.jsx      # Doctor's per-patient dialog with analytics
│       │   └── improvmentChart.jsx  # Recharts area chart — NLP wellness scores
│       ├── pages/
│       │   ├── HomePage.jsx         # Landing page
│       │   ├── LoginPage.jsx        # Role-aware login
│       │   ├── RegisterPage.jsx     # Patient + doctor registration
│       │   ├── Therapies.jsx        # Searchable therapy catalog
│       │   ├── BookTherapies.jsx    # AI-scheduled booking flow
│       │   ├── PatientDashboard.jsx # Patient home — charts, feedback, NLP scores
│       │   ├── DoctorDashbaord.jsx  # Doctor home — patient management + demand chart
│       │   ├── AddTherapy.jsx       # Doctor therapy creation form
│       │   └── Blog.jsx             # Community articles
│       ├── App.jsx
│       └── ProtectedRoute.jsx       # Auth guard component
│
└── jsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Twilio account (for SMS)
- Gmail account with App Password (for email)

### 1. Clone the repository

```bash
git clone https://github.com/adityasoran0698/AyurSutra.git
cd AyurSutra
```

### 2. Set up the Backend

```bash
cd backend
npm install
# Create your .env file (see Environment Variables below)
npm run dev
```

Server runs on `http://localhost:8000`.

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
# MongoDB
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ayursutra

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=8000

# Twilio (SMS Notifications)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1xxxxxxxxxx

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail note:** Enable 2-Factor Authentication and generate an **App Password** from your Google account settings. Do not use your regular Gmail password.

---

## 📡 API Reference

### Auth — `/user`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/user/register` | Register patient or doctor | Public |
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
| `POST` | `/bookings` | Create booking (AI slot allocation) | Patient |
| `GET` | `/bookings` | Get all bookings for current patient | Patient |
| `PATCH` | `/bookings/update/:bookingId` | Update sessions + progress | Doctor |
| `POST` | `/bookings/:bookingId/:sessionIndex` | Submit NLP-analyzed session feedback | Patient |
| `DELETE` | `/bookings/delete/:id` | Delete a booking | Doctor |
| `PATCH` | `/bookings/auto-reschedule` | AI auto-reschedule all missed sessions | Any |
| `PATCH` | `/bookings/:id/auto-schedule` | AI reschedule a single booking | Any |

### Blogs — `/blogs`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/blogs/all-blogs` | Get all blog posts | Public |
| `POST` | `/blogs/add-blogs/:id` | Create a blog post | Doctor |

---

## 🗃️ Data Models

### User
```js
{
  fullname: String,
  email: String (unique),
  phoneNumber: String,
  password: String (bcrypt hashed),
  role: "patient" | "doctor",

  // Doctor-only
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
  slotsPerDay: Number,     // capacity constraint for slot allocator (default: 5)
  createdBy: ObjectId,     // ref: User (doctor)
  isActive: Boolean,
  instructions: {
    pre: [String],         // sent as pre-procedure SMS/email
    post: [String]         // sent as post-procedure SMS/email
  }
}
```

### Booking (AI-enriched session schema)
```js
{
  therapyId: ObjectId,
  doctorId: ObjectId,
  patientId: ObjectId,
  date: Date,              // auto-assigned by slot allocation algorithm
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",

  sessions: [{
    sessionDate: Date,
    status: "scheduled" | "completed" | "missed",

    // Multi-channel notification audit trail
    notifications: [{
      type: "pre-procedure" | "post-procedure" | "in-app",
      message: String,
      sent: Boolean,
      sentAt: Date
    }],

    // Structured clinical inputs (ML features)
    pain: Number,          // 0–10
    stress: Number,        // 0–10
    energy: Number,        // 0–10
    sleep: "poor" | "average" | "good",
    feedbackText: String,  // free-text — NLP input

    // AI-computed outputs
    sentiment: String,           // NLP sentiment label
    improvementScore: Number     // 0–10 composite wellness score
  }],

  progress: {
    completedSessions: Number,
    totalSessions: Number,
    recoveryNotes: String
  }
}
```

---

## 🚢 Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | [ayur-sutra-coral.vercel.app](https://ayur-sutra-coral.vercel.app) |
| Backend | Render.com | `https://ayursutra-2-tl11.onrender.com` |
| Database | MongoDB Atlas | Cloud-hosted |

The frontend uses `vercel.json` for SPA routing fallback. CORS is configured on the backend to accept requests from the Vercel domain and `localhost:5173` only.

---

## 🗺️ Pages

| Page | Description |
|---|---|
| **Home** | Landing page with features, how-it-works, and testimonials |
| **Therapies** | Searchable catalog of Panchakarma therapies |
| **Book Therapy** | AI-scheduled booking flow with doctor selection |
| **Patient Dashboard** | Session cards, NLP wellness chart, pie charts, feedback form |
| **Doctor Dashboard** | Patient list, 14-day demand chart, session management |
| **Blog** | Community articles published by doctors |

---

## 🔮 Roadmap — AI Enhancements

- [ ] **Personalized therapy recommendations** — collaborative filtering based on patient profiles and past outcomes
- [ ] **Predictive recovery modeling** — regression model trained on historical wellness scores to estimate time-to-recovery
- [ ] **Doctor-facing anomaly alerts** — flag patients whose wellness scores plateau or decline across sessions
- [ ] **Voice feedback input** — speech-to-text for session notes, feeding directly into the NLP sentiment pipeline
- [ ] **LLM-powered care summaries** — auto-generate a structured end-of-therapy report for each patient booking

---

## 👤 Author

**Aditya Soran**
GitHub: [@adityasoran0698](https://github.com/adityasoran0698)

---

> *AyurSutra — Where ancient Panchakarma wisdom meets modern AI.*
