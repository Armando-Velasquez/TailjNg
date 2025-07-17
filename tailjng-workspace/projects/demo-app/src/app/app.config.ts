import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { TAILJNG_CONFIG } from 'tailjng';
import { CurrencyPipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    {
      provide: TAILJNG_CONFIG,
      useValue: {
        urlBase: 'https://crm-rest.dudu.com.ec/api/v1',
        socketUrl: 'https://crm-rest.dudu.com.ec',
      }
    },

    provideHttpClient(withInterceptors([])),
    provideClientHydration(withEventReplay()),

    provideAnimations(),
    
    CurrencyPipe,
  ]
};
