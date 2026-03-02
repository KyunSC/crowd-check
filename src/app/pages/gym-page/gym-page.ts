import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FloorVotingPanel } from '../../components/floor-voting-panel/floor-voting-panel';
import { GYMS, Gym } from '../../data/gym-data';
import { LucideAngularModule, ChevronDown, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-gym-page',
  imports: [FloorVotingPanel, LucideAngularModule, RouterLink],
  templateUrl: './gym-page.html',
  styleUrl: './gym-page.css',
})
export class GymPage {
  readonly ArrowLeft = ArrowLeft;
  readonly ChevronDown = ChevronDown;
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
