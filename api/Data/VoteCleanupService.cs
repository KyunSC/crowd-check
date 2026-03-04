using System.Data;
using Dapper;

namespace CrowdCheck.Api.Data;

/// <summary>
/// Background service that periodically deletes votes older than 30 days
/// to prevent the Votes table from growing without bound.
/// </summary>
public class VoteCleanupService(IServiceProvider services, ILogger<VoteCleanupService> logger) : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(6);
    private static readonly TimeSpan MaxAge = TimeSpan.FromDays(30);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(Interval, stoppingToken);

            try
            {
                using var scope = services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<IDbConnection>();
                var cutoff = DateTime.UtcNow - MaxAge;

                var deleted = await db.ExecuteAsync(
                    "DELETE FROM Votes WHERE CreatedAt < @Cutoff",
                    new { Cutoff = cutoff });

                if (deleted > 0)
                    logger.LogInformation("Vote cleanup: deleted {Count} votes older than 30 days.", deleted);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Vote cleanup failed.");
            }
        }
    }
}
