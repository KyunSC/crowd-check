namespace CrowdCheck.Api.Models;

public class Vote
{
    public int Id { get; set; }

    public int LocationId { get; set; }

    // 1 = Not busy, 2 = Moderate, 3 = Packed
    public int Level { get; set; }

    // Not storing raw IP
    public string HashedIdentity { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
