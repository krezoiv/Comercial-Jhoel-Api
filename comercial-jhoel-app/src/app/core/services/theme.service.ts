import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, ThemePreference, ThemePreferencesResponse } from '../models';
import { NotificationService } from './notification.service';

const THEME_CACHE_KEY = 'cj_theme';
const THEME_ATTR = 'data-theme';
const PREFERENCES_URL = `${environment.apiUrl}/users/me/preferences`;
const UPDATE_THEME_URL = `${PREFERENCES_URL}/theme`;
/** Misma clave que `AuthService` usa para el JWT — duplicada a propósito en vez de importar `AuthService` aquí (evitaría el ciclo real: `AuthService` ya inyecta `ThemeService`). */
const AUTH_TOKEN_KEY = 'cj_auth_token';

/**
 * Única fuente de verdad para "Modo Claro / Modo Oscuro" en todo el
 * frontend — ningún componente debe leer/escribir el atributo
 * `data-theme` ni `localStorage` directamente, todos pasan por aquí (ver
 * el botón del `DashboardTopbarComponent`).
 *
 * La base de datos (usuario autenticado) es la fuente de verdad real —
 * `localStorage` es solo un caché para pintar el tema correcto de
 * inmediato al cargar la app (evita el parpadeo claro→oscuro mientras la
 * llamada a `GET /users/me/preferences` todavía está en vuelo) y nunca se
 * consulta después del arranque. `AuthService` es quien decide CUÁNDO
 * llamar a `loadUserTheme()` (tras `restoreSession()` y tras un login
 * exitoso) — este servicio no sabe nada de autenticación, el
 * `authInterceptor` ya adjunta el JWT a cualquier llamada a
 * `environment.apiUrl` automáticamente.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  readonly theme = signal<ThemePreference>(this.readCachedTheme());

  constructor() {
    // Aplica el caché sincrónicamente en cuanto este servicio se
    // construye (uno de los primeros providers `root` que arranca la
    // app) — lo más temprano posible sin necesitar un `APP_INITIALIZER`,
    // igual de efectivo para el propósito real: que el primer paint ya
    // use el tema correcto en la enorme mayoría de los casos. Solo si hay
    // una sesión guardada — "Modo Claro/Oscuro" es una preferencia del
    // panel autenticado, nunca debe filtrarse al sitio público (landing,
    // login) para un visitante sin sesión o justo después de cerrarla.
    if (this.hasSession()) {
      this.applyTheme(this.theme());
    }
  }

  getTheme(): ThemePreference {
    return this.theme();
  }

  /**
   * Cambio optimista: aplica y cachea de inmediato (toda la app reacciona
   * al signal en el mismo tick), luego persiste en backend. Si el
   * guardado falla, revierte visualmente al valor anterior y avisa —
   * nunca deja el frontend "creyendo" un tema que el backend no aceptó.
   */
  setTheme(theme: ThemePreference): void {
    if (this.theme() === theme) {
      return;
    }
    const previous = this.theme();
    this.applyAndCache(theme);

    this.http
      .patch<ApiSuccessResponse<ThemePreferencesResponse>>(UPDATE_THEME_URL, { theme })
      .pipe(
        catchError(() => {
          this.applyAndCache(previous);
          this.notificationService.error('No se pudo guardar la preferencia de tema. Se mantuvo el tema anterior.');
          return of(null);
        }),
      )
      .subscribe();
  }

  /**
   * "El backend debe tener prioridad" al iniciar sesión — se llama desde
   * `AuthService` tras restaurar sesión y tras un login exitoso, nunca
   * desde un componente de UI. Un fallo de red aquí deja el tema cacheado
   * tal cual estaba (mejor una preferencia potencialmente desactualizada
   * que ningún tema aplicado).
   */
  loadUserTheme(): void {
    this.http
      .get<ApiSuccessResponse<ThemePreferencesResponse>>(PREFERENCES_URL)
      .pipe(
        tap(({ data }) => this.applyAndCache(data.theme)),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  /** `AuthService.logout()` llama esto — quita el atributo del documento de inmediato para que el sitio público nunca herede el tema oscuro de la sesión recién cerrada. */
  reset(): void {
    this.theme.set('LIGHT');
    localStorage.removeItem(THEME_CACHE_KEY);
    document.documentElement.removeAttribute(THEME_ATTR);
  }

  private applyAndCache(theme: ThemePreference): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(THEME_CACHE_KEY, theme);
  }

  private applyTheme(theme: ThemePreference): void {
    document.documentElement.setAttribute(THEME_ATTR, theme === 'DARK' ? 'dark' : 'light');
  }

  private readCachedTheme(): ThemePreference {
    return localStorage.getItem(THEME_CACHE_KEY) === 'DARK' ? 'DARK' : 'LIGHT';
  }

  private hasSession(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
