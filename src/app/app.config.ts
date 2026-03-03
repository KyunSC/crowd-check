import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { GymPage } from './pages/gym-page/gym-page';
import { LibrarySelector } from './pages/library-selector/library-selector';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'gym-page', component: GymPage },
  { path: 'library-select', component: LibrarySelector },
  { path: '**', component: NotFound },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};
