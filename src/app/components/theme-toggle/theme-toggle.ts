import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle {
  isDark = signal(false);
toggleTheme() {
  this.isDark.update(value => !value);
  document.body.classList.toggle('dark-theme');
}

}
