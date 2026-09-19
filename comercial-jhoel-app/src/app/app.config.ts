import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, LOCALE_ID, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'es' },
    // Scroll behavior (both "scroll to top on route change" and "scroll to
    // #anchor") is handled entirely by FragmentScrollService instead of
    // withInMemoryScrolling: the router's built-in scroll restoration races
    // with — and wins over — a manual scroll on the very same navigation,
    // and its anchorScrolling doesn't retry once a lazy-loaded route's DOM
    // is ready, nor does it fire when only the fragment changes on an
    // already-active route.
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Registrado solo en producción (build), nunca en `ng serve` — el mismo
    // Service Worker sirve como PWA offline shell Y como receptor de Web
    // Push (`SwPush`) — nunca un segundo Service Worker aparte.
    //
    // `registerImmediately`, NO `registerWhenStable` (el default de Angular):
    // verificado en vivo en producción que `registerWhenStable:30000` tardaba
    // el techo completo de 30s en registrar el Service Worker en esta landing
    // — `ApplicationRef.whenStable()` nunca "gana" la carrera contra el
    // timeout, porque la página tiene actividad continua dentro de la zona de
    // Angular (temporizadores/observers del carrusel de noticias y de
    // `RevealOnScrollDirective`) que impide que la app se considere
    // "estable". Con el banner de notificaciones visible desde el primer
    // segundo, casi cualquier clic en "Activar notificaciones" ocurría ANTES
    // de que el Service Worker existiera — `SwPush.requestSubscription()`
    // simplemente se quedaba colgado (nunca resuelve ni rechaza) hasta que el
    // registro finalmente ocurría, hasta 30s después, lo cual explicaba
    // activaciones que parecían fallar o quedarse pegadas según qué tan
    // rápido el visitante hacía clic. `registerImmediately` no bloquea el
    // arranque de la app (el registro ocurre en segundo plano) y elimina esa
    // ventana de carrera por completo.
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ]
};
