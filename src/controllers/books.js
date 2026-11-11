 // src/controllers/books.js
import {
  getAllBooks,
  getBookById,
  authorExists,
  createBook,
  updateBook,
  deleteBook,
} from '../models/books.js';

// Validate book data
const isValidBook = (book, requireId = false) => {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return false;
  }

  const requiredFields = requireId
    ? ['id', 'authorId', 'title', 'publicationDate']
    : ['authorId', 'title', 'publicationDate'];

  const hasRequiredFields = requiredFields.every((field) => {
  return Object.prototype.hasOwnProperty.call(book, field);
});  

  if (!hasRequiredFields) {
    return false;
  }

  if (
    (requireId &&
      (typeof book.id !== 'string' || !book.id.trim())) ||
    typeof book.authorId !== 'string' ||
    !book.authorId.trim() ||
    typeof book.title !== 'string' ||
    !book.title.trim() ||
    typeof book.publicationDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(book.publicationDate)
  ) {
    return false;
  }

  const date = new Date(`${book.publicationDate}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === book.publicationDate
  );
};

// GET /books
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /books/:id
const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /books
const createBookHandler = async (req, res) => {
  const book = req.body;

  if (!isValidBook(book, true)) {
    return res.status(400).json({
      message: 'Invalid or missing book fields.',
    });
  }

  try {
    const existingBook = await getBookById(book.id);

    if (existingBook) {
      return res.status(400).json({
        message: 'A book with this ID already exists.',
      });
    }

    const exists = await authorExists(book.authorId);

    if (!exists) {
      return res.status(400).json({
        message: 'The specified author does not exist.',
      });
    }

    await createBook({
      id: book.id,
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate,
    });

    return res.status(201).json({
      message: 'Book created successfully.',
      book: {
        id: book.id,
        authorId: book.authorId,
        title: book.title,
        publicationDate: book.publicationDate,
      },
    });
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /books/:id
const updateBookHandler = async (req, res) => {
  const bookId = req.params.id;
  const book = req.body;

  if (!isValidBook(book)) {
    return res.status(400).json({
      message: 'Invalid or missing book fields.',
    });
  }

  try {
    const existingBook = await getBookById(bookId);

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const exists = await authorExists(book.authorId);

    if (!exists) {
      return res.status(400).json({
        message: 'The specified author does not exist.',
      });
    }

    await updateBook(bookId, {
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate,
    });

    return res.status(200).json({
      message: 'Book updated successfully.',
      book: {
        id: bookId,
        authorId: book.authorId,
        title: book.title,
        publicationDate: book.publicationDate,
      },
    });
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /books/:id
const deleteBookHandler = async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
