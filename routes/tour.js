import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import { 
  createTour,
  deleteTour,
  getRelatedTours,
  getTour,
  getTours,
  getToursBySearch,
  getToursByTag,
  getToursByUser,
  likeTour,
  updateTour,
  commentTour,
  deleteComment,  // Import de la fonction pour supprimer un commentaire
} from "../controllers/tour.js";

router.get("/search", getToursBySearch);
router.get("/tag/:tag", getToursByTag);
router.post("/relatedTours", getRelatedTours);
router.get("/", getTours);
router.get("/:id", getTour);

router.post("/", auth, createTour);
router.delete("/:id", deleteTour);
router.patch("/:id", auth, updateTour);
router.get("/userTours/:id", auth, getToursByUser);
router.patch("/like/:id", auth, likeTour);
router.post("/:id/comment", auth, commentTour);
router.delete("/:id/comment/:commentId", auth, deleteComment); // Nouvelle route pour supprimer un commentaire

export default router;
