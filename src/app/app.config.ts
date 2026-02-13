import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LibraryButton } from './pages/library-button/library-button';
import { GymButton } from './pages/gym-button/gym-button';
import { GymPage } from './pages/gym-page/gym-page';
import { LibraryPage } from './pages/library-page/library-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'library', component: LibraryButton },
  { path: 'gym', component: GymButton },
  { path: 'gym-page', component: GymPage },
  { path: 'library-page', component: LibraryPage }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
