import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SchoolTemplate,
  SchoolTemplateSummary,
  formatCurrency,
  formatSchoolDateTime,
  roundMoney,
} from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';

interface TemplateLine {
  key: number;
  /** Requirement text (the school's own wording; never an inventory product). */
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  observations: string;
}

interface TemplateDraft {
  id: string | null;
  version: number | null;
  name: string;
  grade: string;
  description: string;
  isActive: boolean;
  lines: TemplateLine[];
}

/** Line total in cents-exact arithmetic: quantity × unit price. */
export function requirementTotal(quantity: number, unitPrice: number): number {
  return Math.round((quantity || 0) * Math.round((unitPrice || 0) * 100)) / 100;
}

/**
 * "Plantillas de Listas Escolares": the official list of each grade.
 * Everybody can consult them; only administrators create, edit, duplicate or
 * (de)activate (backend + SQL enforce it). Editing a template never changes a
 * quotation already generated — quotations keep their own copy.
 *
 * Each line is a SCHOOL REQUIREMENT typed by hand (migration 1760008400000):
 * description, quantity, quoted unit price, total and observations. Inventory
 * is never consulted here — the real product is chosen when the order is
 * prepared — so a requirement may name an item the store does not stock.
 * Requirements of another grade's template can be copied in.
 */
@Component({
  selector: 'app-school-templates',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './school-templates.component.html',
  styleUrl: './school-templates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolTemplatesComponent {
  readonly service = inject(SchoolListService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatSchoolDateTime;
  readonly requirementTotal = requirementTotal;

  readonly templates = signal<SchoolTemplateSummary[]>([]);
  readonly failed = signal(false);
  readonly expanded = signal<SchoolTemplate | null>(null);
  readonly draft = signal<TemplateDraft | null>(null);
  readonly duplicating = signal<SchoolTemplateSummary | null>(null);
  readonly copyName = signal('');
  readonly copyGrade = signal('');
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  /** Template whose requirements are copied into the one being edited. */
  readonly copyFrom = signal('');
  readonly copying = signal(false);
  private seq = 0;

  readonly canManage = computed(() => this.service.can('school_lists.templates.manage'));
  readonly draftTotal = computed(() =>
    roundMoney((this.draft()?.lines ?? []).reduce((sum, l) => sum + requirementTotal(l.quantity, l.unitPrice), 0)),
  );
  /** Other templates whose requirements can be copied in. */
  readonly copySources = computed(() => this.templates().filter((t) => t.id !== this.draft()?.id && t.itemCount > 0));
  readonly draftProblem = computed(() => {
    const d = this.draft();
    if (!d) return null;
    if (d.name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (d.grade.trim().length < 3) return 'Indique el grado escolar.';
    const bad = d.lines.find(
      (l) =>
        l.productName.trim().length < 2 ||
        !Number.isInteger(l.quantity) ||
        l.quantity < 1 ||
        l.quantity > 9999 ||
        !(l.unitPrice >= 0) ||
        roundMoney(l.unitPrice) !== l.unitPrice,
    );
    if (d.lines.some((l) => l.productName.trim().length > 300)) return 'Cada requerimiento admite hasta 300 caracteres.';
    return bad ? `Revise "${bad.productName || 'requerimiento sin descripción'}": descripción, cantidad entera y precio válido.` : null;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.service.getTemplates(this.canManage()).subscribe({
      next: (templates) => {
        this.templates.set(templates);
        this.failed.set(false);
      },
      error: () => this.failed.set(true),
    });
  }

  toggle(t: SchoolTemplateSummary): void {
    if (this.expanded()?.id === t.id) {
      this.expanded.set(null);
      return;
    }
    this.service.getTemplate(t.id).subscribe({
      next: (template) => this.expanded.set(template),
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo cargar la plantilla.')),
    });
  }

  // ── Editor ───────────────────────────────────────────────────────────────
  create(): void {
    this.error.set(null);
    this.draft.set({ id: null, version: null, name: '', grade: '', description: '', isActive: true, lines: [] });
  }

  edit(t: SchoolTemplateSummary): void {
    this.error.set(null);
    this.service.getTemplate(t.id).subscribe({
      next: (template) =>
        this.draft.set({
          id: template.id,
          version: template.version,
          name: template.name,
          grade: template.grade,
          description: template.description ?? '',
          isActive: template.isActive,
          lines: template.items.map((item) => ({
            key: ++this.seq,
            productName: item.productName,
            description: item.description ?? '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            observations: item.observations ?? '',
          })),
        }),
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo cargar la plantilla.')),
    });
  }

  patch(changes: Partial<TemplateDraft>): void {
    this.draft.update((d) => (d ? { ...d, ...changes } : d));
  }

  patchLine(key: number, changes: Partial<TemplateLine>): void {
    this.draft.update((d) => (d ? { ...d, lines: d.lines.map((l) => (l.key === key ? { ...l, ...changes } : l)) } : d));
  }

  num(value: unknown): number {
    const parsed = value === '' || value === null ? 0 : Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  addLine(): void {
    this.draft.update((d) =>
      d
        ? {
            ...d,
            lines: [
              ...d.lines,
              { key: ++this.seq, productName: '', description: '', quantity: 1, unitPrice: 0, observations: '' },
            ],
          }
        : d,
    );
  }

  /** Appends the requirements of another template (e.g. another grade) to the one being edited. */
  copyRequirements(): void {
    const sourceId = this.copyFrom();
    if (!sourceId || this.copying()) return;
    this.copying.set(true);
    this.service.getTemplate(sourceId).subscribe({
      next: (source) => {
        this.copying.set(false);
        this.copyFrom.set('');
        this.draft.update((d) =>
          d
            ? {
                ...d,
                lines: [
                  ...d.lines,
                  ...source.items.map((item) => ({
                    key: ++this.seq,
                    productName: item.productName,
                    description: item.description ?? '',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    observations: item.observations ?? '',
                  })),
                ],
              }
            : d,
        );
        this.notifications.success(`Se copiaron ${source.items.length} requerimiento(s) de "${source.name}".`);
      },
      error: (error: HttpErrorResponse) => {
        this.copying.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo copiar la plantilla.'));
      },
    });
  }

  removeLine(key: number): void {
    this.draft.update((d) => (d ? { ...d, lines: d.lines.filter((l) => l.key !== key) } : d));
  }

  moveLine(index: number, delta: number): void {
    this.draft.update((d) => {
      if (!d) return d;
      const lines = [...d.lines];
      const target = index + delta;
      if (target < 0 || target >= lines.length) return d;
      [lines[index], lines[target]] = [lines[target], lines[index]];
      return { ...d, lines };
    });
  }

  async saveDraft(): Promise<void> {
    const d = this.draft();
    if (!d || this.draftProblem() || this.saving()) {
      return;
    }
    const ok = await this.confirm.confirm({
      type: d.id ? 'UPDATE' : 'SAVE',
      title: d.id ? 'Guardar cambios de la plantilla' : 'Crear plantilla',
      message: `${d.name.trim()} · ${d.lines.length} requerimiento(s), total ${formatCurrency(this.draftTotal())}. Las cotizaciones ya generadas no cambian.`,
    });
    if (!ok) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.service
      .saveTemplate(d.id, {
        name: d.name.trim(),
        grade: d.grade.trim(),
        description: d.description.trim() || null,
        isActive: d.isActive,
        version: d.version ?? undefined,
        // Requirements only: no inventory product is sent (a link saved before this change is dropped).
        items: d.lines.map((l) => ({
          productId: null,
          productName: l.productName.trim(),
          description: l.description.trim() || null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          observations: l.observations.trim() || null,
        })),
      })
      .subscribe({
        next: (template) => {
          this.saving.set(false);
          this.draft.set(null);
          this.notifications.success(`Plantilla "${template.name}" guardada.`);
          if (this.expanded()?.id === template.id) this.expanded.set(template);
          this.load();
        },
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(extractErrorMessage(error, 'No se pudo guardar la plantilla.'));
        },
      });
  }

  // ── Duplicate / activate ─────────────────────────────────────────────────
  startDuplicate(t: SchoolTemplateSummary): void {
    this.error.set(null);
    this.copyName.set(`${t.name} (copia)`);
    this.copyGrade.set(t.grade);
    this.duplicating.set(t);
  }

  duplicate(): void {
    const source = this.duplicating();
    if (!source || this.copyName().trim().length < 3 || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.service.duplicateTemplate(source.id, this.copyName().trim(), this.copyGrade().trim()).subscribe({
      next: (template) => {
        this.saving.set(false);
        this.duplicating.set(null);
        this.notifications.success(`Plantilla "${template.name}" creada a partir de "${source.name}".`);
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo duplicar la plantilla.'));
      },
    });
  }

  async toggleActive(t: SchoolTemplateSummary): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: t.isActive ? 'Desactivar plantilla' : 'Activar plantilla',
      message: t.isActive
        ? `"${t.name}" dejará de aparecer en Nueva cotización. Las cotizaciones existentes no cambian.`
        : `"${t.name}" volverá a estar disponible para cotizar.`,
      confirmText: t.isActive ? 'Desactivar' : 'Activar',
      variant: t.isActive ? 'danger' : 'primary',
    });
    if (!ok) {
      return;
    }
    this.service.setTemplateActive(t.id, !t.isActive).subscribe({
      next: () => {
        this.notifications.success(t.isActive ? 'Plantilla desactivada.' : 'Plantilla activada.');
        this.load();
      },
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo cambiar el estado.')),
    });
  }
}
