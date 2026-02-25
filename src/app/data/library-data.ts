export interface LibraryFloor {
  id: string;
  name: string;
}

export interface Library {
  id: string;
  name: string;
  campus: 'downtown' | 'macdonald';
  floors: LibraryFloor[];
}

export const LIBRARIES: Library[] = [
  {
    id: 'mclennan-redpath',
    name: 'McLennan-Redpath (HSSL)',
    campus: 'downtown',
    floors: [
      { id: 'mc1', name: 'McLennan 1 – Service desk, computers, main entrance' },
      { id: 'mc2', name: 'McLennan 2 – Study areas, journals' },
      { id: 'mc3', name: 'McLennan 3 – General collection, study space' },
      { id: 'mc4', name: 'McLennan 4 – Rare Books, Special Collections, Archives' },
      { id: 'mc5', name: 'McLennan 5 – General collection, quiet study' },
      { id: 'mc6', name: 'McLennan 6 – General collection, quiet study' },
      { id: 'rp1', name: 'Redpath 1 – Cyberthèque, cafeteria, group study' },
      { id: 'rp2', name: 'Redpath 2 – Group study pods, study seating' },
    ],
  },
  {
    id: 'schulich',
    name: 'Schulich Library',
    campus: 'downtown',
    floors: [
      { id: 'sc1', name: 'Floor 1 – Service desk, computer/printing area' },
      { id: 'sc2', name: 'Floor 2 – General collection, washrooms' },
      { id: 'sc3', name: 'Floor 3 – Quiet study' },
      { id: 'sc4', name: 'Floor 4 – Quiet study' },
      { id: 'sc5', name: 'Floor 5 – Group study area' },
      { id: 'sc6', name: 'Floor 6 – Quiet study' },
    ],
  },
  {
    id: 'law',
    name: 'Nahum Gelber Law Library',
    campus: 'downtown',
    floors: [
      { id: 'law-b', name: 'Basement – Print journals, case law, statutes' },
      { id: 'law1', name: 'Floor 1 – Main entrance, reference collection, wellness corner' },
      { id: 'law2', name: 'Floor 2 – UN Collection, Special Collections' },
      { id: 'law3', name: 'Floor 3 – General collection, Moot complex' },
      { id: 'law4', name: 'Floor 4 – General collection, group study rooms' },
      { id: 'law5', name: 'Floor 5 – Graduate student carrels' },
    ],
  },
  {
    id: 'music',
    name: 'Marvin Duchow Music Library',
    campus: 'downtown',
    floors: [
      { id: 'mu3', name: 'Floor 3 – Main entrance, service desk' },
      { id: 'mu4', name: 'Floor 4 – AV Hub, recordings, group study rooms' },
      { id: 'mu5', name: 'Floor 5 – Scores, performance library' },
    ],
  },
  {
    id: 'islamic',
    name: 'Islamic Studies Library',
    campus: 'downtown',
    floors: [
      { id: 'is1', name: 'Floor 1 – Main reading room, library services' },
      { id: 'is2', name: 'Floor 2 – Stacks and study area' },
    ],
  },
  {
    id: 'birks',
    name: 'Birks Reading Room',
    campus: 'downtown',
    floors: [
      { id: 'birks2', name: 'Floor 2 – Main reading room (Quiet zone)' },
    ],
  },
  {
    id: 'osler',
    name: 'Osler Library of the History of Medicine',
    campus: 'downtown',
    floors: [
      { id: 'osler3', name: 'Floor 3 – Rare books and history of medicine collections' },
    ],
  },
  {
    id: 'education',
    name: 'Education Curriculum Resources Centre',
    campus: 'downtown',
    floors: [
      { id: 'edu1', name: 'Floor 1 – Teaching materials and study space' },
    ],
  },
  {
    id: 'macdonald',
    name: 'Macdonald Campus Library',
    campus: 'macdonald',
    floors: [
      { id: 'mac2', name: 'Floor 2 – Service desk, "The Nook," Seed Library' },
      { id: 'mac3', name: 'Floor 3 – Main book collection, group study rooms' },
    ],
  },
];
