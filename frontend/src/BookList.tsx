import { useEffect, useState } from "react";
import { Book } from "./types/Books";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import './Cart.css';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("title");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:5000/api/Books/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryFilter = selectedCategory ? `&category=${selectedCategory}` : "";
      
      const response = await fetch(
        `http://localhost:5000/api/Books?pageSize=${pageSize}&pageNum=${pageNum}${categoryFilter}`
      );
      const data = await response.json();
    
      if (data && data.books && Array.isArray(data.books)) {
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      } else {
        console.error("Fetched data is not in the expected format:", data);
      }
    };
  
    fetchBooks();
  }, [pageSize, pageNum, sortBy, selectedCategory]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    navigate('/cart');
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Book List</h2>

      {/* Cart Icon in Top Right */}
      <div className="cart-icon" onClick={() => navigate('/cart')}>
        <FaShoppingCart size={30} />
      </div>

      {/* Category Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
            <label>Filter by Category: </label>
            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
            ))}
            </select>
            {/* Add a Badge to show the number of books for the selected category */}
            <span className="badge bg-secondary ms-2">
            {selectedCategory ? books.filter(book => book.category === selectedCategory).length : 16} Books
            </span>
        </div>
        
        {/* Sort Dropdown */}
        <div className="col-md-4">
            <label>Sort by: </label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title</option>
            </select>
        </div>

        {/* Results per Page */}
        <div className="col-md-4">
            <label>Results per page:</label>
            <select className="form-select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            </select>
        </div>
        </div>

      {/* Card Deck (new Bootstrap feature) */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {books.length === 0 ? (
          <p>No books found for this category.</p>
        ) : (
          books.map((book) => (
            <div key={book.bookId} className="col">
              <div className="card h-100 fixed-card-size">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">
                    Author: {book.author} <br />
                    Publisher: {book.publisher} <br />
                    ISBN: {book.isbn} <br />
                    Classification: {book.classification} <br />
                    Category: {book.category} <br />
                    Number of Pages: {book.pageCount} <br />
                    Price: ${book.price}
                  </p>
                  <button onClick={() => handleAddToCart(book)} className="btn btn-primary w-100">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <button
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
          className="btn btn-secondary"
        >
          Previous
        </button>

        <span className="mx-2">
          Page {pageNum} of {Math.ceil(totalBooks / pageSize)}
        </span>

        <button
          disabled={pageNum * pageSize >= totalBooks}
          onClick={() => setPageNum(pageNum + 1)}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookList;
