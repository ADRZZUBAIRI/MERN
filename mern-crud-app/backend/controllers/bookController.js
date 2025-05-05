// File: backend/controllers/bookController.js
const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Private (example, adjust as needed)
const getBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Add .populate('createdBy', 'username') if you link users
    res.status(200).json(books);
  } catch (error) {
    console.error('Get Books Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
     console.error('Get Book By ID Error:', error.message);
     // Handle CastError specifically if ID format is invalid
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid book ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  const { title, author, isbn, publishedYear } = req.body;

  // Basic validation
  if (!title || !author || !isbn) {
    return res.status(400).json({ message: 'Please provide title, author, and ISBN' });
  }

  try {
    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: `Book with ISBN ${isbn} already exists` });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      publishedYear,
      // createdBy: req.user.id // If linking to user
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Create Book Error:', error.message);
     // Handle Mongoose validation errors
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  const { title, author, isbn, publishedYear } = req.body;

  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Optional: Check if the user updating the book is the one who created it
    // if (book.createdBy && book.createdBy.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'User not authorized to update this book' });
    // }

    // Check if the updated ISBN conflicts with another existing book
    if (isbn && isbn !== book.isbn) {
        const existingBookWithIsbn = await Book.findOne({ isbn: isbn });
        if (existingBookWithIsbn && existingBookWithIsbn._id.toString() !== req.params.id) {
            return res.status(400).json({ message: `Another book with ISBN ${isbn} already exists` });
        }
    }


    // Update fields selectively
    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.isbn = isbn ?? book.isbn;
    book.publishedYear = publishedYear ?? book.publishedYear;

    const updatedBook = await book.save(); // Use save to trigger Mongoose middleware/validation if needed

    // Or use findByIdAndUpdate for simpler updates without middleware hooks:
    // const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true, // Return the updated document
    //   runValidators: true, // Run schema validators on update
    // });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Update Book Error:', error.message);
     // Handle Mongoose validation errors
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
     // Handle CastError specifically if ID format is invalid
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid book ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Optional: Check if the user deleting the book is the one who created it
    // if (book.createdBy && book.createdBy.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'User not authorized to delete this book' });
    // }

    await book.deleteOne(); // Use deleteOne on the document instance

    // Or use findByIdAndDelete:
    // await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Book removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Book Error:', error.message);
     // Handle CastError specifically if ID format is invalid
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid book ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
