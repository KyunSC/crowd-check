import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  imports: [LucideAngularModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle implements OnInit, OnDestroy {
  readonly Sun = Sun;
  readonly Moon = Moon;
  isDark = signal(false);
  private darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mediaListener = (e: MediaQueryListEvent) => this.applyTheme(e.matches);

  ngOnInit() {
    this.applyTheme(this.darkMediaQuery.matches);
    this.darkMediaQuery.addEventListener('change', this.mediaListener);
  }

  ngOnDestroy() {
    this.darkMediaQuery.removeEventListener('change', this.mediaListener);
  }

  toggleTheme() {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
}
