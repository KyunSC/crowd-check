namespace CrowdCheck.Api.Dtos;

public record HistoryBucket(
    DateTime BucketStart,  // UTC hour bucket
    double AverageLevel,   // raw avg (not rounded) — frontend decides display
    int VoteCount
);
