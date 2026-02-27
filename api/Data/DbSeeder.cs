using System.Data;
using CrowdCheck.Api.Models;
using Dapper;

namespace CrowdCheck.Api.Data;

public static class DbSeeder
{
    public static void Seed(IDbConnection db)
    {
        // If there's already data, skip.
        var count = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Locations");
        if (count > 0) return;


        int Insert(string externalId, string name, LocationType type, int? parentId = null)
        {
            db.Execute("""
                INSERT INTO Locations (ExternalId, Name, Type, ParentId)
                VALUES (@ExternalId, @Name, @Type, @ParentId)
                """,
                new { ExternalId = externalId, Name = name, Type = (int)type, ParentId = parentId });

            return db.ExecuteScalar<int>("SELECT last_insert_rowid()");
        }

        void AddChildren(int parentId, LocationType type, IEnumerable<(string id, string name)> children)
        {
            foreach (var (id, name) in children)
                Insert(id, name, type, parentId);
        }

        // --- Gym ---
        var macId = Insert("mac-athletic", "McGill Athletic Centre", LocationType.Gym);
        AddChildren(macId, LocationType.Gym, [
            ("b2-weight-room",   "Level B2 – Lifting area"),
            ("b2-cardio",         "Level B2 – Cardio Area"),
            ("fieldhouse-track",  "Level 1 – Running track and stretching areas"),
            ("fieldhouse-courts", "Level 1 – Basketball, Badminton, and Multipurpose courts"),
            ("memorial-pool",     "Ground Floor – Lane Swimming"),
            ("rec-zone",          "Lower levels – Training pods and yoga space"),
            ("squash-courts",     "Levels B1/B2 – Individual and Doubles courts"),
        ]);

        // --- Libraries ---
        void AddLibrary(string id, string name, IEnumerable<(string id, string name)> floors)
        {
            var libId = Insert(id, name, LocationType.Library);
            AddChildren(libId, LocationType.Library, floors);
        }

        AddLibrary("mclennan-redpath", "McLennan-Redpath (HSSL)", [
            ("mc1", "McLennan 1 – Service desk, computers, main entrance"),
            ("mc2", "McLennan 2 – Study areas, journals"),
            ("mc3", "McLennan 3 – General collection, study space"),
            ("mc4", "McLennan 4 – Rare Books, Special Collections, Archives"),
            ("mc5", "McLennan 5 – General collection, quiet study"),
            ("mc6", "McLennan 6 – General collection, quiet study"),
            ("rp1", "Redpath 1 – Cyberthèque, cafeteria, group study"),
            ("rp2", "Redpath 2 – Group study pods, study seating"),
        ]);
        AddLibrary("schulich", "Schulich Library", [
            ("sc1", "Floor 1 – Service desk, computer/printing area"),
            ("sc2", "Floor 2 – General collection, washrooms"),
            ("sc3", "Floor 3 – Quiet study"),
            ("sc4", "Floor 4 – Quiet study"),
            ("sc5", "Floor 5 – Group study area"),
            ("sc6", "Floor 6 – Quiet study"),
        ]);
        AddLibrary("law", "Nahum Gelber Law Library", [
            ("law-b", "Basement – Print journals, case law, statutes"),
            ("law1",  "Floor 1 – Main entrance, reference collection, wellness corner"),
            ("law2",  "Floor 2 – UN Collection, Special Collections"),
            ("law3",  "Floor 3 – General collection, Moot complex"),
            ("law4",  "Floor 4 – General collection, group study rooms"),
            ("law5",  "Floor 5 – Graduate student carrels"),
        ]);
        AddLibrary("music", "Marvin Duchow Music Library", [
            ("mu3", "Floor 3 – Main entrance, service desk"),
            ("mu4", "Floor 4 – AV Hub, recordings, group study rooms"),
            ("mu5", "Floor 5 – Scores, performance library"),
        ]);
        AddLibrary("islamic", "Islamic Studies Library", [
            ("is1", "Floor 1 – Main reading room, library services"),
            ("is2", "Floor 2 – Stacks and study area"),
        ]);
        AddLibrary("birks", "Birks Reading Room", [
            ("birks2", "Floor 2 – Main reading room (Quiet zone)"),
        ]);
        AddLibrary("osler", "Osler Library of the History of Medicine", [
            ("osler3", "Floor 3 – Rare books and history of medicine collections"),
        ]);
        AddLibrary("education", "Education Curriculum Resources Centre", [
            ("edu1", "Floor 1 – Teaching materials and study space"),
        ]);
        AddLibrary("macdonald", "Macdonald Campus Library", [
            ("mac2", "Floor 2 – Service desk, \"The Nook,\" Seed Library"),
            ("mac3", "Floor 3 – Main book collection, group study rooms"),
        ]);
    }
}
