using System.Data;
using System.Reflection;
using CrowdCheck.Api.Data;
using CrowdCheck.Api.Endpoints;
using DbUp;
using Microsoft.AspNetCore.HttpOverrides;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

// IDbConnection — Dapper uses this for all queries.
builder.Services.AddScoped<IDbConnection>(_ => new NpgsqlConnection(connectionString));

builder.Services.AddOpenApi();

var frontendOrigin = builder.Configuration["FrontendOrigin"]
    ?? throw new InvalidOperationException("FrontendOrigin is not configured.");

builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(frontendOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();


app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();

    // Catches any unhandled exception and returns a generic 500 JSON response
    // instead of leaking stack traces or internal details to the client.
    app.UseExceptionHandler(error => error.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred." });
    }));
}

app.UseCors("Frontend");

var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString)
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
