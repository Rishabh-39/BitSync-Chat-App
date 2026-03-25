<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=200&section=header&text=BitSync&fontSize=80&fontColor=white&fontAlignY=38&desc=Chat%20in%20Real-Time.%20No%20delays.%20No%20hassle.&descAlignY=60&descSize=18" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Try%20it%20Now-667eea?style=for-the-badge)](https://bit-sync-chat-app.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/Rishabh-39/BitSync-Chat-App)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

![React](https://img.shields.io/badge/React.js-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## 💬 What is BitSync?

BitSync is a **real-time chat app** where you can send messages to friends or groups — and they receive it instantly, no page refresh needed.

You can also **share files and images**, create group chats, and log in securely. Everything is saved so your chat history is always there when you come back.

> ⚡ Messages deliver in under 100ms &nbsp;·&nbsp; 🔐 Login is secured with JWT &nbsp;·&nbsp; 📱 Works on mobile and desktop

---

## ✨ What can you do with it?

| Feature | What it does |
|---|---|
| ⚡ **Instant Messaging** | Send and receive messages in real time — no delay |
| 👤 **One-to-One Chat** | Private chat between two users |
| 👥 **Group Chat** | Talk with multiple people in one place |
| 🔐 **Login & Signup** | Secure accounts using JWT tokens |
| 📁 **File Sharing** | Send images and documents inside chats |
| 💾 **Chat History** | All messages are saved — nothing is lost |
| 📱 **Responsive Design** | Clean UI that works on any screen size |

---

## 🛠️ Built With

| Part | Tools Used |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployed On** | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
BitSync-Chat-App/
│
├── client/               # Everything the user sees (React)
│   └── src/
│       ├── components/   # Buttons, chat bubbles, input boxes, etc.
│       ├── pages/        # Login page, Register page, Chat page
│       ├── context/      # Shared data — socket connection, logged-in user
│       └── utils/        # Helper functions for API calls
│
├── server/               # Everything on the backend (Node.js)
│   ├── controllers/      # Logic for login, messages, channels
│   ├── models/           # Database structure (User, Message, Channel)
│   ├── routes/           # API URL paths
│   ├── middleware/        # Checks if user is logged in before each request
│   └── socket/           # Handles real-time message events
│
└── README.md
```

---

## ⚙️ How real-time messaging works

It's simpler than it sounds:

```
You type a message and hit send
        ↓
Your browser sends it to the server instantly (via Socket.IO)
        ↓
The server passes it to the other person's browser
        ↓
Their screen updates — without refreshing the page
        ↓
The message is also saved in MongoDB so it stays there
```

That whole process takes **less than 100ms.**

---

## 🚀 Run it on your own machine

### What you need first
- Node.js (v18 or above)
- A MongoDB Atlas account (free tier works fine)
- npm

### Step 1 — Download the code
```bash
git clone https://github.com/Rishabh-39/BitSync-Chat-App.git
cd BitSync-Chat-App
```

### Step 2 — Set up the backend
```bash
cd server
npm install
```

Make a file called `.env` inside the `/server` folder and add this:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_secret_word_you_choose
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### Step 3 — Set up the frontend
```bash
cd client
npm install
```

Make a `.env` file inside `/client`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```

### Step 4 — Open in your browser
```
http://localhost:3000
```

---

## 🔌 API Routes (quick overview)

| Method | Route | What it does |
|--------|-------|--------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Log in and get a token |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/messages/:channelId` | Load messages for a chat |
| `POST` | `/api/messages` | Send a message |
| `POST` | `/api/channels` | Create a group chat |
| `POST` | `/api/upload` | Upload a file or image |

---

## 🌐 Where it's hosted

| What | Where |
|---|---|
| Frontend | [Vercel](https://bit-sync-chat-app.vercel.app) |
| Backend | Render (auto-deploys when code is pushed to GitHub) |
| Database | MongoDB Atlas (cloud, always online) |

---

## 📸 Screenshots

> _Drop your app screenshots here — login screen, chat window, group chat, file sharing_

---

## 🙋‍♂️ Made by

<div align="center">

**Rishabh Tomar**
B.Tech Electronics Engineering — RGIPT

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/rishabh-tomar-8a7885243/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/Rishabh-39)
[![Email](https://img.shields.io/badge/Email-Say%20Hi-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rishabhtomar.in@gmail.com)

</div>

---

<div align="center">

If this project helped you or you liked it, drop a ⭐ — it means a lot!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=100&section=footer"/>

</div>
