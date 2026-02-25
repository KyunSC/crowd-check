import { Component, Input, signal } from '@angular/core';
import { VoteButton } from '../vote-button/vote-button';
import { CrowdMeter } from '../crowd-meter/crowd-meter';
import { ConfirmButton } from '../confirm-button/confirm-button';

@Component({
  selector: 'app-floor-voting-panel',
  imports: [VoteButton, CrowdMeter, ConfirmButton],
  templateUrl: './floor-voting-panel.html',
  styleUrl: './floor-voting-panel.css',
})
export class FloorVotingPanel {
  @Input() floorName = '';

  crowdLevel = signal(0);
  pendingLevel = signal(0);

  onConfirm() {
    this.crowdLevel.set(this.pendingLevel());
  }
}
