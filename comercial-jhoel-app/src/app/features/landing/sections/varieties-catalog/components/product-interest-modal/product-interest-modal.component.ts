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
import { catchError, of } from 'rxjs';

import { PublicCatalogProduct } from '../../../../../../core/models';
import { ContactService } from '../../../../../../core/services/contact.service';
import { PublicProductCatalogService } from '../../../../../../core/services/public-product-catalog.service';
import { extractErrorMessage } from '../../../../../../core/utils/extract-error-message';
import { formatCurrency } from '../../../../../../core/utils/number-format.util';
import { ButtonComponent, IconComponent } from '../../../../../../shared/ui';

/** Mismo criterio de `digitsOnly` que `ContactService`/`PhoneInterestModalComponent` — un enlace `wa.me` necesita un string numérico limpio. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Modal "¿Te interesa este producto?" — reutiliza exactamente el mismo
 * mecanismo de WhatsApp que `PhoneInterestModalComponent`. Representa una
 * SOLICITUD DE INTERÉS, nunca una venta. Deliberadamente sin nada de
 * crédito/cuotas/Krediya — esa sección es exclusiva de Teléfonos.
 */
@Component({
  selector: 'app-product-interest-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './product-interest-modal.component.html',
  styleUrl: './product-interest-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInterestModalComponent implements OnChanges {
  @Input() product: PublicCatalogProduct | null = null;

  @Output() closed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly publicProductCatalogService = inject(PublicProductCatalogService);
  private readonly contactService = inject(ContactService);

  private whatsappNumber: string | null = null;

  readonly isSubmitting = signal(false);
  formatCurrency = formatCurrency;
  readonly isSubmitted = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly whatsappHref = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
  });

  get open(): boolean {
    return this.product !== null;
  }

  constructor() {
    this.contactService
      .getContactInfo()
      .pipe(catchError(() => of(null)))
      .subscribe((info) => {
        this.whatsappNumber = info?.channels.find((c) => c.id === 'whatsapp')?.value ?? null;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['product'] || !this.open) {
      return;
    }
    this.isSubmitting.set(false);
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
    this.whatsappHref.set(null);
    this.form.reset({ customerName: '', customerPhone: '' });
  }

  submit(): void {
    const product = this.product;
    if (!product || this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();
    const customerName = raw.customerName.trim();
    const customerPhone = raw.customerPhone.trim();

    this.publicProductCatalogService
      .createRequest({
        catalogProductId: product.id,
        customerName,
        customerPhone,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isSubmitted.set(true);
          this.whatsappHref.set(this.buildWhatsappHref(product, customerName));
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo enviar tu solicitud. Inténtalo de nuevo.'));
        },
      });
  }

  private buildWhatsappHref(product: PublicCatalogProduct, customerName: string): string | null {
    if (!this.whatsappNumber) {
      return null;
    }
    const digits = digitsOnly(this.whatsappNumber);
    if (!digits) {
      return null;
    }

    const priceText = formatCurrency(product.price);
    const message = `Hola, soy ${customerName}. Estoy interesado en el producto "${product.name}" (${priceText}) que vi en el catálogo de Comercial Jhoel.`;

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
