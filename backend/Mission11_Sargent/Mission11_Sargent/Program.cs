// using FullStackFun.Data;
// using Microsoft.EntityFrameworkCore;

using Microsoft.EntityFrameworkCore;
using Mission11_Sargent.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => 
    policy.WithOrigins("http://localhost:3000") // Allow frontend origin
        .AllowAnyMethod() // Allow all HTTP methods
        .AllowAnyHeader() // Allow all headers
        .AllowCredentials()); // Allow cookies/auth if needed

app.MapControllers();

app.UseAuthorization();

app.Run();