import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
  name: String,
  description: String
});

export default mongoose.model("Genre", GenreSchema);
