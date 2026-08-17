import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import { existsSync, readdirSync } from "fs";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://bit-sync-chat-app.vercel.app",
      "https://bit-sync-chat-app-git-main-rishabh-39s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
  })
);

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, Set-Cookie");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser());

// ✅ FIXED: Serve static files with absolute path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/debug-uploads", (req, res) => {
  const uploadsPath = path.join(__dirname, "uploads");
  const filesPath = path.join(__dirname, "uploads", "files");
  
  let filesList = [];
  if (existsSync(filesPath)) {
    filesList = readdirSync(filesPath);
  }
  
  res.json({
    uploadsExists: existsSync(uploadsPath),
    filesExists: existsSync(filesPath),
    files: filesList,
    uploadsPath: uploadsPath,
    __dirname: __dirname
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err.message);
  });

// Start server with socket
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Setup socket
setupSocket(server);