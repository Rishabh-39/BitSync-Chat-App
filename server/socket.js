import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./index.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://bit-sync-chat-app.vercel.app",
        "https://bit-sync-chat-app-git-main-rishabh-39s-projects.vercel.app",
      ],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const userSocketMap = new Map();

  const addChannelNotify = async (channel) => {
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        // Handle both Prisma arrays of objects and arrays of IDs
        const memberId = typeof member === 'object' && member !== null && 'id' in member ? member.id : member.toString();
        const socketId = userSocketMap.get(memberId);
        if (socketId) {
          io.to(socketId).emit("new-channel-added", channel);
        }
      });
    }
  };

  const sendMessage = async (message) => {
    try {
      const { sender, recipient, content, messageType, fileUrl } = message;

      const createdMessage = await prisma.message.create({
        data: {
          senderId: sender,
          recipientId: recipient,
          content,
          messageType,
          fileUrl: fileUrl || null,
        },
        include: {
          sender: {
            select: { id: true, email: true, firstName: true, lastName: true, image: true, color: true }
          },
          recipient: {
            select: { id: true, email: true, firstName: true, lastName: true, image: true, color: true }
          }
        }
      });

      // Map for frontend compatibility
      const messageData = {
        ...createdMessage,
        _id: createdMessage.id,
        sender: {
          ...createdMessage.sender,
          _id: createdMessage.sender.id,
        },
        recipient: {
          ...createdMessage.recipient,
          _id: createdMessage.recipient.id,
        }
      };

      const senderSocket = userSocketMap.get(sender);
      const recipientSocket = userSocketMap.get(recipient);

      if (recipientSocket) {
        io.to(recipientSocket).emit("receiveMessage", messageData);
      }

      if (senderSocket) {
        io.to(senderSocket).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await prisma.message.create({
        data: {
          senderId: sender,
          channelId: channelId,
          content,
          messageType,
          fileUrl: fileUrl || null,
        },
        include: {
          sender: {
            select: { id: true, email: true, firstName: true, lastName: true, image: true, color: true }
          }
        }
      });

      // Fetch channel members to broadcast
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { members: true }
      });

      if (channel && channel.members) {
        // Map message for frontend compatibility
        const messageData = {
          ...createdMessage,
          _id: createdMessage.id,
          channelId,
          sender: {
            ...createdMessage.sender,
            _id: createdMessage.sender.id,
          }
        };

        channel.members.forEach((member) => {
          const socketId = userSocketMap.get(member.id);
          if (socketId) {
            io.to(socketId).emit("recieve-channel-message", messageData);
          }
        });
      }
    } catch (error) {
      console.error("Send channel message error:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log("User connected:", userId);
      console.log("Socket ID:", socket.id);
      console.log("Total connected users:", userSocketMap.size);
    }

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("add-channel-notify", addChannelNotify);

    socket.on("disconnect", () => {
      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.delete(key);
          console.log("User disconnected:", key);
          break;
        }
      }
      console.log("Total connected users:", userSocketMap.size);
    });
  });

  return io;
};

export default setupSocket;