import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Gym } from './pages/gym/gym';
import { Library } from './pages/library/library';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Gym, Library],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crowd-check');
}
