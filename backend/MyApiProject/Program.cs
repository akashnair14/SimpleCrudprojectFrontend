using MyApiProject.Business;
using MyApiProject.Data;
using MyApiProject.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS CONFIG
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite dev server origin
              .AllowAnyHeader()
              .AllowAnyMethod();
        // If you ever use cookies/auth: .AllowCredentials();
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// dependency injection
builder.Services.AddSingleton<DbHelper>();
builder.Services.AddTransient<EmployeeDAL>();
builder.Services.AddTransient<EmployeeBL>();

var app = builder.Build();


app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
