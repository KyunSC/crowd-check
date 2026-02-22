import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  imports: [],
  templateUrl: './confirm-button.html',
  styleUrl: './confirm-button.css',
})
export class ConfirmButton {
  @Input() label: string = 'Confirm';
  @Input() disabled: boolean = false;
  @Output() confirmed = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.confirmed.emit();
    }
  }
}
