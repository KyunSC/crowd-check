
CREATE TABLE Locations (
    Id         SERIAL PRIMARY KEY,
    ExternalId TEXT   NOT NULL UNIQUE,  -- slug used in API URLs, e.g. "b2-weight-room"
    Name       TEXT   NOT NULL,
    Type       INTEGER NOT NULL,         -- 0 = Gym, 1 = Library (matches the C# enum)
    ParentId   INTEGER NULL REFERENCES Locations(Id)
);

CREATE INDEX IX_Locations_ExternalId ON Locations(ExternalId);

CREATE INDEX IX_Locations_ParentId ON Locations(ParentId);

CREATE TABLE Votes (
    Id             SERIAL PRIMARY KEY,
    LocationId     INTEGER     NOT NULL REFERENCES Locations(Id) ON DELETE CASCADE,
    Level          INTEGER     NOT NULL,  -- 1 = Not busy, 2 = Moderate, 3 = Packed
    HashedIdentity TEXT        NOT NULL,
    CreatedAt      TIMESTAMPTZ NOT NULL
);

-- Used by GET /api/crowdedness/{id} — fetch recent votes for one location
CREATE INDEX IX_Votes_LocationId_CreatedAt
    ON Votes(LocationId, CreatedAt);

-- Used by POST vote — rate limit check (has this identity voted here recently?)
CREATE INDEX IX_Votes_LocationId_HashedIdentity_CreatedAt
    ON Votes(LocationId, HashedIdentity, CreatedAt);
