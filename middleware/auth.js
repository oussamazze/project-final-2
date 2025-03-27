import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    // Vérifier si le token est présent dans les headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    
    if (!token) {
      return res.status(403).json({ message: "Authentication token is missing" });
    }

    const isCustomAuth = token.length < 500;
    let decodedData;

    if (token && isCustomAuth) {
      // Token personnalisé (JWT classique)
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      // Google token (plus long)
      decodedData = jwt.decode(token);
      const googleId = decodedData?.sub?.toString();

      if (!googleId) {
        return res.status(403).json({ message: "Google authentication failed" });
      }

      const user = await UserModel.findOne({ googleId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.userId = user._id;
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Something went wrong during authentication" });
  }
};

export default auth;
