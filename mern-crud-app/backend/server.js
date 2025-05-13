const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose"); // Require Mongoose here

dotenv.config();
connectDB();

// mongoose.set('debug', true); // Optional: For verbose Mongoose query logging
mongoose.set("strictPopulate", false); // Suppress StrictPopulateError

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/students", require("./routes/students"));

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
