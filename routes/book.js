const express = require("express");
const Book = require("../models/Book");
const router = express.Router();
const multer = require("multer");
const upload = require("../upload");
const fs = require("fs");
const path = require("path");

//delete
router.post("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  console.log(bookId);
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message:"Book not found" });
    }
    if (book.file) {
      const filePath = path.join(book.file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath); // Delete the old file
          console.log("file deleted");

        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
        }
      } else {
        console.log("file does not exist at:", filePath);
      }
    }
    const result = await Book.deleteOne({ _id: bookId });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message:"Book not found" });
    }
    res.send("Book Deleted");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new book
// router.post('/new', async (req, res) => {
//     try {
//       console.log(req.body)
//       const book = new Book(req.body);
//       await book.save()

//       const books = await Book.find();
//       return res.status(200).render("home", {books: books });
//     } catch (error) {
//       console.log(error);
//       res.status(400).send("Error");
//     }
//   });

//upload file
router.post("/new", upload.single("uploadbook"), async (req, res) => {
  try {
    const {title, author, pages, publishedDate } = req.body;
     if (!req.file) {
       return res.status(400).send("File upload is required.");
    }
    const newBook = new Book({
      title,
      author,
      pages,
      publishedDate,
      file: req.file.path,
    });
    await newBook.save();
    res.send("file uploaded");
  } catch (err) {
    res.status(500).send("Error adding book: " + err.message);
  }
});

//edit
router.get("/editBook/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log(bookId);
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found.");
    }
    res.json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching book.");
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json({ books: books });
  } catch (error) {
    res.status(500).send("Error");
  }
});

// Get a single book by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) {
//       return res.status(404).send();
//     }
//     res.render("home", { book });
//   } catch (error) {
//     res.status(500).send("Error");
//   }
// });

//update
router.post("/edit/:id", upload.single("uploadbook"), async (req, res) => {
  try {
    const bookId = req.params.id;
    let book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found.");
    }
    console.log(book);
    if (book.file) {
      const oldFilePath = path.join(book.file);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath); // Delete the old file
          console.log("Old file deleted");
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
        }
      } else {
        console.log("Old file does not exist at:", oldFilePath);
      }
    }
    book.title = req.body.title;
    book.author = req.body.author;
    book.pages = req.body.pages;
    book.publishedDate = req.body.publishedDate;
    if (req.file) {
      book.file = req.file.filename;
    }
    await book.save();
    const books = await Book.find();
    res.json({ books: books });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error");
  }
});

module.exports = router;
