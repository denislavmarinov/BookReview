import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// MODELS
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Genre from "./models/Genre.js";
import User from "./models/User.js";
import Review from "./models/Review.js";

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT TO MONGO
mongoose.connect("mongodb://localhost:27017/book_review")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// =========================
//       AGGREGATION
// =========================
app.get("/stats", async (req, res) => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: "$bookId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book"
      }
    },
    { $unwind: "$book" },
    {
      $lookup: {
        from: "authors",
        localField: "book.authorId",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "genres",
        localField: "book.genreId",
        foreignField: "_id",
        as: "genre"
      }
    },
    { $unwind: "$genre" },
    {
      $project: {
        bookId: "$book._id",
        title: "$book.title",
        author: "$author.name",
        genre: "$genre.name",
        averageRating: { $round: ["$averageRating", 2] },
        totalReviews: 1
      }
    }
  ]);

  res.json(stats);
});


// =========================
//          BOOKS
// =========================
app.get("/books", async (req, res) => {
  const books = await Book.find().populate("authorId").populate("genreId");
  const formatted = books.map(b => ({
    _id: b._id,
    title: b.title,
    author: b.authorId?.name,
    genre: b.genreId?.name,
    authorId: b.authorId?._id,
    genreId: b.genreId?._id,
    publishedYear: b.publishedYear
  }));
  res.json(formatted);
});

app.post("/books", async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.put("/books/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// =========================
//         AUTHORS
// =========================
app.get("/authors", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

app.post("/authors", async (req, res) => {
  const author = await Author.create(req.body);
  res.json(author);
});

app.put("/authors/:id", async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(author);
});

app.delete("/authors/:id", async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// =========================
//         GENRES
// =========================
app.get("/genres", async (req, res) => {
  const genres = await Genre.find();
  res.json(genres);
});

app.post("/genres", async (req, res) => {
  const genre = await Genre.create(req.body);
  res.json(genre);
});

app.put("/genres/:id", async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(genre);
});

app.delete("/genres/:id", async (req, res) => {
  await Genre.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// =========================
//         USERS
// =========================
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// =========================
//         REVIEWS
// =========================
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find()
    .populate("userId")
    .populate("bookId");

  const formatted = reviews.map(r => ({
    _id: r._id,
    user: r.userId?.name,
    book: r.bookId?.title,
    rating: r.rating,
    comment: r.comment,
    userId: r.userId?._id,
    bookId: r.bookId?._id
  }));

  res.json(formatted);
});

app.post("/reviews", async (req, res) => {
  const review = await Review.create(req.body);
  res.json(review);
});

app.put("/reviews/:id", async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(review);
});

app.delete("/reviews/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// =========================
//       START SERVER
// =========================
app.listen(4000, () => console.log("Server running on port 4000"));
