import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Library } from './pages/library/library';
import { Gym } from './pages/gym/gym';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'library', component: Library },
  { path: 'gym', component: Gym }

];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
