import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CreateKeyboardShortcutInput,
  KeyboardShortcut,
  UpdateKeyboardShortcutInput,
} from '../models';

/** Talks to `${environment.apiUrl}/keyboard-shortcuts` — CRUD for "Sistema → Atajos de Teclado". Separate from `KeyboardShortcutsService` (the global `keydown` listener), which only ever calls `getShortcuts()` here to know what to match against. */
@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService {
  private readonly http = inject(HttpClient);

  getShortcuts(includeInactive = false): Observable<KeyboardShortcut[]> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    return this.http
      .get<ApiSuccessResponse<KeyboardShortcut[]>>(`${environment.apiUrl}/keyboard-shortcuts`, { params })
      .pipe(map((response) => response.data));
  }

  createShortcut(input: CreateKeyboardShortcutInput): Observable<KeyboardShortcut> {
    return this.http
      .post<ApiSuccessResponse<KeyboardShortcut>>(`${environment.apiUrl}/keyboard-shortcuts`, input)
      .pipe(map((response) => response.data));
  }

  updateShortcut(id: string, input: UpdateKeyboardShortcutInput): Observable<KeyboardShortcut> {
    return this.http
      .patch<ApiSuccessResponse<KeyboardShortcut>>(`${environment.apiUrl}/keyboard-shortcuts/${id}`, input)
      .pipe(map((response) => response.data));
  }

  deactivateShortcut(id: string): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${environment.apiUrl}/keyboard-shortcuts/${id}`)
      .pipe(map(() => undefined));
  }
}
