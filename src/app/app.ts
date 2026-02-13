import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GymButton } from './pages/gym-button/gym-button';
import { LibraryButton } from './pages/library-button/library-button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GymButton, LibraryButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crowd-check');
}
