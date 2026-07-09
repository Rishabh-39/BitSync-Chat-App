import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check for token in cookies first
  let token = req.cookies?.jwt;
  
  // If not in cookies, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    return res.status(403).json({ message: "Token is not valid!" });
  }
};