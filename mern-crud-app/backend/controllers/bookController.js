// File: backend/controllers/bookController.js
const Book = require("../models/Book");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const getBooks = async (req, res) => {
  try {
    const { assignedToStudent } = req.query;
    let query = {};
    if (assignedToStudent) {
      if (!mongoose.Types.ObjectId.isValid(assignedToStudent)) {
        return res
          .status(400)
          .json({ message: "Invalid student ID format for query" });
      }
      query.assignedStudents = assignedToStudent;
    }
    const books = await Book.find(query)
      .populate("createdBy")
      .populate("assignedStudents");
    res.status(200).json(books);
  } catch (error) {
    console.error("Get Books Error:", error.message, error.stack);
    res.status(500).json({ message: "Server Error while fetching books" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("createdBy")
      .populate("assignedStudents");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Get Book By ID Error:", error.message, error.stack);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res
      .status(500)
      .json({ message: "Server Error while fetching single book" });
  }
};

const createBook = async (req, res) => {
  const { title, author, isbn, publishedYear, assignedStudents } = req.body;
  if (!title || !author || !isbn) {
    return res
      .status(400)
      .json({ message: "Please provide title, author, and ISBN" });
  }
  try {
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: `Book with ISBN ${isbn} already exists` });
    }
    if (assignedStudents && assignedStudents.length > 0) {
      for (const studentId of assignedStudents) {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
          return res
            .status(400)
            .json({ message: `Invalid student ID format: ${studentId}` });
        }
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
          return res
            .status(404)
            .json({ message: `Student with ID ${studentId} not found.` });
        }
      }
    }
    const newBook = new Book({
      title,
      author,
      isbn,
      publishedYear,
      createdBy: req.user.id,
      assignedStudents: assignedStudents || [],
    });
    const savedBook = await newBook.save();
    const populatedBook = await Book.findById(savedBook._id)
      .populate("createdBy")
      .populate("assignedStudents");
    res.status(201).json(populatedBook);
  } catch (error) {
    console.error("Create Book Error:", error.message, error.stack);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error while creating book" });
  }
};

const updateBook = async (req, res) => {
  const { title, author, isbn, publishedYear, assignedStudents } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (isbn && isbn !== book.isbn) {
      const existingBookWithIsbn = await Book.findOne({ isbn: isbn });
      if (
        existingBookWithIsbn &&
        existingBookWithIsbn._id.toString() !== req.params.id
      ) {
        return res
          .status(400)
          .json({ message: `Another book with ISBN ${isbn} already exists` });
      }
    }
    if (assignedStudents) {
      if (assignedStudents.length > 0) {
        for (const studentId of assignedStudents) {
          if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res
              .status(400)
              .json({ message: `Invalid student ID format: ${studentId}` });
          }
          const studentExists = await Student.findById(studentId);
          if (!studentExists) {
            return res
              .status(404)
              .json({ message: `Student with ID ${studentId} not found.` });
          }
        }
      }
      book.assignedStudents = assignedStudents;
    }
    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.isbn = isbn ?? book.isbn;
    book.publishedYear = publishedYear ?? book.publishedYear;
    const savedBook = await book.save();
    const populatedBook = await Book.findById(savedBook._id)
      .populate("createdBy")
      .populate("assignedStudents");
    res.status(200).json(populatedBook);
  } catch (error) {
    console.error("Update Book Error:", error.message, error.stack);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server Error while updating book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.deleteOne();
    res
      .status(200)
      .json({ message: "Book removed successfully", id: req.params.id });
  } catch (error) {
    console.error("Delete Book Error:", error.message, error.stack);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server Error while deleting book" });
  }
};
module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
