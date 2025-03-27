import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function() { return !this.googleId; } },
    googleId: { type: String, required: false },
    resetToken: { type: String, default: null }, // Token pour réinitialisation du mot de passe
    resetTokenExpires: { type: Date, default: null }, // Expiration du token
  },
  { timestamps: true }
);

// Ajout de validation unique sur l'email pour éviter les doublons
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
