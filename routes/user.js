import express from "express";
const router = express.Router();

import { signup, signin, googleSignIn } from "../controllers/user.js";

// Middleware pour corriger les erreurs de sécurité Google Sign-In
router.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com;");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/googleSignIn", googleSignIn);

export default router;
