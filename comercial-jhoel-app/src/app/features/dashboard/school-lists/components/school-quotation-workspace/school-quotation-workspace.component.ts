import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { SCHOOL_STATUS_COLOR, SchoolQuotation, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { SchoolDocumentsService } from '../../school-documents.service';
import { SchoolQuotationEditorComponent } from '../school-quotation-editor/school-quotation-editor.component';
import { SchoolQuotationPreviewComponent } from '../school-quotation-preview/school-quotation-preview.component';

/** Duration of the exit animation (kept in sync with the SCSS). */
const LEAVE_MS = 200;

/** Open windows; the page scroll is locked while there is at least one. */
let openWindows = 0;
let pageOverflow = '';

/**
 * Fullscreen POS window of Listas Escolares, used for "Nueva cotización" and
 * "Editar cotización". It is the window chrome only — the quotation itself
 * (fields, lines, totals, payments, validation and saving through the existing
 * endpoints) is `SchoolQuotationEditorComponent`, hosted in its body.
 *
 * Window behaviour:
 * - the host is moved to `<body>` while open, so the blurred backdrop covers
 *   the whole app (sidebar and top bar included) whatever the page layout;
 *   its layer (`--z-workspace`) is below the global confirmation dialog
 *   (`--z-dialog`) and the toasts, which still appear above it;
 * - the page behind does not scroll and cannot be reached with the keyboard
 *   (focus trap); focus returns to the button that opened the window;
 * - the backdrop never closes it. Close, Cancel and Escape close it directly
 *   when nothing changed; otherwise they ask: keep editing, discard or save;
 * - leaving the browser tab with unsaved changes asks the browser to confirm.
 */
@Component({
  selector: 'app-school-quotation-workspace',
  standalone: true,
  imports: [ButtonComponent, IconComponent, FocusTrapDirective, SchoolQuotationEditorComponent, SchoolQuotationPreviewComponent],
  templateUrl: './school-quotation-workspace.component.html',
  styleUrl: './school-quotation-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationWorkspaceComponent implements OnInit, OnDestroy {
  /** Quotation to edit; null opens "Nueva cotización". */
  @Input() quotation: SchoolQuotation | null = null;
  /** Saved line whose "Cambiar producto" opens on load (lists of the previous flow). */
  @Input() swapItemId: string | null = null;
  /** The quotation was saved (the parent navigates to its detail). */
  @Output() saved = new EventEmitter<SchoolQuotation>();
  /** The window was closed without saving. */
  @Output() closed = new EventEmitter<void>();

  private readonly host: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly confirm = inject(ConfirmDialogService);
  private readonly documents = inject(SchoolDocumentsService);

  readonly editor = viewChild.required(SchoolQuotationEditorComponent);
  readonly formatCurrency = formatCurrency;

  /** "Cambios sin guardar" dialog (keep editing / discard / save). */
  readonly askClose = signal(false);
  readonly previewing = signal(false);
  readonly leaving = signal(false);
  /** Number of the quotation once saved (header shows "Guardada"). */
  readonly savedNumber = signal<string | null>(null);
  /** Which save button started the current save (for its loading label). */
  readonly pendingAction = signal<'save' | 'pdf' | null>(null);

  readonly title = computed(() => (this.quotation ? `Editar cotización ${this.quotation.quotationNumber}` : 'Nueva cotización escolar'));
  readonly statusColor = computed(() => {
    const status = this.quotation?.status ?? (this.editor().asDraft() ? 'BORRADOR' : 'ACEPTADA');
    return SCHOOL_STATUS_COLOR[status];
  });
  /** Header save indicator. */
  readonly saveState = computed<{ tone: 'idle' | 'dirty' | 'busy' | 'done'; text: string }>(() => {
    const editor = this.editor();
    if (editor.saving()) return { tone: 'busy', text: 'Guardando…' };
    if (this.savedNumber()) return { tone: 'done', text: `Guardada como ${this.savedNumber()}` };
    if (editor.dirty()) return { tone: 'dirty', text: 'Cambios sin guardar' };
    return { tone: 'idle', text: this.quotation ? 'Sin cambios' : 'Sin datos todavía' };
  });

  private pdfAfterSave = false;

  ngOnInit(): void {
    // Portal: render at the end of <body>, above the whole app shell.
    document.body.appendChild(this.host);
    if (openWindows++ === 0) {
      pageOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy(): void {
    if (--openWindows === 0) {
      document.body.style.overflow = pageOverflow;
    }
    this.host.remove();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    // The global confirmation dialog (save summary) handles its own keys.
    if (event.defaultPrevented || this.leaving() || this.confirm.pending()) {
      return;
    }
    event.preventDefault();
    if (this.previewing()) {
      this.previewing.set(false);
    } else if (this.askClose()) {
      this.askClose.set(false);
    } else if (this.editor().replacingKey() === null) {
      this.requestClose();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.editor().dirty() && !this.savedNumber()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  /** Close button, "Cancelar" and Escape: close now, or ask when something would be lost. */
  requestClose(): void {
    if (this.editor().saving() || this.leaving()) {
      return;
    }
    if (this.editor().dirty()) {
      this.askClose.set(true);
    } else {
      this.close();
    }
  }

  discard(): void {
    this.askClose.set(false);
    this.close();
  }

  /** "Guardar y salir" from the close dialog: a normal save (the window closes once saved). */
  saveAndExit(): void {
    this.askClose.set(false);
    void this.save(false);
  }

  /**
   * Saves through the editor (its own validation and confirmation summary,
   * existing endpoints). With `withPdf`, the quotation PDF is downloaded once
   * the backend has saved it.
   */
  async save(withPdf: boolean): Promise<void> {
    const editor = this.editor();
    if (editor.saving()) {
      return;
    }
    this.pdfAfterSave = withPdf;
    this.pendingAction.set(withPdf ? 'pdf' : 'save');
    await editor.save();
    if (!editor.saving()) {
      this.pendingAction.set(null);
    }
  }

  /** Editor saved: download the PDF if asked, show "Guardada" and hand over to the parent. */
  onSaved(quotation: SchoolQuotation): void {
    this.pendingAction.set(null);
    this.savedNumber.set(quotation.quotationNumber);
    if (this.pdfAfterSave) {
      this.documents.quotation(quotation.id, quotation.quotationNumber, 'download');
    }
    this.saved.emit(quotation);
  }

  /** Jumps to the list of missing data in the side panel. */
  showProblems(): void {
    document.getElementById('pos-problems')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private close(): void {
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.closed.emit();
      return;
    }
    this.leaving.set(true);
    setTimeout(() => this.closed.emit(), LEAVE_MS);
  }
}
