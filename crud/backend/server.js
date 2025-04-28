// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const { logger } = require("./middleware/logger");

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(logger); // Apply the logger middleware to all routes

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/schooldb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});