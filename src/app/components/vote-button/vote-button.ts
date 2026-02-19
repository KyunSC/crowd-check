import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vote-button',
  imports: [],
  templateUrl: './vote-button.html',
  styleUrl: './vote-button.css',
})
export class VoteButton {
  @Input() label: string = 'Vote';
}
