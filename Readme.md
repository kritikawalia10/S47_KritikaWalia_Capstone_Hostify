# 🏠 Hostify — Smart Accommodation Platform

> *A full-stack capstone project by **Kritika Walia***

Hostify is a modern, AI-powered accommodation discovery and booking platform built for students, remote workers, and travelers who need temporary housing like PGs and hostels. It features role-based dashboards for Guests and Hosts, real-time room listings, booking management, and a Gemini AI recommendation assistant.

---

## 🌐 Live Links

| Surface | Link |
|---|---|
| Frontend (Vercel) | [s47-kritika-walia-capstone-hostify.vercel.app](https://s47-kritika-walia-capstone-hostify.vercel.app/) |
| Backend (Render) | [s47-kritikawalia-capstone-hostify-1.onrender.com](https://s47-kritikawalia-capstone-hostify-1.onrender.com/) |
| Figma Low-Fid | [View Design](https://www.figma.com/file/Sf5kgUH7a2XdBXO0YbErOP/Hostify-Low-Fid) |

---

## ✨ Key Features

### 🔐 Authentication & Role System
- Register as a **Guest** (find & book stays) or **Host** (list & manage properties)
- Secure login with hashed passwords (bcryptjs) and JWT session tokens
- Google OAuth 2.0 sign-in support

### 👤 Guest Dashboard
- Browse all available PG/hostel listings in a responsive card grid
- Real-time **search & filter** by name and room type
- One-click **Book Now** with status tracking (Pending → Confirmed)
- Sidebar showing **My Bookings** with live status badges
- Floating **Gemini AI Assistant** for natural-language room recommendations

### 🏠 Host Dashboard
- **Properties Tab** — view, edit, and delete your own listings
- **Booking Requests Tab** — accept or reject incoming booking requests
- Pending booking count badge for quick action alerts
- Add new listings with image URL, price, availability count, and room type

### 🤖 Gemini AI Recommendation Assistant
- Powered by Google Gemini 1.5 Flash API
- Sends current live database listings as context to the AI
- Natural language query support: *"suggest a room under ₹12000"*, *"find an AC double room"*
- Graceful fallback with featured listings when API key is not configured

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS (Glassmorphism design system) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs, Google OAuth 2.0 |
| AI | Google Gemini 1.5 Flash via REST API |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or use the local in-memory fallback — works out-of-the-box)

### 1. Clone the repository
```bash
git clone https://github.com/kritikawalia10/S47_KritikaWalia_Capstone_Hostify.git
cd S47_KritikaWalia_Capstone_Hostify
```

### 2. Configure Environment Variables
In the root `.env` file, fill in your values:
```env
URL=your_mongodb_atlas_connection_string
PORT=8080
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_gemini_api_key  # Optional — AI works with fallback without this
```

### 3. Install & Start Backend
```bash
npm install
npm start
```

### 4. Install & Start Frontend
```bash
cd client
npm install
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🧪 Default Test Credentials (Local Fallback)

When MongoDB is unavailable, the server automatically switches to an in-memory database with these seeded accounts:

| Role | Email | Password |
|---|---|---|
| **Host** | `owner@hostify.com` | `password123` |
| **Guest** | `user@hostify.com` | `password123` |

---

## 📂 Project Structure

```
S47_KritikaWalia_Capstone_Hostify/
├── index.js              # Express server with all API routes
├── models/
│   ├── User.js           # User schema (name, email, password, role)
│   ├── Hostel.js         # Hostel schema (with owner reference)
│   └── Booking.js        # Booking schema (user ↔ hostel link)
├── client/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state provider
│       └── components/
│           ├── Nav.jsx           # Glassmorphic navbar with role-conditional links
│           ├── Home.jsx          # Landing page with features section
│           ├── Login.jsx         # Login form with Google OAuth support
│           ├── SignUp.jsx        # Signup form with Guest/Host role toggle
│           ├── MainPage.jsx      # Role-based dashboard (User + Owner views)
│           ├── Add.jsx           # New hostel listing form
│           ├── Edit.jsx          # Edit hostel listing form
│           ├── About.jsx         # About page
│           └── Contact.jsx       # Contact info page
```

---

## 🤖 AI Implementation — How It Works

The Gemini AI Assistant is implemented as a **backend-mediated prompt engineering** feature:

1. When a user sends a query, it goes to the `/api/ai/chat` endpoint
2. The backend **fetches all live hostel listings** from the database
3. It formats the listings as structured context and **injects them into the Gemini prompt**
4. The prompt instructs Gemini to act as "Hostify AI Assistant" and respond using **only the provided data**
5. The AI response is streamed back to the user via the floating chat widget

This approach keeps recommendations grounded in real data and avoids hallucinations — a beginner-friendly, effective AI integration pattern.

---

## 👩‍💻 Author

**Kritika Walia** — CalTech Capstone, Batch S47

*Made with ❤️ for the love of clean code and cozy rooms.*
