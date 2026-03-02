using System.Data;
using System.Security.Cryptography;
using System.Text;
using CrowdCheck.Api.Dtos;
using CrowdCheck.Api.Models;
using Dapper;

namespace CrowdCheck.Api.Endpoints;

public static class CrowdednessEndpoints
{
    // The window of time we consider for crowdedness: votes older than this are ignored.
    private static readonly TimeSpan VoteWindow = TimeSpan.FromMinutes(90);

    // How long someone must wait before voting on the same location again.
    private static readonly TimeSpan RateLimitWindow = TimeSpan.FromMinutes(30);

    public static void Map(WebApplication app)
    {
        // GET /api/crowdedness/{locationId}
        // Returns the current aggregated crowdedness level for one location.
        app.MapGet("/api/crowdedness/{locationId}", async (string locationId, IDbConnection db) =>
        {
            var location = await db.QueryFirstOrDefaultAsync<Location>("""
                SELECT Id, Name, ExternalId
                FROM Locations
                WHERE ExternalId = @LocationId
                """,
                new { LocationId = locationId });

            if (location is null)
                return Results.NotFound(new { error = $"Location '{locationId}' not found." });

            var since = DateTime.UtcNow - VoteWindow;

            // Fetch all recent votes for this location.
            // ORDER BY CreatedAt DESC = newest first.
            var votes = (await db.QueryAsync<(int Level, DateTime CreatedAt)>("""
                SELECT Level, CreatedAt
                FROM Votes
                WHERE LocationId = @LocationId AND CreatedAt > @Since
                ORDER BY CreatedAt DESC
                """,
                new { LocationId = location.Id, Since = since })).ToList();

            if (votes.Count == 0)
                return Results.Ok(new CrowdednessResponse(locationId, location.Name, 0, 0));

            // Weighted average with time decay.
            // A vote cast 5 minutes ago counts more than one cast 80 minutes ago.
            // Weight = how far through the window the vote is (0.0 → 1.0, newer = higher).
            var totalWeight = 0.0;
            var weightedSum = 0.0;
            var now = DateTime.UtcNow;

            foreach (var (level, createdAt) in votes)
            {
                var age = (now - createdAt).TotalMinutes;
                var weight = 1.0 - (age / VoteWindow.TotalMinutes); // 1.0 = brand new, ~0.0 = about to expire
                weightedSum += level * weight;
                totalWeight += weight;
            }

            // Round to nearest integer (1, 2, or 3).
            var aggregatedLevel = (int)Math.Round(weightedSum / totalWeight);

            return Results.Ok(new CrowdednessResponse(
                locationId,
                location.Name,
                aggregatedLevel,
                votes.Count
            ));
        });

        // POST /api/crowdedness/{locationId}/vote
        // Accepts a vote from a user. Rate-limited per identity per location.
        app.MapPost("/api/crowdedness/{locationId}/vote", async (
            string locationId,
            VoteRequest request,
            IDbConnection db,
            HttpContext http,
            IConfiguration config) =>
        {
            // Validate the level is within the allowed range.
            if (request.Level is < 1 or > 3)
                return Results.BadRequest(new { error = "Level must be 1 (not busy), 2 (moderate), or 3 (packed)." });

            // Look up the location.
            var location = await db.QueryFirstOrDefaultAsync<Location>("""
                SELECT Id FROM Locations WHERE ExternalId = @LocationId
                """,
                new { LocationId = locationId });

            if (location is null)
                return Results.NotFound(new { error = $"Location '{locationId}' not found." });

            // Build the hashed identity: HMAC-SHA256
            var ip = http.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var secret = Encoding.UTF8.GetBytes(config["IpHashSecret"] ?? throw new InvalidOperationException("IpHashSecret is not configured."));
            var rawIdentity = Encoding.UTF8.GetBytes($"{ip}:{DateTime.UtcNow:yyyy-MM-dd}");
            var hashedIdentity = Convert.ToHexString(HMACSHA256.HashData(secret, rawIdentity));

            // Rate limit check: has this identity already voted on this location recently?
            var since = DateTime.UtcNow - RateLimitWindow;
            var recentVoteCount = await db.ExecuteScalarAsync<int>("""
                SELECT COUNT(*)
                FROM Votes
                WHERE LocationId = @LocationId
                  AND HashedIdentity = @HashedIdentity
                  AND CreatedAt > @Since
                """,
                new { LocationId = location.Id, HashedIdentity = hashedIdentity, Since = since });

            if (recentVoteCount > 0)
                return Results.Json(
                    new { error = "You already voted for this location recently. Try again in 30 minutes." },
                    statusCode: 429); // 429 = Too Many Requests

            // Insert the vote.
            await db.ExecuteAsync("""
                INSERT INTO Votes (LocationId, Level, HashedIdentity, CreatedAt)
                VALUES (@LocationId, @Level, @HashedIdentity, @CreatedAt)
                """,
                new
                {
                    LocationId = location.Id,
                    request.Level,
                    HashedIdentity = hashedIdentity,
                    CreatedAt = DateTime.UtcNow
                });

            return Results.Created($"/api/crowdedness/{locationId}", new { message = "Vote recorded." });
        });

        // GET /api/crowdedness/{locationId}/history
        // Returns hourly vote buckets for a location over a selectable time range.
        app.MapGet("/api/crowdedness/{locationId}/history", async (
            string locationId,
            string? range,
            IDbConnection db) =>
        {
            var location = await db.QueryFirstOrDefaultAsync<Location>("""
                SELECT Id FROM Locations WHERE ExternalId = @LocationId
                """,
                new { LocationId = locationId });

            if (location is null)
                return Results.NotFound(new { error = $"Location '{locationId}' not found." });

            var since = (range ?? "week") switch
            {
                "today" => DateTime.UtcNow.AddHours(-24),
                "week"  => DateTime.UtcNow.AddDays(-7),
                "month" => DateTime.UtcNow.AddDays(-30),
                _       => DateTime.UtcNow.AddDays(-7)
            };

            var buckets = await db.QueryAsync<HistoryBucket>("""
                SELECT
                    DATE_TRUNC('hour', CreatedAt) AS BucketStart,
                    AVG(CAST(Level AS REAL))      AS AverageLevel,
                    CAST(COUNT(*) AS INTEGER)     AS VoteCount
                FROM Votes
                WHERE LocationId = @LocationId AND CreatedAt > @Since
                GROUP BY DATE_TRUNC('hour', CreatedAt)
                ORDER BY BucketStart
                """,
                new { LocationId = location.Id, Since = since });

            return Results.Ok(buckets);
        });

        // GET /api/crowdedness
        // Returns current levels for ALL locations at once (used on the home/overview page).
        // Uses the same time-weighted average as the per-location endpoint for consistency.
        app.MapGet("/api/crowdedness", async (IDbConnection db) =>
        {
            var since = DateTime.UtcNow - VoteWindow;
            var now = DateTime.UtcNow;

            // Fetch all locations that have a parent (i.e. zones/floors, not top-level groups).
            var locations = await db.QueryAsync<Location>("""
                SELECT Id, ExternalId, Name FROM Locations WHERE ParentId IS NOT NULL ORDER BY Name
                """);

            // Fetch all recent votes in one query (more efficient than N+1 queries per location).
            var allVotes = (await db.QueryAsync<(int LocationId, int Level, DateTime CreatedAt)>("""
                SELECT LocationId, Level, CreatedAt
                FROM Votes
                WHERE CreatedAt > @Since
                """,
                new { Since = since })).ToLookup(v => v.LocationId);

            var results = locations.Select(loc =>
            {
                var votes = allVotes[loc.Id];
                var count = votes.Count();

                if (count == 0)
                    return new CrowdednessResponse(loc.ExternalId, loc.Name, 0, 0);

                // Same time-decay weighting as the per-location endpoint.
                var totalWeight = 0.0;
                var weightedSum = 0.0;
                foreach (var (_, level, createdAt) in votes)
                {
                    var age = (now - createdAt).TotalMinutes;
                    var weight = 1.0 - (age / VoteWindow.TotalMinutes);
                    weightedSum += level * weight;
                    totalWeight += weight;
                }

                return new CrowdednessResponse(
                    loc.ExternalId,
                    loc.Name,
                    (int)Math.Round(weightedSum / totalWeight),
                    count
                );
            });

            return Results.Ok(results);
        });
    }
}
