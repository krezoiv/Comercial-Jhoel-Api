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
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CatalogPhone } from '../../../../../core/models';
import { CatalogPhoneService } from '../../../../../core/services/catalog-phone.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-catalog-phone-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './catalog-phone-form-modal.component.html',
  styleUrl: './catalog-phone-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPhoneFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un CatalogPhone = editar (formulario pre-llenado). */
  @Input() phone: CatalogPhone | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CatalogPhone>();

  private readonly fb = inject(FormBuilder);
  private readonly catalogPhoneService = inject(CatalogPhoneService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    brand: ['', [Validators.required, Validators.maxLength(80)]],
    model: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(2000)]],
    price: [0, [Validators.required, Validators.min(0)]],
    screen: ['', [Validators.maxLength(100)]],
    ram: ['', [Validators.maxLength(50)]],
    storage: ['', [Validators.maxLength(50)]],
    camera: ['', [Validators.maxLength(100)]],
    battery: ['', [Validators.maxLength(50)]],
    processor: ['', [Validators.maxLength(100)]],
    operatingSystem: ['', [Validators.maxLength(50)]],
    extraSpecs: this.fb.array<ReturnType<typeof this.buildExtraSpecGroup>>([]),
  });

  get isEditMode(): boolean {
    return this.phone !== null;
  }

  get extraSpecs(): FormArray {
    return this.form.controls.extraSpecs;
  }

  private buildExtraSpecGroup(label = '', value = '') {
    return this.fb.nonNullable.group({
      label: [label, [Validators.required, Validators.maxLength(80)]],
      value: [value, [Validators.required, Validators.maxLength(200)]],
    });
  }

  addExtraSpec(): void {
    this.extraSpecs.push(this.buildExtraSpecGroup());
  }

  removeExtraSpec(index: number): void {
    this.extraSpecs.removeAt(index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.extraSpecs.clear();

    const phone = this.phone;
    this.form.reset({
      brand: phone?.brand ?? '',
      model: phone?.model ?? '',
      description: phone?.description ?? '',
      price: phone?.price ?? 0,
      screen: phone?.screen ?? '',
      ram: phone?.ram ?? '',
      storage: phone?.storage ?? '',
      camera: phone?.camera ?? '',
      battery: phone?.battery ?? '',
      processor: phone?.processor ?? '',
      operatingSystem: phone?.operatingSystem ?? '',
    });

    for (const spec of phone?.extraSpecs ?? []) {
      this.extraSpecs.push(this.buildExtraSpecGroup(spec.label, spec.value));
    }
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({ type: this.isEditMode ? 'UPDATE' : 'SAVE' });
    if (!confirmed) {
      return;
    }

    const raw = this.form.getRawValue();
    const input = {
      brand: raw.brand.trim(),
      model: raw.model.trim(),
      description: raw.description.trim() || null,
      price: raw.price,
      screen: raw.screen.trim() || null,
      ram: raw.ram.trim() || null,
      storage: raw.storage.trim() || null,
      camera: raw.camera.trim() || null,
      battery: raw.battery.trim() || null,
      processor: raw.processor.trim() || null,
      operatingSystem: raw.operatingSystem.trim() || null,
      extraSpecs: raw.extraSpecs.map((spec) => ({ label: spec.label.trim(), value: spec.value.trim() })),
    };

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.catalogPhoneService.updatePhone(this.phone!.id, input)
      : this.catalogPhoneService.createPhone(input);

    request$.subscribe({
      next: (phone) => {
        this.isSubmitting.set(false);
        this.saved.emit(phone);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el teléfono. Inténtalo de nuevo.'));
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
