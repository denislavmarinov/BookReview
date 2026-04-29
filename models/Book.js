import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  publishedYear: Number
});

export default mongoose.model("Book", BookSchema);
