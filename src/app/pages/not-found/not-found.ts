import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h1 class="text-6xl font-bold text-base-content/20">404</h1>
      <p class="text-lg text-base-content/60">This page doesn't exist.</p>
      <a routerLink="/" class="btn btn-primary btn-sm">Back to Home</a>
    </div>
  `,
})
export class NotFound {}
