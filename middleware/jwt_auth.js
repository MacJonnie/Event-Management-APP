import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Invalid or No Token' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.API_SECRET);
    req.user = {id: decoded.id, username: decoded.username};
    console.log("Authenticated USER ID:", req.user.id);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Error validating token' });
  }
};

export default verifyToken;
