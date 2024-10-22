const Book = require("../models/bookModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// creating a book
const addBook = asyncErrorHandler(async (req, res, next) => {
  try {
    const { author, title, genre, NumberOfCopies, ISBN, publicationDate } =
      req.body;
    const book = await Book.create(req.body);
    res.status(200).json({
      message: "book created successfully",
      status: "success",
      data: { book },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating book", error: error.message });
  }
});

// updating book
const updateBook = asyncErrorHandler(async (req, res, next) => {
  try {
    const { author, title, genre, NumberOfCopies, ISBN, publicationDate } =
      req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "updated successfully",
      status: "success",
      data: { book },
    });
  } catch (error) {
    next(error);
    res
      .status(400)
      .json({ message: "Error in updating book", error: error.message });
  }
});

// deleting book
const deleteBook = asyncErrorHandler(async (req, res, next) => {
  try {
    await Book.findOneAndDelete(req.params.id);
    res.status(200).json({
      message: "book deleted successfully",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

// getting all books with filters genre,author
const listBooks = asyncErrorHandler(async (req, res, next) => {
  try {
    const books = await Book.find().select("-createdAt");

    if (!books.length) {
      return res
        .status(404)
        .json({ message: "No books found in the collection." });
    }

    res.status(200).json({
      status: "success",
      results: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { addBook, updateBook, deleteBook, listBooks };
