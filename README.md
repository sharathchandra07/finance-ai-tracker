# 💰 AI Finance Tracker

A full-stack Finance Tracker built with **React + Express + MySQL**, featuring:
- Google OAuth login 🔑
- JWT-based authentication 🔐
- Transaction tracking (income & expenses) 📊
- AI-powered transaction parsing 🤖 (Groq API)
- Beautiful responsive UI ✨

---

## ⚡ Features
- ✅ User authentication via Google Sign-In  
- ✅ Add, update, delete, and view transactions  
- ✅ Automatic categorization & analytics  
- ✅ AI natural language parsing (e.g. `"Bought coffee for 120 on 2025-09-01"`)  
- ✅ MySQL database for persistent storage  
- ✅ Secure JWT authentication  
- ✅ Modern UI with Bootstrap + custom styling  

---

## 🛠 Tech Stack
- **Frontend**: React, Bootstrap, React Router  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **Authentication**: JWT, Google OAuth2  
- **AI Parsing**: Groq API (`groq-sdk`)  

---

## 📂 Project Structure
finance-tracker/
│
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ └── transactionController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ └── init.sql
│ ├── routes/
│ │ └── transactionRoutes.js
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── Auth.js
│ │ ├── api.js
│ │ └── index.js
│ └── package.json
│
└── README.md




---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/ai-finance-tracker.git
cd ai-finance-tracker

2️⃣ Backend Setup

cd backend
npm install

Create a .env file:

PORT=5000
JWT_SECRET=your_secret_key_here
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=finance_tracker
GOOGLE_CLIENT_ID=your_google_client_id
GROQ_API_KEY=your_groq_api_key


Import SQL schema:
mysql -u root -p < backend/models/init.sql

3️⃣ Frontend Setup
cd frontend
npm install
npm start


🔑 API Endpoints
Authentication

POST /auth/google → Login with Google

Transactions

GET /api/transactions → Get all transactions

POST /api/transactions → Add a transaction

PUT /api/transactions/:id → Update a transaction

DELETE /api/transactions/:id → Delete a transaction

AI Parsing

POST /api/transactions/parse
