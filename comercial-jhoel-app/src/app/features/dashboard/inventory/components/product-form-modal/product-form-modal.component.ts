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

import { Product } from '../../../../../core/models';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = create mode, a Product = edit mode (form is pre-filled from it). */
  @Input() product: Product | null = null;
  @Input() categories: string[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Product>();

  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    category: ['', [Validators.required, Validators.maxLength(40)]],
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
      const { name, category, costPrice, publicPrice, wholesalePrice, stock } = this.product;
      this.form.reset({ name, category, costPrice, publicPrice, wholesalePrice, stock });
    } else {
      this.form.reset({ name: '', category: '', costPrice: 0, publicPrice: 0, wholesalePrice: 0, stock: 0 });
    }
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const input = this.form.getRawValue();
    this.isSubmitting.set(true);

    const request$ = this.isEditMode
      ? this.inventoryService.updateProduct(this.product!.id, input)
      : this.inventoryService.createProduct(input);

    request$.subscribe({
      next: (product) => {
        this.isSubmitting.set(false);
        this.saved.emit(product);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('No se pudo guardar el producto. Inténtalo de nuevo.');
      },
    });
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
