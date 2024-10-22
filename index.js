const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 3030;
const app = express();
const authRoute=require("./routes/authRoutes")
const bookRoute=require("./routes/bookRoutes")
const borrowRoute=require("./routes/borrowRoutes")
// middleware

app.use(cors());
app.use(express.json());

// routes

app.use("/api/users",authRoute)
app.use("/api/books",bookRoute)
app.use("/api/borrow",borrowRoute)

// mongodb connection

mongoose
  .connect("mongodb://localhost:27017/librarydb")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("database not connected", err);
  });

// server running

app.listen(port, () => {
  console.log(`server running in ${port}`);
});
