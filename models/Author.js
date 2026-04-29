import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  name: String,
  country: String,
  birthYear: Number
});

export default mongoose.model("Author", AuthorSchema);
