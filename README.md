<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=200&section=header&text=BitSync&fontSize=80&fontColor=white&fontAlignY=38&desc=Chat%20in%20Real-Time.%20No%20delays.%20No%20hassle.&descAlignY=60&descSize=18" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-667eea?style=for-the-badge)](https://bit-sync-chat-app.vercel.app)

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

## 🌐 Where it's hosted

| What | Where |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## 🙋‍♂️ Made by

<div align="center">

**Rishabh Tomar😉**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/rishabh-tomar-8a7885243/)
[![Email](https://img.shields.io/badge/Email-Say%20Hi-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rishabhtomar.in@gmail.com)

</div>

---

<div align="center">

If this project helped you or you liked it, drop a ⭐ — it means a lot!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=100&section=footer"/>

</div>
