import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vote-button',
  imports: [],
  templateUrl: './vote-button.html',
  styleUrl: './vote-button.css',
})
export class VoteButton {
  @Input() label: string = 'Vote';
  @Input() value: number = 0;
  @Input() selected: boolean = false;
  @Output() voted = new EventEmitter<number>();

  onClick() {
    this.voted.emit(this.value);
  }
}
