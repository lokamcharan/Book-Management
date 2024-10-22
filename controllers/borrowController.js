const express = require("express");
const Borrow = require("../models/borrowModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Book = require("../models/bookModel");

const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    console.log(userId, bookId);

    // Check if both user and book fields are provided
    if (!userId && !bookId) {
      return res
        .status(400)
        .json({ message: "userId  and bookId is a required field" });
    }

    // Check if book is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ message: "book  not found" });
    }
    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
    });
    if (borrow.userId === userId && borrow.bookId === bookId) {
      return res.status(400).json({ message: "book is already borrowed" });
    }

    res.status(201).json({
      message: "Borrow created successfully",
      data: borrow,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating borrow",
      error: error.message,
    });
  }
};

const returnBook = asyncErrorHandler(async (req, res, next) => {
  try {
    const { bookId, userId } = req.body;
   

    // Ensure both bookId and userId are provided
    if (!bookId || !userId) {
      return res.status(400).json({
        message: "bookId and userId are required fields",
      });
    }

    // Find the borrow record by both userId and bookId
    const borrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      returnedAt: { $exists: false },
    }).populate("book");
// console.log(borrow)
    // If no borrow record found, return an error
    if (!borrow) {
      return res
        .status(404)
        .json({ message: "No borrow record found for this user and book" });
    }

    // Set the return date
    borrow.returnedAt = new Date();
    await borrow.save();

    // Response
    res.status(200).json({
      message: "Book returned successfully",
      status: "success",
      data: { borrow },
    });
  } catch (error) {
    next(error);
  }
});

const borrowHistory = asyncErrorHandler(async (req, res, next) => {
  try {
   
    // console.log(req.body,"history");

    // finding by borrowHistory through id
    const borrow = await Borrow.find({ user: req.body.user }).populate("book");

    // if  borrowHistory not found
    if (!borrow || borrow.length ===0)
      return res.status(400).json({ message: "borrow history not found" });

    // response

    res.status(200).json({
      message: "borrow history successfully",
      status: "success",
      result:borrow.length,
      data: {
        borrow,
      },
    });
  } catch (error) {
    next(error);
  }
});

// reports using aggregations

const mostBorrowedBooks = asyncErrorHandler(async (req, res, next) => {
  const books = await Borrow.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $group: {
        _id: "$bookDetails.title",
        booksCount: { $sum: 1 },
      },
    },
    {
      $sort: { booksCount: -1 },
    },
    {
      $addFields: {
        book: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
});

const activeMembers = asyncErrorHandler(async (req, res, next) => {
  const members = await Borrow.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $group: {
        _id: "$userDetails.name",
        borrowCount: { $sum: 1 },
      },
    },
    {
      $sort: { borrowCount: -1 },
    },
    {
      $addFields: {
        member: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      members,
    },
  });
});

const bookAvailability = asyncErrorHandler(async (req, res, next) => {
  const totalBooks = await Book.countDocuments();

  const borrowedBooks = await Borrow.aggregate([
    {
      $group: {
        _id: "$book",
        borrowCount: { $sum: 1 },
      },
    },
  ]);

  const availableBooks = totalBooks - borrowedBooks.length;

  res.status(200).json({
    status: "success",
    data: {
      totalBooks,
      borrowedBooks: borrowedBooks.length,
      availableBooks,
    },
  });
});

module.exports = {
  borrowBook,
  returnBook,
  borrowHistory,
  bookAvailability,
  activeMembers,
  mostBorrowedBooks,
};
