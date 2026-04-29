import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  rating: Number,
  comment: String
});

ReviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
