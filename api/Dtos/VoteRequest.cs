namespace CrowdCheck.Api.Dtos;

// record = immutable, value-based type. Perfect for DTOs that are just data carriers.
// The frontend POSTs: { "level": 2 }
public record VoteRequest(int Level);
