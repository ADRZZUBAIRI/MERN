// File: backend/routes/books.js
const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Apply protect middleware to all book routes
router.use(protect);

// Define routes
router.route('/')
  .get(getBooks)
  .post(createBook);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
