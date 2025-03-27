import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";
import nodemailer from 'nodemailer';
const secret = "test";

// Fonction de validation d'email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Utilise Gmail ou un autre service d'email
  auth: {
    user: process.env.EMAIL_USER,  // Ton adresse email, à définir dans le .env
    pass: process.env.EMAIL_PASS,  // Le mot de passe de ton email, à définir dans le .env
  },
});

// Fonction pour envoyer un email avec le lien de réinitialisation
export const sendResetEmail = (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Ton email
    to: email,  // L'email de l'utilisateur
    subject: 'Password Reset Request',
    text: `Click on the link to reset your password: ${resetLink}`,
  };

  // Envoi de l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return { success: false, message: "Failed to send email" };
    }
    console.log('Email sent: ' + info.response);
    return { success: true, message: "Password reset link sent" };
  });
};

// Fonction de validation du mot de passe
const validatePassword = (password) => {
  return password.length >= 6;
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const oldUser = await UserModal.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });
    
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const oldUser = await UserModal.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }

    const result = await UserModal.create({
      email,
      name,
      googleId,
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

// Ajout de la fonction forgotPassword
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Générer un token de réinitialisation
    const resetToken = jwt.sign({ email: user.email }, secret, { expiresIn: "1h" });
    
    // Envoie de l'email avec le token (à implémenter avec un service comme nodemailer)
    res.status(200).json({ message: "Password reset link sent", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Ajout de la fonction resetPassword
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, secret);
    const user = await UserModal.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Mettre à jour le mot de passe de l'utilisateur
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
