import Message from "../model/MessagesModel.js";
import { renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("Both user IDs are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    console.log("Upload file request received");
    console.log("Request file:", request.file);
    
    if (!request.file) {
      console.log("No file in request");
      return response.status(400).json({ message: "File is required." });
    }

    console.log("File received:", request.file.originalname);
    console.log("File path:", request.file.path);
    console.log("File size:", request.file.size);
    
    // File is already saved by multer, just return the path
    const fileUrl = request.file.path;
    
    console.log("File saved to:", fileUrl);
    
    return response.status(200).json({ 
      fileUrl: fileUrl,
      message: "File uploaded successfully" 
    });
  } catch (error) {
    console.log("Upload error:", error);
    return response.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};