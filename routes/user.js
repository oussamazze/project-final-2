import express from "express";
const router = express.Router();
import { signup, signin, googleSignIn, forgotPassword, resetPassword } from "../controllers/user.js"; // Assure-toi d'importer toutes les fonctions nécessaires

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
router.post("/forgot-password", forgotPassword);  // Route pour la réinitialisation du mot de passe
router.post("/reset-password/:token", resetPassword);  // Route pour réinitialiser le mot de passe

export default router;
