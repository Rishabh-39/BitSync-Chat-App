import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);


mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
<<<<<<< HEAD
    console.log("DB Connection Successful");

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    setupSocket(server);
=======
    console.log("DB Connected");
>>>>>>> 8f8edf6 (frontend connected to backend)
  })
  .catch((err) => {
    console.log("DB Error:", err.message);
  });

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

setupSocket(server);