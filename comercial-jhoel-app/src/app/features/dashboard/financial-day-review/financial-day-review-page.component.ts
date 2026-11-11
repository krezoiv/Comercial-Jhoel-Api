import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import {
  ButtonComponent,
  CardComponent,
  EmptyStateComponent,
  IconComponent,
  PageHeaderComponent,
} from '../../../shared/ui';
import {
  CloseReviewSummary,
  CorrectionRequest,
  FinancialDayDetail,
  FinancialDayListItem,
  REVIEW_STATUS_LABEL,
} from '../../../core/models';
import { FinancialDayReviewService } from '../../../core/services/financial-day-review.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { formatCurrency } from '../../../core/utils/number-format.util';
import { DayReviewPanelComponent } from './components/day-review-panel/day-review-panel.component';
import { OpenReviewModalComponent } from './components/open-review-modal/open-review-modal.component';
import {
  CorrectionModalComponent,
  CorrectionSubmission,
} from './components/correction-modal/correction-modal.component';
import {
  CloseReviewModalComponent,
  CloseReviewSubmission,
} from './components/close-review-modal/close-review-modal.component';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Today's date in Guatemala (`yyyy-MM-dd`), the business time zone. */
export function guatemalaToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guatemala',
  }).format(new Date());
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

interface CalendarCell {
  date: string | null;
  day: number | null;
  item: FinancialDayListItem | null;
  isToday: boolean;
  isFuture: boolean;
}

/**
 * Sistema → Administración financiera → Revisión de días operativos.
 * Pick a past day on the calendar/table, see its full diagnosis, open it in
 * an audited review session, correct that day's data and close the review.
 * The page only orchestrates: every figure, recalculation, isolation check
 * and permission lives in the backend.
 */
@Component({
  selector: 'app-financial-day-review-page',
  standalone: true,
  imports: [
    DatePipe,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    IconComponent,
    PageHeaderComponent,
    DayReviewPanelComponent,
    OpenReviewModalComponent,
    CorrectionModalComponent,
    CloseReviewModalComponent,
  ],
  templateUrl: './financial-day-review-page.component.html',
  styleUrl: './financial-day-review-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDayReviewPageComponent implements OnInit {
  private readonly service = inject(FinancialDayReviewService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly today = guatemalaToday();
  readonly weekdays = WEEKDAYS;
  readonly statusLabel = REVIEW_STATUS_LABEL;
  readonly formatCurrency = formatCurrency;

  readonly month = signal(this.today.slice(0, 7));
  readonly days = signal<FinancialDayListItem[]>([]);
  readonly loadingDays = signal(false);
  readonly selectedDate = signal<string | null>(null);
  readonly detail = signal<FinancialDayDetail | null>(null);
  readonly loadingDetail = signal(false);
  readonly search = signal('');

  readonly isOpenModal = signal(false);
  readonly correctionRequest = signal<CorrectionRequest | null>(null);
  readonly closeSummary = signal<CloseReviewSummary | null>(null);
  readonly saving = signal(false);
  readonly modalError = signal<string | null>(null);

  readonly username = computed(() => this.auth.currentUser()?.username ?? '');

  readonly monthLabel = computed(() => {
    const [year, month] = this.month().split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('es-GT', {
      month: 'long',
      year: 'numeric',
    });
  });

  readonly calendar = computed<CalendarCell[]>(() => {
    const [year, month] = this.month().split('-').map(Number);
    const first = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const offset = (first.getDay() + 6) % 7; // Monday first
    const byDate = new Map(this.days().map((d) => [d.date, d]));
    const cells: CalendarCell[] = Array.from({ length: offset }, () => ({
      date: null,
      day: null,
      item: null,
      isToday: false,
      isFuture: false,
    }));
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${pad(month)}-${pad(day)}`;
      cells.push({
        date,
        day,
        item: byDate.get(date) ?? null,
        isToday: date === this.today,
        isFuture: date > this.today,
      });
    }
    return cells;
  });

  readonly filteredDays = computed(() => {
    const term = this.search().trim();
    return term
      ? this.days().filter((d) => d.date.includes(term))
      : this.days();
  });

  readonly session = computed(() => this.detail()?.activeSession ?? null);

  /** The administrator can correct only inside their own open session. */
  readonly canEdit = computed(() => {
    const detail = this.detail();
    return (
      !!detail?.activeSession &&
      detail.permissions.canCorrect &&
      detail.permissions.isSessionOwner
    );
  });

  readonly canOpenReview = computed(() => {
    const detail = this.detail();
    const item = this.selectedItem();
    if (
      !detail ||
      detail.activeSession ||
      !detail.permissions.canCorrect ||
      detail.date >= this.today
    ) {
      return false;
    }
    return (
      item?.agentDayStatus !== 'ABIERTO' && item?.cashDayStatus !== 'ABIERTO'
    );
  });

  readonly selectedItem = computed(
    () => this.days().find((d) => d.date === this.selectedDate()) ?? null,
  );

  ngOnInit(): void {
    this.loadDays();
  }

  loadDays(): void {
    const [year, month] = this.month().split('-').map(Number);
    const from = `${year}-${pad(month)}-01`;
    const to = `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`;
    this.loadingDays.set(true);
    this.service
      .listDays(from, to)
      .pipe(
        finalize(() => this.loadingDays.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (days) => this.days.set(days),
        error: (error: HttpErrorResponse) =>
          this.notifications.error(
            extractErrorMessage(
              error,
              'No se pudieron cargar los días operativos.',
            ),
          ),
      });
  }

  shiftMonth(delta: number): void {
    const [year, month] = this.month().split('-').map(Number);
    const next = new Date(year, month - 1 + delta, 1);
    this.month.set(`${next.getFullYear()}-${pad(next.getMonth() + 1)}`);
    this.loadDays();
  }

  goToDate(value: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return;
    }
    if (value.slice(0, 7) !== this.month()) {
      this.month.set(value.slice(0, 7));
      this.loadDays();
    }
    this.selectDay(value);
  }

  selectDay(date: string | null): void {
    if (!date || date > this.today) {
      return;
    }
    this.selectedDate.set(date);
    this.reloadDetail();
  }

  reloadDetail(): void {
    const date = this.selectedDate();
    if (!date) {
      return;
    }
    this.loadingDetail.set(true);
    this.service
      .getDay(date)
      .pipe(
        finalize(() => this.loadingDetail.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (detail) => this.detail.set(detail),
        error: (error: HttpErrorResponse) => {
          this.detail.set(null);
          this.notifications.error(
            extractErrorMessage(error, 'No se pudo cargar el día.'),
          );
        },
      });
  }

  // ── Open review ────────────────────────────────────────────────────────

  openReviewModal(): void {
    this.modalError.set(null);
    this.isOpenModal.set(true);
  }

  confirmOpen(reason: string): void {
    const date = this.selectedDate();
    if (!date || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.modalError.set(null);
    this.service
      .openReview(date, reason)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.isOpenModal.set(false);
          this.notifications.success('Día abierto en modo de revisión.');
          this.reloadDetail();
          this.loadDays();
        },
        error: (error: HttpErrorResponse) =>
          this.modalError.set(
            extractErrorMessage(
              error,
              'No se pudo abrir el día para revisión.',
            ),
          ),
      });
  }

  // ── Corrections ────────────────────────────────────────────────────────

  onCorrect(request: CorrectionRequest): void {
    if (!this.canEdit()) {
      return;
    }
    this.modalError.set(null);
    this.correctionRequest.set(request);
  }

  confirmCorrection(submission: CorrectionSubmission): void {
    const session = this.session();
    if (!session || this.saving()) {
      return;
    }
    const meta = {
      reason: submission.reason,
      observations: submission.observations || undefined,
      requestId: submission.requestId,
    };
    const call =
      submission.request.kind === 'SNAPSHOT'
        ? this.service.correctSnapshot(session.id, {
            target: submission.request.target,
            targetId: submission.request.targetId,
            field: submission.request.field,
            newValue: submission.newValue,
            ...meta,
          })
        : this.service.adjustMovement(session.id, {
            source: submission.request.source,
            sourceId: submission.request.sourceId,
            correctedAmount: submission.newValue,
            ...meta,
          });
    this.saving.set(true);
    this.modalError.set(null);
    call.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.correctionRequest.set(null);
        this.notifications.success('Corrección guardada y auditada.');
        this.reloadDetail();
      },
      error: (error: HttpErrorResponse) =>
        this.modalError.set(
          extractErrorMessage(error, 'No se pudo guardar la corrección.'),
        ),
    });
  }

  // ── Close review ───────────────────────────────────────────────────────

  requestClose(): void {
    const session = this.session();
    if (!session || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.modalError.set(null);
    this.service
      .requestClose(session.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (summary) => this.closeSummary.set(summary),
        error: (error: HttpErrorResponse) =>
          this.notifications.error(
            extractErrorMessage(
              error,
              'No se pudo preparar el cierre de la revisión.',
            ),
          ),
      });
  }

  confirmClose(submission: CloseReviewSubmission): void {
    const summary = this.closeSummary();
    if (!summary || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.modalError.set(null);
    this.service
      .close(summary.session.id, {
        observations: submission.observations || undefined,
        acceptPendingDifferences: submission.acceptPendingDifferences,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.closeSummary.set(null);
          this.notifications.success(
            'Revisión cerrada. Las correcciones quedaron registradas en la auditoría.',
          );
          this.reloadDetail();
          this.loadDays();
        },
        error: (error: HttpErrorResponse) =>
          this.modalError.set(
            extractErrorMessage(error, 'No se pudo cerrar la revisión.'),
          ),
      });
  }

  cancelModal(): void {
    if (this.saving()) {
      return;
    }
    this.isOpenModal.set(false);
    this.correctionRequest.set(null);
    if (this.closeSummary()) {
      // The session stays PENDING_CONFIRMATION until a new correction or the close.
      this.closeSummary.set(null);
      this.reloadDetail();
    }
    this.modalError.set(null);
  }

  money(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : formatCurrency(value);
  }
}
