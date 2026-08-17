import { Server as SocketIOServer } from "socket.io";
import Message from "./model/MessagesModel.js";
import Channel from "./model/ChannelModel.js";

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
        const socketId = userSocketMap.get(member.toString());
        if (socketId) {
          io.to(socketId).emit("new-channel-added", channel);
        }
      });
    }
  };

  const sendMessage = async (message) => {
    try {
      const { sender, recipient, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient,
        content,
        messageType,
        fileUrl: fileUrl || null,
        timestamp: new Date(),
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

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

      const createdMessage = await Message.create({
        sender,
        content,
        messageType,
        fileUrl: fileUrl || null,
        timestamp: new Date(),
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color");

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const channel = await Channel.findById(channelId).populate("members");

      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const socketId = userSocketMap.get(member._id.toString());
          if (socketId) {
            io.to(socketId).emit("recieve-channel-message", {
              ...messageData._doc,
              channelId,
            });
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