const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => users.some((u) => u.username === username);

const authenticatedUser = (username, password) =>
  users.some((u) => u.username === username && u.password === password);

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { token, username };

  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.body.review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.reviews[req.user] = req.body.review;
  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  delete book.reviews[req.user];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
