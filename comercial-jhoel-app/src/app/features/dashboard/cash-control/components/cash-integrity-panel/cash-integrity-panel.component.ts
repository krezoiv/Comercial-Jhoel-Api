import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  CashIntegrityReport,
  CashStatementDay,
  INTEGRITY_CLASSIFICATION_LABEL,
  INTEGRITY_SEVERITY_LABEL,
  INTEGRITY_STATUS_LABEL,
  IntegrityFinding,
  IntegrityTimelineCount,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { onCashChanged } from '../../../../../core/services/cash-control-sync.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatDifference, formatGuatemalaDateTime, formatIsoDate, guatemalaToday } from '../../cash-control.util';
import { DifferenceResolutionModalComponent } from '../difference-resolution-modal/difference-resolution-modal.component';
import { IntegrityWindowModalComponent } from '../integrity-window-modal/integrity-window-modal.component';

interface TimelineRow extends IntegrityTimelineCount {
  location: 'Caja' | 'Bodega';
  /** Change of the difference against the previous count of the same location. */
  change: number;
}

/**
 * "Auditoría" tab of Control de Efectivo (supervisors and admins): runs the
 * backend audit for a bank day (default: current) or a range and shows its
 * status, the arqueo de apertura, every count with the change of its
 * difference (where a shortage started) and the findings — facts with users,
 * dates and amounts — with "Investigar" (movements of the stretch) and, for
 * admins, "Resolver" (documented closing of a count difference). It never
 * corrects anything by itself.
 */
@Component({
  selector: 'app-cash-integrity-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DifferenceResolutionModalComponent, IntegrityWindowModalComponent],
  templateUrl: './cash-integrity-panel.component.html',
  styleUrl: './cash-integrity-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashIntegrityPanelComponent implements OnChanges {
  @Input() canOperate = false;
  @Input() canResolve = false;
  /** Bumped by the page after an opening count or another custody write. */
  @Input() refreshKey = 0;
  @Output() countOpening = new EventEmitter<void>();

  private readonly service = inject(CashControlService);
  private request: Subscription | null = null;

  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly classificationLabel = INTEGRITY_CLASSIFICATION_LABEL;
  readonly severityLabel = INTEGRITY_SEVERITY_LABEL;
  readonly statusLabel = INTEGRITY_STATUS_LABEL;
  readonly today = guatemalaToday();

  readonly mode = signal<'DAY' | 'RANGE'>('DAY');
  readonly bankDate = signal('');
  readonly dateFrom = signal(guatemalaToday());
  readonly dateTo = signal(guatemalaToday());
  readonly days = signal<CashStatementDay[]>([]);
  readonly report = signal<CashIntegrityReport | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly investigating = signal<IntegrityFinding | null>(null);
  readonly resolving = signal<IntegrityFinding | null>(null);

  readonly findings = computed(() => this.report()?.findings ?? []);
  readonly byKey = computed(() => new Map(this.findings().map((f) => [f.key, f])));
  /** Movements of the findings related to the one being investigated (highlighted). */
  readonly flagged = computed(() => {
    const finding = this.investigating();
    const byKey = this.byKey();
    return finding ? finding.relatedKeys.flatMap((key) => byKey.get(key)?.movementIds ?? []) : [];
  });
  readonly timeline = computed<TimelineRow[]>(() => {
    const r = this.report();
    if (!r) return [];
    const rows = (location: 'Caja' | 'Bodega', previous: IntegrityTimelineCount | null, counts: IntegrityTimelineCount[]) => {
      let before = previous?.difference ?? 0;
      return counts.map((count) => {
        const change = Math.round((count.difference - before) * 100) / 100;
        before = count.difference;
        return { ...count, location, change };
      });
    };
    return [
      ...rows('Caja', r.timeline.previousCaja, r.timeline.caja),
      ...rows('Bodega', r.timeline.previousBodega, r.timeline.bodega),
    ].sort((a, b) => new Date(a.countedAt).getTime() - new Date(b.countedAt).getTime());
  });

  constructor() {
    onCashChanged(() => {
      if (!this.report() || this.report()!.period.isCurrent) this.load();
    });
    this.service.getStatementDays(30).subscribe({ next: (days) => this.days.set(days), error: () => this.days.set([]) });
  }

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    const query =
      this.mode() === 'DAY'
        ? { bankDate: this.bankDate() || undefined }
        : { dateFrom: this.dateFrom(), dateTo: this.dateTo() };
    this.loading.set(true);
    this.request?.unsubscribe();
    this.request = this.service.getIntegrity(query).subscribe({
      next: (report) => {
        this.report.set(report);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo ejecutar la auditoría.'));
      },
    });
  }

  setMode(mode: 'DAY' | 'RANGE'): void {
    this.mode.set(mode);
    this.load();
  }

  related(finding: IntegrityFinding): IntegrityFinding[] {
    const byKey = this.byKey();
    return finding.relatedKeys.map((key) => byKey.get(key)).filter((f): f is IntegrityFinding => !!f);
  }

  relatedTitles(finding: IntegrityFinding): string {
    return this.related(finding)
      .map((other) => other.title)
      .join(' · ');
  }

  canResolveFinding(finding: IntegrityFinding): boolean {
    return this.canResolve && !!finding.count && finding.count.difference !== 0 && !finding.count.resolution;
  }

  onResolved(): void {
    this.resolving.set(null);
    this.load();
  }
}
