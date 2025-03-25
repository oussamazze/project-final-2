import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: String,
  tags: [String],
  imageFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
  comments: [
    {
      userId: String,
      userName: String,  // Ajout du nom de l'utilisateur
      text: String,
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const TourModal = mongoose.model("Tour", tourSchema);

export default TourModal;
