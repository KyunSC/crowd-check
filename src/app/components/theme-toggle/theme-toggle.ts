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
  private mediaListener = (e: MediaQueryListEvent) => {
    // Only follow OS changes if the user hasn't manually picked a theme.
    if (!localStorage.getItem('theme')) this.applyTheme(e.matches);
  };

  ngOnInit() {
    // Priority: saved preference > OS preference.
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : this.darkMediaQuery.matches;
    this.applyTheme(dark);
    this.darkMediaQuery.addEventListener('change', this.mediaListener);
  }

  ngOnDestroy() {
    this.darkMediaQuery.removeEventListener('change', this.mediaListener);
  }

  toggleTheme() {
    const dark = !this.isDark();
    this.applyTheme(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
}
