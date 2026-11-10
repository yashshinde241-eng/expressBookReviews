const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((bks) => {
    res.status(200).send(JSON.stringify(bks, null, 4));
  }).catch((err) => {
    res.status(500).json({ message: "Error fetching books" });
  });
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    }
    resolve(booksByAuthor);
  });

  getBooksByAuthor.then((bks) => {
    res.status(200).json(bks);
  }).catch((err) => {
    res.status(500).json({ message: "Error fetching books by author" });
  });
});

// Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    }
    resolve(booksByTitle);
  });

  getBooksByTitle.then((bks) => {
    res.status(200).json(bks);
  }).catch((err) => {
    res.status(500).json({ message: "Error fetching books by title" });
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;