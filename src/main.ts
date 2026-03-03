import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(() => {
    document.body.innerHTML =
      '<p style="text-align:center;margin-top:4rem;font-family:sans-serif;">Something went wrong. Please refresh the page.</p>';
  });
