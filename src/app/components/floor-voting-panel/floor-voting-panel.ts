import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { VoteButton } from '../vote-button/vote-button';
import { CrowdMeter } from '../crowd-meter/crowd-meter';
import { ConfirmButton } from '../confirm-button/confirm-button';
import { CrowdednessService } from '../../services/crowdedness.service';

@Component({
  selector: 'app-floor-voting-panel',
  imports: [VoteButton, CrowdMeter, ConfirmButton],
  templateUrl: './floor-voting-panel.html',
  styleUrl: './floor-voting-panel.css',
})
export class FloorVotingPanel implements OnInit {
  @Input() floorName = '';
  @Input() locationId = ''; // slug e.g. "b2-weight-room"

  crowdLevel = signal(0);
  pendingLevel = signal(0);
  isSubmitting = signal(false);
  errorMessage = signal('');

  private crowdednessService = inject(CrowdednessService);

  // ngOnInit runs once after Angular has set all @Input() values.
  // This is where we fetch the current crowdedness level from the API.
  ngOnInit() {
    if (!this.locationId) return;

    this.crowdednessService.getCrowdedness(this.locationId).subscribe({
      next: (data) => this.crowdLevel.set(data.level),
      error: () => this.errorMessage.set('Could not load crowdedness.')
    });
  }

  onConfirm() {
    if (!this.locationId || this.pendingLevel() === 0) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.crowdednessService.submitVote(this.locationId, this.pendingLevel()).subscribe({
      next: () => {
        // Re-fetch after voting so the meter shows the aggregated level from all users.
        this.crowdednessService.getCrowdedness(this.locationId).subscribe({
          next: (data) => {
            this.crowdLevel.set(data.level);
            this.pendingLevel.set(0);
            this.isSubmitting.set(false);
          }
        });
      },
      error: (err) => {
        const msg = err.status === 429
          ? 'You already voted here recently. Try again in 30 minutes.'
          : 'Could not submit vote.';
        this.errorMessage.set(msg);
        this.isSubmitting.set(false);
      }
    });
  }
}
