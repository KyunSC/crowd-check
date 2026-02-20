import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-crowd-meter',
  imports: [],
  templateUrl: './crowd-meter.html',
  styleUrl: './crowd-meter.css',
})
export class CrowdMeter {
  @Input() level: number = 0;
}
