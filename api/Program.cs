using System.Data;
using System.Reflection;
using CrowdCheck.Api.Data;
using CrowdCheck.Api.Endpoints;
using DbUp;
using DbUp.Sqlite;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

const string ConnectionString = "Data Source=crowdcheck.db";

// IDbConnection — Dapper uses this for all queries.
builder.Services.AddScoped<IDbConnection>(_ => new SqliteConnection(ConnectionString));

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200") // Change to deployed URL in production.
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors();

// Must be called before any connection is opened — registers the native sqlite3 binary.
SQLitePCL.Batteries_V2.Init();

var upgrader = DeployChanges.To
    .SqliteDatabase(ConnectionString)
    .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
    .LogToConsole()
    .Build();

var result = upgrader.PerformUpgrade();
if (!result.Successful)
    throw new Exception("Database migration failed.", result.Error);

// --- Seed reference data ---
using (var scope = app.Services.CreateScope())
{
    var conn = scope.ServiceProvider.GetRequiredService<IDbConnection>();
    DbSeeder.Seed(conn);
}

// --- Endpoints ---
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
CrowdednessEndpoints.Map(app);

app.Run();
