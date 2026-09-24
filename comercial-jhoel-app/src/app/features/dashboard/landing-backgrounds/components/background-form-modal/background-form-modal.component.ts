import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  BackgroundPosition,
  BackgroundSize,
  DEPTH_EFFECT_OPTIONS,
  DepthEffect,
  LANDING_SECTION_OPTIONS,
  LandingBackground,
  MOVEMENT_OPTIONS,
  MovementMode,
  OVERLAY_OPTIONS,
  OverlayLevel,
  PARALLAX_OPTIONS,
  ParallaxIntensity,
  POSITION_OPTIONS,
  SIZE_OPTIONS,
} from '../../../../../core/models';
import { LandingBackgroundService } from '../../../../../core/services/landing-background.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, LandingBackgroundLayerComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-background-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, LandingBackgroundLayerComponent],
  templateUrl: './background-form-modal.component.html',
  styleUrl: './background-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un LandingBackground = editar (formulario pre-llenado). */
  @Input() background: LandingBackground | null = null;
  /** `sectionKey`s que ya tienen un fondo ACTIVO — usado para deshabilitar proactivamente esa opción al crear, y para mostrar la advertencia "esta sección ya tiene un fondo activo" que pide la tarea. */
  @Input() activeSectionKeys: Set<string> = new Set();

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<LandingBackground>();

  private readonly fb = inject(FormBuilder);
  private readonly landingBackgroundService = inject(LandingBackgroundService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly sectionOptions = LANDING_SECTION_OPTIONS;
  readonly overlayOptions = OVERLAY_OPTIONS;
  readonly positionOptions = POSITION_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly depthEffectOptions = DEPTH_EFFECT_OPTIONS;
  readonly parallaxOptions = PARALLAX_OPTIONS;
  readonly movementOptions = MOVEMENT_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    sectionKey: ['', Validators.required],
    opacity: [25, [Validators.required, Validators.min(0), Validators.max(100)]],
    overlay: ['medium' as OverlayLevel, Validators.required],
    position: ['center' as BackgroundPosition, Validators.required],
    size: ['large' as BackgroundSize, Validators.required],
    depthEffect: ['subtle' as DepthEffect, Validators.required],
    parallax: ['subtle' as ParallaxIntensity, Validators.required],
    movement: ['scroll_mouse' as MovementMode, Validators.required],
  });

  get isEditMode(): boolean {
    return this.background !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    const background = this.background;
    this.form.reset({
      name: background?.name ?? '',
      sectionKey: background?.sectionKey ?? '',
      opacity: background?.opacity ?? 25,
      overlay: background?.overlay ?? 'medium',
      position: background?.position ?? 'center',
      size: background?.size ?? 'large',
      depthEffect: background?.depthEffect ?? 'subtle',
      parallax: background?.parallax ?? 'subtle',
      movement: background?.movement ?? 'scroll_mouse',
    });
  }

  /**
   * Getters planos, nunca `computed()` — leídos por el panel de vista
   * previa en cada ciclo de detección de cambios. Un `FormControl.value`
   * es una propiedad plana, no una señal: envolverlo en `computed()` nunca
   * se invalidaría con la escritura del usuario (gotcha ya documentado en
   * este proyecto — ver `AccountStatementModalComponent`). Como este
   * componente SÍ dispara CD en cada evento de su propio formulario (todo
   * evento de un binding disparado desde la propia plantilla de un
   * componente OnPush corre CD para ese componente), una lectura directa
   * aquí ya refleja el valor más reciente sin necesidad de una señal.
   */
  previewImageUrl(): string | null {
    return this.background?.hasImage ? this.landingBackgroundService.getImageUrl(this.background.id) : null;
  }

  /** true si la sección seleccionada ahora mismo ya está tomada por OTRO fondo activo. */
  isSectionTaken(sectionKey: string): boolean {
    if (!this.activeSectionKeys.has(sectionKey)) {
      return false;
    }
    // Editando el propio fondo que ya ocupa esa sección — no es un conflicto consigo mismo.
    return this.background?.sectionKey !== sectionKey;
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    if (this.isSectionTaken(raw.sectionKey)) {
      this.errorMessage.set('Esta sección ya tiene un fondo activo. Desactívalo o edítalo en vez de crear uno nuevo.');
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({ type: this.isEditMode ? 'UPDATE' : 'SAVE' });
    if (!confirmed) {
      return;
    }

    const input = {
      name: raw.name.trim(),
      sectionKey: raw.sectionKey,
      opacity: raw.opacity,
      overlay: raw.overlay,
      position: raw.position,
      size: raw.size,
      depthEffect: raw.depthEffect,
      parallax: raw.parallax,
      movement: raw.movement,
    };

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.landingBackgroundService.updateBackground(this.background!.id, input)
      : this.landingBackgroundService.createBackground(input);

    request$.subscribe({
      next: (background) => {
        this.isSubmitting.set(false);
        this.saved.emit(background);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el fondo. Inténtalo de nuevo.'));
      },
    });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
