import { useEffect, useState } from "react";
import { Book } from "./types/Books";

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("title");

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(
                `http://localhost:5000/api/Books?pageSize=${pageSize}&pageNum=${pageNum}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalBooks(data.totalBooks);
        };

        fetchBooks();
    }, [pageSize, pageNum, sortBy]);

    return (
        <div>
            <h2>Book List</h2>
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title">Title</option>
            </select>

            
            {books.map((book) => (
                <div key={book.bookId} className="card mb-2">
                    <div className="card-body">
                        <h5 className="card-title">{book.title}</h5>
                        <p className="card-text">
                            Author: {book.author} <br/> 
                            Publisher: {book.publisher} <br/> 
                            ISBN: {book.isbn} <br/>
                            Classification: {book.classification} <br/>
                            Category: {book.category} <br/>
                            Number of Pages: {book.pageCount} <br/>
                            Price: ${book.price}
                        </p>
                    </div>
                </div>
            ))}

            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
                Previous
            </button>

            <span>
                Page {pageNum} of {Math.ceil(totalBooks / pageSize)}
            </span>

            <button disabled={pageNum * pageSize >= totalBooks} onClick={() => setPageNum(pageNum + 1)}>
                Next
            </button>

            <label>Results per page:</label>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </div>
    );
}

export default BookList;
