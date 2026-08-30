import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { DayStatus } from '../models';
import { CuadreAgentesService } from './cuadre-agentes.service';

/**
 * Estado compartido de "¿está aperturado el día de hoy?" — un singleton
 * `providedIn: 'root'`, mismo patrón que `PurchaseDraftStore`/
 * `SalesDraftStore` (ver esos archivos), para que el Sidebar (montado una
 * sola vez para todo `/dashboard/*`) y la página de Bancos (que se
 * destruye y recrea en cada navegación) lean y escriban exactamente el
 * mismo signal. Así, guardar saldos o aperturar el día en Bancos
 * actualiza el enlace de Cuadre Agentes en el Sidebar de inmediato, sin
 * recargar la página — el mismo mecanismo que ya usan los "puntos de
 * borrador en progreso" de Ventas/Compras.
 *
 * Siempre representa el día de HOY — Cuadre Agentes no tiene selector de
 * fecha propio, y la secuencia obligatoria de este ticket es
 * explícitamente sobre "el día actual", no sobre una fecha arbitraria.
 */
@Injectable({ providedIn: 'root' })
export class DayStatusService {
  private readonly cuadreAgentesService = inject(CuadreAgentesService);

  readonly status = signal<DayStatus | null>(null);
  readonly loading = signal(true);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.cuadreAgentesService.getDayStatus().subscribe({
      next: (status) => {
        this.status.set(status);
        this.loading.set(false);
      },
      error: () => {
        // Un fallo de red no debe dejar el estado anterior mintiendo — sin
        // dato confiable, todo lo que depende de esto (Sidebar, gates)
        // debe tratarlo como "no disponible todavía", nunca como "sí se
        // puede".
        this.status.set(null);
        this.loading.set(false);
      },
    });
  }

  openDay(): Observable<DayStatus> {
    return this.cuadreAgentesService.openDay().pipe(tap((status) => this.status.set(status)));
  }
}
