import { prisma } from "../index.js";
import path from "path";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("Both user IDs are required.");
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, recipientId: user2 },
          { senderId: user2, recipientId: user1 },
        ],
      },
      orderBy: { timestamp: "asc" },
      // Include sender and recipient relations if the frontend expects them. 
      // The original mongoose code just returned the documents. Mongoose .find() returns IDs for refs unless .populate() is used.
      // Since it wasn't populated in the original mongoose code, we don't include relations here.
    });

    // The frontend might expect the ID fields to be named 'sender' and 'recipient' instead of 'senderId' and 'recipientId'.
    // Let's map them to match the old Mongoose shape.
    const mappedMessages = messages.map(msg => ({
      ...msg,
      _id: msg.id, // Mongoose id
      sender: msg.senderId,
      recipient: msg.recipientId,
    }));

    return res.status(200).json({ messages: mappedMessages });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    console.log("Upload file request received");
    
    if (!request.file) {
      console.log("No file in request");
      return response.status(400).json({ message: "File is required." });
    }

    console.log("File received:", request.file.originalname);
    console.log("File path:", request.file.path);
    
    // ✅ Get just the filename from the path
    const fileName = path.basename(request.file.path);
    
    // ✅ Return the URL WITHOUT the user ID subfolder
    // Since files are saved directly in uploads/files/
    const fileUrl = `/uploads/files/${fileName}`;
    
    console.log("File URL:", fileUrl);
    
    return response.status(200).json({ 
      fileUrl: fileUrl,
      message: "File uploaded successfully" 
    });
  } catch (error) {
    console.log("Upload error:", error);
    return response.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};