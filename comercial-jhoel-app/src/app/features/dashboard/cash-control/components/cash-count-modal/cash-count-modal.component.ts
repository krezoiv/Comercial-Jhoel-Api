import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  CASH_COUNT_RESULT_LABEL,
  CashCountDraft,
  CashCountDraftPayload,
  CashCountRecord,
  CashCustody,
  formatCurrency,
} from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { AuthService } from '../../../../../core/services/auth.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, formatGuatemalaDateTime, formatIsoDate, round2 } from '../../cash-control.util';

/**
 * "Arqueo de Caja": count the bills and coins physically in the caja and
 * compare them with the theoretical caja balance. The live difference is a
 * preview; on save the backend reads the theoretical balance under its lock,
 * stores the photograph and returns the official result (cuadrado / faltante
 * / sobrante). It never adjusts the caja nor writes a Kardex movement. Bodega
 * cash is shown separately and is never part of the caja count; it may be
 * counted optionally for the consolidated view.
 *
 * With `correctionOf` it is the audited correction of an earlier count
 * (admin): same photograph (theoretical values of that moment), new
 * quantities and a mandatory reason; the original stays as "reemplazado".
 *
 * Draft persistence (new counts only): every change is written at once to a
 * local copy (`localStorage`, keyed by user and bank day) and autosaved to the
 * backend (`PUT /cash-control/counts/draft`, debounced) — the database is the
 * source of truth, so the typed quantities survive navigating away, a reload,
 * closing the browser and a new login. On open the newest of both copies is
 * restored (a local copy newer than the server one is re-synced). The draft
 * is cleared only when the count is confirmed (the backend deletes it) or by
 * an explicit "Reiniciar arqueo".
 */
@Component({
  selector: 'app-cash-count-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './cash-count-modal.component.html',
  styleUrl: './cash-count-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCountModalComponent implements OnChanges {
  @Input() open = false;
  /** Official custody balances (backend) at the time the form opens. */
  @Input() custody: CashCustody | null = null;
  /** Earlier count being corrected (admin), or `null` for a new count. */
  @Input() correctionOf: CashCountRecord | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashCountRecord>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly resultLabel = CASH_COUNT_RESULT_LABEL;

  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly countWarehouse = signal(false);
  readonly warehouseCounted = signal<number | null>(null);
  readonly reason = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  /** The count as stored by the backend (shown after saving). */
  readonly result = signal<CashCountRecord | null>(null);
  readonly openedAt = signal(new Date().toISOString());
  private readonly theoreticalSignal = signal(0);
  private readonly warehouseSignal = signal(0);
  private requestId = crypto.randomUUID();

  /** Autosave indicator: Guardando… / Guardado correctamente / Error al guardar. */
  readonly draftStatus = signal<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  readonly draftSavedAt = signal<string | null>(null);
  readonly draftError = signal<string | null>(null);
  /** A draft (server or local) was restored when the form opened. */
  readonly draftRestored = signal(false);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingSave = false;
  /** Bumped on every open: responses of an earlier opening are ignored. */
  private session = 0;
  private static readonly AUTOSAVE_MS = 800;

  constructor() {
    // Leaving the screen with a pending autosave: send it now (the request outlives the component).
    this.destroyRef.onDestroy(() => {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
        this.pushDraft();
      }
    });
  }

  readonly username = computed(() => this.auth.currentUser()?.username ?? '');
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  /** Preview only; the official difference comes back from the backend. */
  readonly previewDifference = computed(() => round2(this.totalCounted() - this.theoreticalSignal()));
  readonly previewStatus = computed<CuadreStatus>(() => {
    const diff = this.previewDifference();
    return diff === 0 ? 'green' : diff > 0 ? 'red' : 'yellow';
  });
  readonly theoretical = computed(() => this.theoreticalSignal());
  readonly warehouseTheoretical = computed(() => this.warehouseSignal());
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      (!this.correctionOf || this.reason().trim().length >= 5) &&
      (!this.countWarehouse() || (this.warehouseCounted() ?? -1) >= 0),
  );

  ngOnChanges(): void {
    if (!this.open || this.isSaving()) {
      return;
    }
    const original = this.correctionOf;
    this.theoreticalSignal.set(original ? original.systemCash : (this.custody?.cashBalance ?? 0));
    this.warehouseSignal.set(original ? original.warehouseBalance : (this.custody?.warehouseBalance ?? 0));
    this.cashCounts.set(
      original
        ? { ...emptyCashCounts(), ...Object.fromEntries(original.details.map((row) => [String(row.denomination), row.quantity])) }
        : emptyCashCounts(),
    );
    this.observations.set(original?.observations ?? '');
    this.countWarehouse.set(original?.warehouseCounted !== null && original?.warehouseCounted !== undefined);
    this.warehouseCounted.set(original?.warehouseCounted ?? null);
    this.reason.set('');
    this.errorMessage.set(null);
    this.result.set(null);
    this.openedAt.set(original?.countedAt ?? new Date().toISOString());
    this.requestId = crypto.randomUUID();
    this.draftRestored.set(false);
    this.draftError.set(null);
    if (!original) {
      this.restoreDraft();
    } else {
      this.draftStatus.set('idle');
    }
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
    this.scheduleDraftSave();
  }

  setObservations(value: string): void {
    this.observations.set(value);
    this.scheduleDraftSave();
  }

  setCountWarehouse(value: boolean): void {
    this.countWarehouse.set(value);
    this.scheduleDraftSave();
  }

  setWarehouseCounted(value: number | null): void {
    this.warehouseCounted.set(value);
    this.scheduleDraftSave();
  }

  /** Whether anything was typed (enables "Reiniciar arqueo"). */
  readonly hasInput = computed(
    () =>
      Object.values(this.cashCounts()).some((q) => (q || 0) > 0) ||
      this.observations().trim().length > 0 ||
      this.countWarehouse(),
  );

  /** "Reiniciar arqueo": explicit, confirmed reset — discards the draft (server and local). */
  async resetDraft(): Promise<void> {
    if (this.correctionOf || this.isSaving()) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'DELETE',
      title: 'Reiniciar arqueo',
      message: 'Se borrarán todas las cantidades ingresadas en este arqueo en proceso. ¿Deseas empezar de nuevo?',
      confirmText: 'Reiniciar arqueo',
    });
    if (!confirmed) {
      return;
    }
    this.cancelPendingSave();
    this.applyPayload({ details: [], observations: null, countWarehouse: false, warehouseCounted: null });
    this.clearLocalDraft();
    this.draftRestored.set(false);
    this.service.discardCountDraft().subscribe({
      next: () => {
        this.draftStatus.set('idle');
        this.draftSavedAt.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.draftStatus.set('error');
        this.draftError.set(extractErrorMessage(error, 'No se pudo reiniciar el borrador.'));
      },
    });
  }

  // ── Draft persistence ─────────────────────────────────────────────────────

  private draftKey(): string | null {
    const userId = this.auth.currentUser()?.id;
    const day = this.custody?.currentDay?.businessDate;
    return userId && day ? `cj_cash_count_draft:${userId}:${day}` : null;
  }

  private payload(): CashCountDraftPayload {
    return {
      details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
      observations: this.observations().trim() || null,
      countWarehouse: this.countWarehouse(),
      warehouseCounted: this.countWarehouse() ? (this.warehouseCounted() ?? null) : null,
    };
  }

  private applyPayload(payload: CashCountDraftPayload): void {
    this.cashCounts.set({
      ...emptyCashCounts(),
      ...Object.fromEntries(payload.details.map((row) => [String(row.denomination), row.quantity])),
    });
    this.observations.set(payload.observations ?? '');
    this.countWarehouse.set(payload.countWarehouse);
    this.warehouseCounted.set(payload.warehouseCounted);
  }

  private readLocalDraft(): { payload: CashCountDraftPayload; savedAt: string } | null {
    const key = this.draftKey();
    if (!key) {
      return null;
    }
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as { payload: CashCountDraftPayload; savedAt: string }) : null;
    } catch {
      return null;
    }
  }

  private writeLocalDraft(): void {
    const key = this.draftKey();
    if (!key) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify({ payload: this.payload(), savedAt: new Date().toISOString() }));
    } catch {
      // Storage unavailable (private mode / quota): the server copy still applies.
    }
  }

  private clearLocalDraft(): void {
    const key = this.draftKey();
    if (!key) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  /** On open: show the local copy at once, then reconcile with the server draft (newest wins). */
  private restoreDraft(): void {
    const session = ++this.session;
    const local = this.readLocalDraft();
    if (local) {
      this.applyPayload(local.payload);
      this.draftRestored.set(true);
    }
    this.draftStatus.set('loading');
    this.service.getCountDraft().subscribe({
      next: (server: CashCountDraft | null) => {
        if (session !== this.session) {
          return;
        }
        const localNewer = !!local && (!server || new Date(local.savedAt) > new Date(server.updatedAt));
        if (server && !localNewer) {
          this.applyPayload(server.payload);
          this.draftRestored.set(true);
          this.writeLocalDraft();
          this.draftStatus.set('saved');
          this.draftSavedAt.set(server.updatedAt);
        } else if (localNewer) {
          // An earlier autosave did not reach the server: sync it now.
          this.pushDraft();
        } else {
          this.draftStatus.set('idle');
        }
      },
      error: () => {
        if (session !== this.session) {
          return;
        }
        this.draftStatus.set(local ? 'error' : 'idle');
        if (local) {
          this.draftError.set('No se pudo consultar el borrador guardado; se muestra la copia de este navegador.');
        }
      },
    });
  }

  private scheduleDraftSave(): void {
    if (this.correctionOf || !this.open) {
      return;
    }
    this.writeLocalDraft();
    this.draftStatus.set('saving');
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.pushDraft();
    }, CashCountModalComponent.AUTOSAVE_MS);
  }

  private cancelPendingSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  private pushDraft(): void {
    if (this.pendingSave) {
      // One request at a time; the latest values are sent when it finishes.
      this.scheduleDraftSave();
      return;
    }
    this.pendingSave = true;
    this.draftStatus.set('saving');
    this.service.saveCountDraft(this.payload()).subscribe({
      next: (draft) => {
        this.pendingSave = false;
        this.draftStatus.set('saved');
        this.draftSavedAt.set(draft.updatedAt);
        this.draftError.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.pendingSave = false;
        this.draftStatus.set('error');
        this.draftError.set(
          extractErrorMessage(error, 'No se pudo guardar el borrador.') + ' Las cantidades se conservan en este navegador.',
        );
      },
    });
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const diff = this.previewDifference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: this.correctionOf ? 'Guardar corrección del arqueo' : 'Guardar arqueo de caja',
      message:
        `Contado ${formatCurrency(this.totalCounted())} frente a un teórico de aprox. ${formatCurrency(this.theoretical())} ` +
        `(${diff === 0 ? 'cuadrado' : diff < 0 ? 'faltante de ' + formatCurrency(-diff) : 'sobrante de ' + formatCurrency(diff)}). ` +
        'El arqueo se guarda como registro histórico y no modifica el efectivo ni el Kardex.',
    });
    if (!confirmed) {
      return;
    }
    this.cancelPendingSave();
    const input = {
      details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
      observations: this.observations().trim() || undefined,
      warehouseCounted: this.countWarehouse() ? (this.warehouseCounted() ?? 0) : undefined,
      clientRequestId: this.requestId,
    };
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const request = this.correctionOf
      ? this.service.correctCount(this.correctionOf.id, { ...input, reason: this.reason().trim() })
      : this.service.registerCount(input);
    request.subscribe({
      next: (count) => {
        this.isSaving.set(false);
        this.result.set(count);
        if (!this.correctionOf) {
          // Confirmed: the backend already deleted the draft; drop the local copy too.
          this.cancelPendingSave();
          this.clearLocalDraft();
          this.draftStatus.set('idle');
          this.draftSavedAt.set(null);
        }
        this.saved.emit(count);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el arqueo.'));
      },
    });
  }
}
