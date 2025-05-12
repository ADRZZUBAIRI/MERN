// File: backend/controllers/bookController.js
const Book = require("../models/Book");
const Student = require("../models/Student"); // Needed for validation if student IDs are valid

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    // Example: GET /api/books?assignedToStudent=studentId
    const { assignedToStudent } = req.query;
    let query = {};
    if (assignedToStudent) {
      query.assignedStudents = assignedToStudent; // Find books assigned to a specific student
    }

    const books = await Book.find(query)
      .populate("createdBy", "username email") // Populate user info
      .populate("assignedStudents", "name rollNumber"); // Populate assigned student info
    res.status(200).json(books);
  } catch (error) {
    console.error("Get Books Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("assignedStudents", "name rollNumber");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Get Book By ID Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
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

    // Validate assignedStudents if provided
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
      createdBy: req.user.id, // Set the creator from authenticated user
      assignedStudents: assignedStudents || [], // Default to empty array if not provided
    });

    const savedBook = await newBook.save();
    // Populate before sending response
    const populatedBook = await Book.findById(savedBook._id)
      .populate("createdBy", "username email")
      .populate("assignedStudents", "name rollNumber");
    res.status(201).json(populatedBook);
  } catch (error) {
    console.error("Create Book Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  const { title, author, isbn, publishedYear, assignedStudents } = req.body;

  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Authorization: Optional - check if the user updating is the creator
    // if (book.createdBy.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'User not authorized to update this book' });
    // }

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

    // Validate assignedStudents if provided
    if (assignedStudents) {
      // Check if assignedStudents is part of the request
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
    // createdBy should not be changed here

    const savedBook = await book.save();
    const populatedBook = await Book.findById(savedBook._id)
      .populate("createdBy", "username email")
      .populate("assignedStudents", "name rollNumber");
    res.status(200).json(populatedBook);
  } catch (error) {
    console.error("Update Book Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Authorization: Optional - check if the user deleting is the creator
    // if (book.createdBy.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'User not authorized to delete this book' });
    // }

    // Note: With the current simplified model, we don't need to update Student's assignedBooks array here.
    // If Student model had an assignedBooks array, we would need to pull this book's ID from those arrays.

    await book.deleteOne();
    res
      .status(200)
      .json({ message: "Book removed successfully", id: req.params.id });
  } catch (error) {
    console.error("Delete Book Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
