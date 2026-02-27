namespace CrowdCheck.Api.Models;

public enum LocationType { Gym, Library }

public class Location
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = "";
    public string Name { get; set; } = "";
    public LocationType Type { get; set; }
    public int? ParentId { get; set; }
}
