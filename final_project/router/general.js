const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => Promise.resolve(books);
const getBookByISBN = (isbn) => Promise.resolve(books[isbn] || null);
const getBooksByAuthor = (author) =>
  Promise.resolve(Object.values(books).filter((b) => b.author === author));
const getBooksByTitle = (title) =>
  Promise.resolve(Object.values(books).filter((b) => b.title === title));

public_users.post("/register", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(req.body.username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push(req.body);
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get("/", async (req, res) => {
  try {
    const data = await getAllBooks();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const book = await getBookByISBN(req.params.isbn);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

public_users.get("/author/:author", async (req, res) => {
  try {
    const matched = await getBooksByAuthor(req.params.author);
    if (!matched.length)
      return res
        .status(404)
        .json({ message: "Books by this author not found" });
    return res.status(200).json(matched);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  try {
    const matched = await getBooksByTitle(req.params.title);
    if (!matched.length)
      return res
        .status(404)
        .json({ message: "Books with this title not found" });
    return res.status(200).json(matched);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get("/review/:isbn", async (req, res) => {
  try {
    const book = await getBookByISBN(req.params.isbn);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book.reviews);
  } catch {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});

module.exports.general = public_users;
