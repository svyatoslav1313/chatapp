# 💬 ChatApp

A modern full-stack real-time messenger featuring direct messaging, global user search, and JWT authentication.

## 🛠 Tech Stack

### **Frontend**

- **React** (Vite)
- **SCSS Modules** — Scoped component styling
- **React Router DOM v6** — Client-side routing & URL-driven state
- **WebSockets API** + React Context — Persistent connection management
- **Lucide React** — UI Icons

### **Backend**

- **Node.js** + **Express**
- **WebSockets (`ws`)** — Server-side socket management
- **PostgreSQL** + **Sequelize ORM** — Relational database & models
- **JWT (JSON Web Tokens)** — Dual-token authentication (Access/Refresh tokens)
- **bcrypt** — Password hashing & security

## ✨ Key Features

- 💬 **Real-Time Messaging:** Fast, instant messaging powered by WebSockets.
- 🟢 **Live Presence & Last Seen:** Online/offline status and **Last Seen** timestamp visible only to users you have a chat with.
- ✍️ **Typing Indicators:** Live "typing..." indicator when a user is composing a message.
- 🔐 **Secure Authentication:** JWT dual-token system (Access & Refresh) with hashed password storage.
- 🔍 **Smart Search:** Debounced global user search with automatic direct chat creation.

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/svyatoslav1313/chatapp.git](https://github.com/svyatoslav1313/chatapp.git)
cd chatapp
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a .env file in the backend/ directory:

```bash
PORT=3005
CLIENT_HOST=http://localhost:5173
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=chatApp
JWT_KEY=your_secret_jwt_key
JWT_REFRESH_KEY=your_secret_refresh_key
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

In a new terminal window, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a .env file in the frontend/ directory:

```bash
VITE_API_URL=http://localhost:3005
VITE_WS_URL=ws://localhost:3005
```

Run the Vite development server:

```bash
npm run dev
```

🌐 The application will be accessible at: http://localhost:5173

## 🌐 Live Demo & Deployment

🔗 **Live Application:** [https://chatapp-nine-jade.vercel.app/](https://chatapp-nine-jade.vercel.app/)

The application is currently deployed and hosted across the following cloud services:

| Component    | Provider                        | Live Infrastructure                                                                                             |
| :----------- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [▲ Vercel](https://vercel.com)  | Hosted at [chatapp-nine-jade.vercel.app](https://chatapp-nine-jade.vercel.app/) (SPA build optimized with Vite) |
| **Backend**  | [🚀 Render](https://render.com) | Node.js / Express Web Service with WebSockets                                                                   |
| **Database** | [🐘 Neon](https://neon.tech)    | Serverless PostgreSQL                                                                                           |
