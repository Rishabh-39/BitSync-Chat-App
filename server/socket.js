import { Server as SocketIOServer } from "socket.io";
import Message from "./model/MessagesModel.js";
import Channel from "./model/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: true,
      credentials: true,
    },
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
    const { sender, recipient } = message;

    const createdMessage = await Message.create(message);

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
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      sender,
      content,
      messageType,
      fileUrl,
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
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log("User connected:", userId);
    }

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("add-channel-notify", addChannelNotify);

    socket.on("disconnect", () => {
      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.delete(key);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocket;