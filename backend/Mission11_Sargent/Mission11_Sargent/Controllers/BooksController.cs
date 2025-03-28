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

}