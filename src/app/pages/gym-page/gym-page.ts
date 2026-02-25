import { Component, signal } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { FloorVotingPanel } from '../../components/floor-voting-panel/floor-voting-panel';
import { GYMS, GymZone, Gym } from '../../data/gym-data';

@Component({
  selector: 'app-gym-page',
  imports: [HomeButton, FloorVotingPanel],
  templateUrl: './gym-page.html',
  styleUrl: './gym-page.css',
})
export class GymPage {
  gyms: Gym[] = GYMS;
  expandedZoneKey = signal<string | null>(null);

  toggleZone(gymId: string, zoneId: string) {
    const key = `${gymId}-${zoneId}`;
    this.expandedZoneKey.set(this.expandedZoneKey() === key ? null : key);
  }

  isZoneOpen(gymId: string, zoneId: string): boolean {
    return this.expandedZoneKey() === `${gymId}-${zoneId}`;
  }
}
