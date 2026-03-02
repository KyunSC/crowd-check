import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { VoteButton } from '../vote-button/vote-button';
import { CrowdMeter } from '../crowd-meter/crowd-meter';
import { ConfirmButton } from '../confirm-button/confirm-button';
import { CrowdHeatmap } from '../crowd-heatmap/crowd-heatmap';
import { CrowdednessService } from '../../services/crowdedness.service';
import { HistoryBucket, HeatmapRange } from '../../models/history-bucket';

@Component({
  selector: 'app-floor-voting-panel',
  imports: [VoteButton, CrowdMeter, ConfirmButton, CrowdHeatmap],
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

  showHistory = signal(false);
  historyRange = signal<HeatmapRange>('week');
  historyData = signal<HistoryBucket[]>([]);
  isLoadingHistory = signal(false);
  historyError = signal('');

  private crowdednessService = inject(CrowdednessService);

  toggleHistory() {
    const opening = !this.showHistory();
    this.showHistory.set(opening);
    if (opening && this.historyData().length === 0) this.loadHistory();
  }

  onRangeChange(range: HeatmapRange) {
    this.historyRange.set(range);
    this.historyData.set([]);
    this.loadHistory();
  }

  private loadHistory() {
    if (!this.locationId) return;
    this.isLoadingHistory.set(true);
    this.historyError.set('');
    this.crowdednessService.getHistory(this.locationId, this.historyRange()).subscribe({
      next: (data) => { this.historyData.set(data); this.isLoadingHistory.set(false); },
      error: () => { this.historyError.set('Could not load history.'); this.isLoadingHistory.set(false); }
    });
  }

  // ngOnInit runs once after Angular has set all @Input() values.
  // This is where we fetch the current crowdedness level from the API.
  ngOnInit() {
    if (!this.locationId) return;

    this.crowdednessService.getCrowdedness(this.locationId).subscribe({
      next: (data) => this.crowdLevel.set(data.level),
      error: (err) => this.errorMessage.set(`Could not load crowdedness: ${err.status} ${err.statusText || err.message || 'Unknown error'}`)
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
