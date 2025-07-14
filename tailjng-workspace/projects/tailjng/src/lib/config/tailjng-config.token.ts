import { InjectionToken } from '@angular/core';
import { TailjngConfig } from '../interfaces/config.interface';


export const TAILJNG_CONFIG = new InjectionToken<TailjngConfig>('TAILJNG_CONFIG');


// providers: [
//     provideRouter(routes),
//     {
//         provide: TAILJNG_CONFIG,
//         useValue: {
//             urlBase: environment.urlBase,
//             socketUrl: environment.socketUrl,
//         }
//     }
// ]