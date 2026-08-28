import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  username: string;
  phone: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// Every successful NestJS response is wrapped by the API's global
// ResponseInterceptor as { success: true, data: T } — error responses are
// NOT wrapped this way (GlobalExceptionFilter returns a flat
// { success: false, statusCode, message } shape instead), so only success
// bodies need unwrapping.
interface ApiSuccessResponse<T> {
  data: T;
}

const TOKEN_KEY = 'cj_auth_token';
const SESSION_KEY = 'cj_auth_session';

// Real backend now in place (see README "Fase 2"): this talks to
// `${environment.apiUrl}/auth/*`. The public signals (`currentUser`,
// `isAuthenticated`) are the contract the rest of the app depends on and
// haven't changed shape beyond AuthUser now carrying {id, username, phone}
// instead of {name, email}.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<AuthUser | null>(this.restoreSession());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(identifier: string, password: string): Observable<AuthResult> {
    return this.http
      .post<ApiSuccessResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, { identifier, password })
      .pipe(
        tap(({ data }) => this.setSession(data.accessToken, data.user)),
        map(() => ({ success: true }) as AuthResult),
        catchError((error: HttpErrorResponse) => of({ success: false, error: this.extractErrorMessage(error) })),
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<AuthResult> {
    return this.http
      .post(`${environment.apiUrl}/auth/change-password`, { currentPassword, newPassword })
      .pipe(
        map(() => ({ success: true }) as AuthResult),
        catchError((error: HttpErrorResponse) => of({ success: false, error: this.extractErrorMessage(error) })),
      );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setSession(accessToken: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const message = (error.error as { message?: string | string[] } | null)?.message;
    if (Array.isArray(message)) {
      return message.join(' ');
    }
    if (typeof message === 'string') {
      return message;
    }
    return 'No se pudo completar la solicitud. Inténtalo de nuevo.';
  }

  private restoreSession(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(SESSION_KEY);
    if (!token || !raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
