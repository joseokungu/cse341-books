// src/models/books.js
import { getDb } from '../db/connect.js';

// Retrieve all books
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');

  const books = await collection.find({}).toArray();
  return books;
};

// Retrieve one book by its custom ID
const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');

  const book = await collection.findOne({ id: bookId });
  return book;
};

// Check whether an author exists
const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');

  const author = await collection.findOne({ id: authorId });
  return Boolean(author);
};

// Create a new book
const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.insertOne(book);
  return result;
};

// Update an existing book
const updateBook = async (bookId, book) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.updateOne(
    { id: bookId },
    { $set: book }
  );

  return result;
};

// Delete an existing book
const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.deleteOne({ id: bookId });
  return result;
};

export {
  getAllBooks,
  getBookById,
  authorExists,
  createBook,
  updateBook,
  deleteBook
};
