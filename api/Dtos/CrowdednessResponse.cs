namespace CrowdCheck.Api.Dtos;

// What the frontend receives on GET /api/crowdedness/{locationId}
public record CrowdednessResponse(
    string LocationId,   // e.g. "b2-weight-room"
    string LocationName,
    int Level,           // 0 = unknown, 1 = not busy, 2 = moderate, 3 = packed
    int VoteCount        // how many votes contributed to this level in the last 90 min
);
