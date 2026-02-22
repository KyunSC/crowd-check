import { Component, signal } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { VoteButton } from '../../components/vote-button/vote-button';
import { CrowdMeter } from '../../components/crowd-meter/crowd-meter';
import { ConfirmButton } from '../../components/confirm-button/confirm-button';

@Component({
  selector: 'app-gym-page',
  imports: [HomeButton, VoteButton, CrowdMeter, ConfirmButton],
  templateUrl: './gym-page.html',
  styleUrl: './gym-page.css',
})
export class GymPage {
  crowdLevel = signal(0);
  pendingLevel = signal(0);

  onConfirm() {
    this.crowdLevel.set(this.pendingLevel());
  }
}
