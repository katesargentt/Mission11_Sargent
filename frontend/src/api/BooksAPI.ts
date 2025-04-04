import { Book } from '../types/Books'; // Adjust path if needed

interface FetchBooksResponse {
  books: Book[];
  totalBooks: number;
}

const API_URL = 'http://localhost:5000/api/books';

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `category=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();
    console.log('Fetched books response:', data); // Debugging log

    // Check if 'books' exists
    if (!data || !data.books) {
      console.warn('No books found in response:', data);
      return { books: [], totalBooks: 0 }; // Return an empty list instead of undefined
    }

    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Add a new book
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Update an existing book
export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `Delete request sent for book ${bookId}, status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
