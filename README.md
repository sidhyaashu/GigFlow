# GigFlow - Mini Freelance Marketplace

GigFlow is a lightweight freelance marketplace platform built as a full-stack internship assignment. It enables clients to post "Gigs" (jobs) and freelancers to submit "Bids" (proposals). The platform features secure authentication, atomic "Hiring" logic with MongoDB transactions, and real-time notifications via Socket.io.

## 🚀 Key Features

### 1. User Authentication
- **Secure Sign-up & Login**: Powered by JWT stored in **HttpOnly Cookies** for maximum security.
- **Fluid Roles**: Any user can switch between being a Client (posting gigs) and a Freelancer (bidding on gigs).

### 2. Gig Management (CRUD)
- **Browse Gigs**: A public feed displaying all currently "Open" jobs.
- **Search & Filter**: Real-time search functionality to find jobs by title.
- **Job Posting**: Authenticated users can post gigs with titles, descriptions, and budgets.

### 3. Advanced Hiring Logic (Crucial)
- **Bid Submission**: Freelancers can submit a bid with a personalized message and their proposed price.
- **Client Review**: Gig owners can view all incoming bids for their specific posts.
- **Atomic Hiring**: Implements **MongoDB Transactions** (Bonus 1) to ensure the hiring process is atomic and prevents race conditions. 
  - Choosing a freelancer automatically rejects all other bids and marks the gig as "Assigned".

### 4. Real-time Notifications (Bonus 2)
- Integrates **Socket.io** to provide instant feedback. 
- Freelancers receive a real-time notification as soon as they are hired, without needing to refresh the page.

---

## 🛠️ Technical Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Redux Toolkit (RTK Query).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Real-time**: Socket.io.
- **Security**: JWT, HttpOnly Cookies, Helmet, Rate Limiting.

---

## 📂 Project Structure

### Backend (`/server`)
- `config/`: Database and environment configurations.
- `controllers/`: Request handling logic (Gig, User, Bid).
- `models/`: Mongoose schemas (User, Gig, Bid).
- `routes/`: API endpoint definitions.
- `middleware/`: Auth verification and security.
- `seed.js`: Database seeding script for local testing.

### Frontend (`/client`)
- `features/`: Redux slices and API queries.
- `pages/`: Page components (Home, Login, Dashboard, GigDetails).
- `components/`: Reusable UI elements.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed.
- MongoDB instance (Local or Atlas).

### 1. Clone the Repository
```bash
git clone https://github.com/sidhyaashu/GigFlow.git
cd GigFlow
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (see `.env.example`).
```bash
npm run dev   # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev   # Starts client on http://localhost:5173
```

---

## 📡 API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | Register new user |
| **Auth** | POST | `/api/auth/login` | Login & set HttpOnly Cookie |
| **Gigs** | GET | `/api/gigs` | Fetch all open gigs (supports search) |
| **Gigs** | POST | `/api/gigs` | Create a new job post |
| **Bids** | POST | `/api/bids` | Submit a bid for a gig |
| **Bids** | GET | `/api/bids/:gigId` | Get all bids for a gig (Owner only) |
| **Hiring** | PATCH | `/api/bids/:bidId/hire` | The atomic "Hire" logic |

---

## 🏆 Stand-out Implementations

- **Bonus 1 (Transactional Integrity)**: The `hireFreelancer` logic in `bidController.js` uses `mongoose.startSession()` and `startTransaction()`. This ensures that updating the bid, the gig, and rejecting competitors happens as a single atomic unit, handling race conditions perfectly.
- **Bonus 2 (Real-time)**: WebSocket integration allows for instant notifications. When a client clicks hire, the server emits a `notification` event targeted directly at the freelancer's specific room.

---

## 📝 Submission Details
- **Developer**: Asutosh Sidhya
- **Contact**: ashutoshsidhya69@gmail.com
- **Loom Demo**: 
