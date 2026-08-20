import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import { existsSync, readdirSync } from "fs";
import errorHandler from "./middlewares/errorHandler.js";
import requestLogger from "./middlewares/requestLogger.js";

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
      "http://localhost:5174",
      "http://localhost:5175",
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

// Request logger - logs all incoming requests to terminal
app.use(requestLogger);

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

// 404 handler - catch requests to undefined routes
app.use((req, res) => {
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler - MUST be after all routes
app.use(errorHandler);

// Initialize Prisma Client with logging
export const prisma = new PrismaClient({
  log: [
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});
prisma.$connect()
  .then(() => console.log("✅ Database connected via Prisma"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    console.error("   Make sure PostgreSQL is running and the DATABASE_URL in .env is correct");
    process.exit(1);
  });

// Start server with socket
const server = app.listen(port, () => {
  console.log("\n" + "=".repeat(50));
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📁 Static files: http://localhost:${port}/uploads`);
  console.log(`🔌 Socket.IO enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(50) + "\n");
});

// Handle server errors (like EADDRINUSE)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${port} is already in use!`);
    console.error(`   Run: lsof -ti:${port} | xargs kill -9`);
    console.error(`   Then restart the server.\n`);
  } else {
    console.error("❌ Server error:", err);
  }
  process.exit(1);
});

// Setup socket
setupSocket(server);

// ─── Unhandled Error Catchers ───────────────────────────────
// These catch errors that aren't caught by try/catch blocks

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n" + "=".repeat(60));
  console.error("❌ UNHANDLED PROMISE REJECTION");
  console.error("   Reason:", reason);
  console.error("=".repeat(60) + "\n");
});

process.on("uncaughtException", (err) => {
  console.error("\n" + "=".repeat(60));
  console.error("💥 UNCAUGHT EXCEPTION - Server shutting down");
  console.error("   Error:", err.message);
  console.error("   Stack:", err.stack);
  console.error("=".repeat(60) + "\n");
  // Graceful shutdown
  prisma.$disconnect().finally(() => process.exit(1));
});

// Graceful shutdown on SIGTERM/SIGINT
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("   HTTP server closed");
    prisma.$disconnect().then(() => {
      console.log("   Database disconnected");
      console.log("   Goodbye! 👋\n");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));