export interface GymZone {
  id: string;
  name: string;
}

export interface Gym {
  id: string;
  name: string;
  zones: GymZone[];
}

export const GYMS: Gym[] = [
  {
    id: 'mac-athletic',
    name: 'McGill Athletic Centre',
    zones: [
      { id: 'b2-weight-room', name: 'Level B2 – Lifting area' },
      { id: 'b2-cardio', name: 'Level B2 – Cardio Area' },
      { id: 'fieldhouse-track', name: 'Level 1 – Running track and stretching areas' },
      { id: 'fieldhouse-courts', name: 'Level 1 – Basketball, Badminton, and Multipurpose courts' },
      { id: 'memorial-pool', name: 'Ground Floor – Lane Swimming' },
      { id: 'rec-zone', name: 'Lower levels – Training pods and yoga space' },
      { id: 'squash-courts', name: 'Levels B1/B2 – Individual and Doubles courts' },
    ],
  },
];
