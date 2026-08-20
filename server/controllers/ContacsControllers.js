import { prisma } from "../index.js";

export const getAllContacts = async (request, response, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { id: { not: request.userId } },
      select: { firstName: true, lastName: true, id: true },
    });

    const contacts = users.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (searchTerm === undefined || searchTerm === null) {
      return response.status(400).send("Search Term is required.");
    }

    const contacts = await prisma.user.findMany({
      where: {
        id: { not: request.userId },
        OR: [
          { firstName: { contains: searchTerm, mode: "insensitive" } },
          { lastName: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });

    // Map id to _id to match frontend expectations
    const mappedContacts = contacts.map(c => ({
      ...c,
      _id: c.id
    }));

    return response.status(200).json({ contacts: mappedContacts });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

export const getContactsForList = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).send("User ID is required.");
    }

    // Fetch all messages for this user ordered by latest first
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { timestamp: "desc" },
      include: {
        sender: true,
        recipient: true,
      },
    });

    const contactsMap = new Map();

    for (const msg of messages) {
      // If it's a channel message, ignore it in DMs list
      if (msg.channelId) continue;

      const isSender = msg.senderId === userId;
      const contactId = isSender ? msg.recipientId : msg.senderId;
      
      // Should not happen for DMs, but just in case
      if (!contactId) continue;

      if (!contactsMap.has(contactId)) {
        const contactInfo = isSender ? msg.recipient : msg.sender;
        contactsMap.set(contactId, {
          _id: contactId, // Map id to _id for frontend compatibility
          lastMessageTime: msg.timestamp,
          email: contactInfo.email,
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          image: contactInfo.image,
          color: contactInfo.color,
        });
      }
    }

    const contacts = Array.from(contactsMap.values());

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error getting user contacts:", error);
    return res.status(500).send("Internal Server Error");
  }
};
