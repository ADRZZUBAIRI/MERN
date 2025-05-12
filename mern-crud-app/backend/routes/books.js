const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.route('/').get(getBooks).post(createBook);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);
module.exports = router;

