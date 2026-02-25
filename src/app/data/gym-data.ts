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
      { id: 'b2-weight-room', name: 'Level B2 – main strength training and heavy lifting area' },
      { id: 'b2-cardio', name: 'Level B2 – treadmills, ellipticals, and stationary bikes' },
      { id: 'fieldhouse-track', name: 'Level 1 – 200m running track and stretching areas' },
      { id: 'fieldhouse-courts', name: 'Level 1 – basketball, badminton, and multipurpose courts' },
      { id: 'memorial-pool', name: 'Ground Floor – lane swimming' },
      { id: 'rec-zone', name: 'Lower levels – functional training pods and yoga space' },
      { id: 'squash-courts', name: 'Levels B1/B2 – individual and doubles courts' },
    ],
  },
];
