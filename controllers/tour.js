import TourModal from "../models/tour.js";
import mongoose from "mongoose";
import UserModal from "../models/user.js"; 

export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new TourModal({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exists with id: ${id}` });
    }

    const tour = await TourModal.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const commentIndex = tour.comments.findIndex((c) => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (tour.comments[commentIndex].userId !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    tour.comments.splice(commentIndex, 1);
    const updatedTour = await TourModal.findByIdAndUpdate(id, tour, { new: true });

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};


export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    // const tours = await TourModal.find();
    // res.status(200).json(tours);

    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await TourModal.countDocuments({});
    const tours = await TourModal.find().limit(limit).skip(startIndex);
    res.json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await TourModal.findById(id);
    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursByUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const userTours = await TourModal.find({ creator: id });
  res.status(200).json(userTours);
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  console.log("🗑️ Tentative de suppression du tour avec ID:", id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ ID invalide");
      return res.status(404).json({ message: `No tour exists with id: ${id}` });
    }

    const deletedTour = await TourModal.findByIdAndDelete(id); // ✅ Correction ici

    if (!deletedTour) {
      console.log("❌ Tour introuvable");
      return res.status(404).json({ message: `Tour not found with id: ${id}` });
    }

    console.log("✅ Tour supprimé avec succès");
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.log("❌ Erreur serveur:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const updatedTour = {
      creator,
      title,
      description,
      tags,
      imageFile,
      _id: id,
    };
    await TourModal.findByIdAndUpdate(id, updatedTour, { new: true });
    res.json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const tours = await TourModal.find({ title });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await TourModal.find({ tags: { $in: tag } });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getRelatedTours = async (req, res) => {
  const tags = req.body;
  try {
    const tours = await TourModal.find({ tags: { $in: tags } });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const likeTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const tour = await TourModal.findById(id);

    const index = tour.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await TourModal.findByIdAndUpdate(id, tour, {
      new: true,
    });

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const commentTour = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exists with id: ${id}` });
    }

    const tour = await TourModal.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Vérifier si l'utilisateur existe
    const user = await UserModal.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: req.userId,
      userName: user.name,  // Assurez-vous que user.name existe bien
      text: comment,
      createdAt: new Date(),
    };

    tour.comments.push(newComment);
    const updatedTour = await TourModal.findByIdAndUpdate(id, tour, { new: true });

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un commentaire :", error);  // Debug
    res.status(500).json({ message: "Something went wrong", error });
  }
};



