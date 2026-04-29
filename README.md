# 📚 Book Review Platform — Full Database Documentation
**Database name:** `book_review`  
**Database engine:** MongoDB  
**ODM:** Mongoose (Node.js)

---

# 🧩 1. Overview
This document describes the complete database architecture of the **Book Review Platform**, including:

- MongoDB collections  
- Mongoose schemas  
- Entity relationships  
- CRUD API endpoints  
- Aggregation pipelines  
- Indexing strategy  
- Example documents  

The documentation follows standard technical documentation conventions suitable for production systems, university projects, and professional READMEs.

---

# 🗄️ 2. Database Schema (MongoDB)

The database contains the following collections:

```
books
authors
genres
users
reviews
```

## 🔗 Entity Relationship Diagram (ERD)

```
Author 1 ────< Book >──── 1 Genre
                     │
                     │ 1 ────< Review >──── 1 User
```

---

# 📘 3. Books Collection

### Collection: `books`
Stores all books available in the platform.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `title` | String | Book title |
| `authorId` | ObjectId (ref: authors) | Author reference |
| `genreId` | ObjectId (ref: genres) | Genre reference |
| `publishedYear` | Number | Year of publication |

### Mongoose Schema
```js
const BookSchema = new mongoose.Schema({
  title: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
  publishedYear: Number
});
```

---

# 🧑‍💻 4. Authors Collection

### Collection: `authors`
Stores author information.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | String | Author name |
| `country` | String | Country of origin |
| `birthYear` | Number | Year of birth |

### Mongoose Schema
```js
const AuthorSchema = new mongoose.Schema({
  name: String,
  country: String,
  birthYear: Number
});
```

---

# 🎭 5. Genres Collection

### Collection: `genres`
Stores book genres.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | String | Genre name |
| `description` | String | Genre description |

### Mongoose Schema
```js
const GenreSchema = new mongoose.Schema({
  name: String,
  description: String
});
```

---

# 👤 6. Users Collection

### Collection: `users`
Stores platform users.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | String | User name |
| `email` | String | User email |

### Mongoose Schema
```js
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
```

---

# ⭐ 7. Reviews Collection

### Collection: `reviews`
Stores user reviews for books.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `userId` | ObjectId (ref: users) | User reference |
| `bookId` | ObjectId (ref: books) | Book reference |
| `rating` | Number | Rating (1–5) |
| `comment` | String | Review text |

### Mongoose Schema
```js
const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  rating: Number,
  comment: String
});
```

---

# 📊 8. Aggregation Pipeline (`/stats`)

This endpoint returns:
- Average rating per book  
- Total number of reviews  
- Book title  
- Author name  
- Genre name  

### Aggregation Pipeline
```js
Review.aggregate([
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
```

---

# 🔧 9. CRUD API Endpoints

## Books
```
GET /books
POST /books
PUT /books/:id
DELETE /books/:id
```

## Authors
```
GET /authors
POST /authors
PUT /authors/:id
DELETE /authors/:id
```

## Genres
```
GET /genres
POST /genres
PUT /genres/:id
DELETE /genres/:id
```

## Users
```
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
```

## Reviews
```
GET /reviews
POST /reviews
PUT /reviews/:id
DELETE /reviews/:id
```

---

# 🧪 10. Example Documents

## Book
```json
{
  "_id": "65a123abc",
  "title": "Clean Code",
  "authorId": "65a111aaa",
  "genreId": "65a222bbb",
  "publishedYear": 2008
}
```

## Review
```json
{
  "_id": "65a555ccc",
  "userId": "65a444ddd",
  "bookId": "65a123abc",
  "rating": 5,
  "comment": "Excellent book!"
}
```

---

# 🧱 11. Recommended Indexes

```js
BookSchema.index({ title: 1 });
ReviewSchema.index({ bookId: 1 });
ReviewSchema.index({ userId: 1 });
AuthorSchema.index({ name: 1 });
GenreSchema.index({ name: 1 });
```

# 🧩 12. Requirements

Before installing, make sure you have:

- **Node.js LTS (v18 or v20 recommended)**  
- **npm** (comes with Node.js)  
- **MongoDB Community Server** running locally  
- **Git** (optional)

Check versions:

```bash
node -v
npm -v
```

---

# 📁 13. Project Structure

```
project-root/
│
├── backend/              # Express + MongoDB API
│   ├── models/
│   ├── server.js
│   └── package.json
│
└── book-review-ui/       # React + Vite frontend
    ├── src/
    ├── App.jsx
    ├── App.css
    └── package.json
```

---

# 🗄️ 14. Database Setup (MongoDB)

The backend uses a MongoDB database named:

```
book_review
```

Make sure MongoDB is running:

```bash
mongod
```

Or if using MongoDB Compass, simply open it — it starts the service automatically.

---

# 🛠️ 15. Backend Installation (Express API)

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
node server.js
```

If everything is correct, you should see:

```
MongoDB connected (book_review)
Server running on port 4000
```

Backend is now available at:

```
http://localhost:4000
```

---

# 🎨 16. Frontend Installation (React + Vite)

Navigate to the frontend folder:

```bash
cd book-review-ui
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

You will see something like:

```
VITE v5.0.0  ready in 300ms
Local: http://localhost:5173/
```

Open the link in your browser.

---

# 🚀 17. Running the Full Application

### Step 1 — Start MongoDB  
Make sure MongoDB is running.

### Step 2 — Start Backend  
```bash
cd backend
node server.js
```

### Step 3 — Start Frontend  
```bash
cd book-review-ui
npm run dev
```

### Step 4 — Open the App  
Go to:

```
http://localhost:5173
```

---

# 🧪 18. Optional: Seed the Database

If you have a `seed.js` file, run:

```bash
node seed.js
```

This will populate:

- authors  
- genres  
- users  
- books  
- reviews  
