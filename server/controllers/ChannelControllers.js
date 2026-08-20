import { prisma } from "../index.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;
    const admin = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!admin) {
      return response.status(400).json({ message: "Admin user not found." });
    }

    const validMembers = await prisma.user.findMany({
      where: { id: { in: members } },
    });
    
    if (validMembers.length !== members.length) {
      return response
        .status(400)
        .json({ message: "Some members are not valid users." });
    }

    // Map members to the format Prisma expects for connection
    const memberConnections = members.map((memberId) => ({ id: memberId }));

    const newChannel = await prisma.channel.create({
      data: {
        name,
        adminId: userId,
        members: {
          connect: memberConnections,
        },
      },
    });

    // Map for frontend compatibility
    const channelToReturn = {
      ...newChannel,
      _id: newChannel.id,
      admin: newChannel.adminId
    };

    return response.status(201).json({ channel: channelToReturn });
  } catch (error) {
    console.error("Error creating channel:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = req.userId;
    const channels = await prisma.channel.findMany({
      where: {
        OR: [
          { adminId: userId },
          { members: { some: { id: userId } } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });

    // Map for frontend compatibility
    const mappedChannels = channels.map(c => ({
      ...c,
      _id: c.id,
      admin: c.adminId
    }));

    return res.status(200).json({ channels: mappedChannels });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                color: true,
              },
            },
          },
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Map sender.id to sender._id and message.id to message._id for frontend compatibility
    const messages = channel.messages.map(msg => ({
      ...msg,
      _id: msg.id,
      sender: {
        ...msg.sender,
        _id: msg.sender.id,
      }
    }));

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting channel messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
