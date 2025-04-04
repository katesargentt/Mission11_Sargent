using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Sargent.Models;

namespace Mission11_Sargent.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks(int pageSize = 5, int pageNum = 1, string category = "")
    {
        // Apply category filter if provided
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        var books = await query
            .OrderBy(b => b.Title)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalBooks = await query.CountAsync();

        return Ok(new { books, totalBooks });
    }

    
    [HttpGet("category/{categoryName}")]
    public async Task<IActionResult> GetBooksByCategory(string categoryName)
    {
        var books = await _context.Books
            .Where(b => b.Category == categoryName)
            .ToListAsync();

        return Ok(books);
    }
    
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .ToListAsync();

        return Ok(categories);
    }
    
    // ADD A NEW BOOK
    [HttpPost("AddBook")]
    public async Task<IActionResult> AddBook([FromBody] Book newBook)
    {
        if (newBook == null)
        {
            return BadRequest(new { message = "Invalid book data" });
        }

        _context.Books.Add(newBook);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooks), new { id = newBook.BookId }, newBook);
    }

    // UPDATE AN EXISTING BOOK
    [HttpPut("UpdateBook/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
    {
        var existingBook = await _context.Books.FindAsync(id);
        if (existingBook == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Category = updatedBook.Category;
        existingBook.Classification = updatedBook.Classification; // Add this line
        existingBook.Publisher = updatedBook.Publisher; // Add this line
        existingBook.PageCount = updatedBook.PageCount; // Add this line
        existingBook.Price = updatedBook.Price;
        existingBook.Isbn = updatedBook.Isbn;

        _context.Books.Update(existingBook);
        await _context.SaveChangesAsync();

        return Ok(existingBook);
    }

    // DELETE A BOOK
    [HttpDelete("DeleteBook/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}