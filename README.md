# 💬 ChatApp

A modern full-stack real-time messenger featuring direct messaging, global user search, and JWT authentication.

---

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

---

## ✨ Key Features

- 🔐 **Authentication:** User registration, login, and secure session management.
- ⚡ **Real-time Chat:** Instant message delivery without page reloads.
- 🔍 **Smart Search:** Debounced global user search by nickname to prevent unnecessary API requests.
- 💬 **Direct Chats:** Automatic creation and instant redirection to private conversations.
