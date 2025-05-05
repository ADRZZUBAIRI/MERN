// File: backend/models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true,
  },
  publishedYear: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Link to the user who added the book
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   }
});

module.exports = mongoose.model('Book', BookSchema);
