import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GymButton } from './components/gym-button/gym-button';
import { LibraryButton } from './components/library-button/library-button';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GymButton, LibraryButton, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crowd-check');
}
