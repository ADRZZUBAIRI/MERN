// File: backend/routes/books.js
const express = require("express");
const bookCtrl = require("../controllers/bookController"); // Use a different alias
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
router.route("/").get(bookCtrl.getBooks).post(bookCtrl.createBook);
router
  .route("/:id")
  .get(bookCtrl.getBookById)
  .put(bookCtrl.updateBook)
  .delete(bookCtrl.deleteBook);
module.exports = router;
