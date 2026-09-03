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
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Business, Category, Product } from '../../../../../core/models';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = create mode, a Product = edit mode (form is pre-filled from it). */
  @Input() product: Product | null = null;
  /** Real, active categories from the backend — never hardcoded. */
  @Input() categories: Category[] = [];
  /** Real, active businesses (líneas de negocio) from the backend — never hardcoded. */
  @Input() businesses: Business[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Product>();

  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    sku: ['', [Validators.maxLength(64), Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    categoryId: ['', Validators.required],
    businessId: ['', Validators.required],
    costPrice: [0, [Validators.required, Validators.min(0.01)]],
    publicPrice: [0, [Validators.required, Validators.min(0.01)]],
    wholesalePrice: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  get isEditMode(): boolean {
    return this.product !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    if (this.product) {
      const { name, sku, categoryId, businessId, costPrice, publicPrice, wholesalePrice, stock } = this.product;
      this.form.reset({
        name,
        sku: sku ?? '',
        categoryId,
        businessId,
        costPrice,
        publicPrice,
        wholesalePrice,
        stock,
      });
    } else {
      this.form.reset({
        name: '',
        sku: '',
        categoryId: '',
        businessId: '',
        costPrice: 0,
        publicPrice: 0,
        wholesalePrice: 0,
        stock: 0,
      });
    }
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({
      type: this.isEditMode ? 'UPDATE' : 'SAVE',
    });
    if (!confirmed) {
      return;
    }

    const { sku, ...rest } = this.form.getRawValue();
    const input = { ...rest, sku: sku.trim() || null };
    this.isSubmitting.set(true);

    const request$ = this.isEditMode
      ? this.inventoryService.updateProduct(this.product!.id, input)
      : this.inventoryService.createProduct(input);

    request$.subscribe({
      next: (product) => {
        this.isSubmitting.set(false);
        this.saved.emit(product);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el producto. Inténtalo de nuevo.'));
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
