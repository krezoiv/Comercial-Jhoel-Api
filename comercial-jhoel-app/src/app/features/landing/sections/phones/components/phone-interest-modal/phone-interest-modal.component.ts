import { DecimalPipe } from '@angular/common';
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

import { CatalogRequestType, PublicCatalogPhone } from '../../../../../../core/models';
import { ContactService } from '../../../../../../core/services/contact.service';
import { PublicCatalogService } from '../../../../../../core/services/public-catalog.service';
import { extractErrorMessage } from '../../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../../shared/ui';

/** Mismo criterio de `digitsOnly` que `ContactService` — un enlace `wa.me` necesita un string numérico limpio. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Modal "¿Te interesa este teléfono?" — representa una SOLICITUD DE INTERÉS,
 * nunca una venta. Nombre + teléfono son los únicos datos pedidos (mínimo
 * necesario). Tras guardar correctamente, arma un enlace de WhatsApp con un
 * mensaje que solo expresa interés — nunca cuotas, tasas, plazos, ni
 * indicación de aprobación (ver `CreateCatalogRequestUseCase` en el
 * backend: la elegibilidad de crédito siempre se recalcula ahí, nunca se
 * asume aquí).
 */
@Component({
  selector: 'app-phone-interest-modal',
  standalone: true,
  imports: [DecimalPipe, ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './phone-interest-modal.component.html',
  styleUrl: './phone-interest-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneInterestModalComponent implements OnChanges {
  @Input() phone: PublicCatalogPhone | null = null;
  @Input() requestType: CatalogRequestType | null = null;

  @Output() closed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly publicCatalogService = inject(PublicCatalogService);
  private readonly contactService = inject(ContactService);

  private whatsappNumber: string | null = null;

  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly whatsappHref = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
  });

  get open(): boolean {
    return this.phone !== null && this.requestType !== null;
  }

  get isCreditRequest(): boolean {
    return this.requestType === 'INTERES_CREDITO';
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
    if (!changes['phone'] && !changes['requestType']) {
      return;
    }
    if (!this.open) {
      return;
    }
    this.isSubmitting.set(false);
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
    this.whatsappHref.set(null);
    this.form.reset({ customerName: '', customerPhone: '' });
  }

  submit(): void {
    const phone = this.phone;
    const requestType = this.requestType;
    if (!phone || !requestType || this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();
    const customerName = raw.customerName.trim();
    const customerPhone = raw.customerPhone.trim();

    this.publicCatalogService
      .createRequest({
        catalogPhoneId: phone.id,
        requestType,
        customerName,
        customerPhone,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isSubmitted.set(true);
          this.whatsappHref.set(this.buildWhatsappHref(phone, requestType, customerName));
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo enviar tu solicitud. Inténtalo de nuevo.'));
        },
      });
  }

  private buildWhatsappHref(phone: PublicCatalogPhone, requestType: CatalogRequestType, customerName: string): string | null {
    if (!this.whatsappNumber) {
      return null;
    }
    const digits = digitsOnly(this.whatsappNumber);
    if (!digits) {
      return null;
    }

    const priceText = `Q${phone.price.toFixed(2)}`;
    const message =
      requestType === 'INTERES_CREDITO'
        ? `Hola, soy ${customerName}. Vi el ${phone.brand} ${phone.model} (${priceText}) en el catálogo de Comercial Jhoel y me interesa adquirirlo mediante crédito con Krediya. ¿Me pueden brindar más información?`
        : `Hola, soy ${customerName}. Estoy interesado en el ${phone.brand} ${phone.model} (${priceText}) del catálogo de Comercial Jhoel.`;

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
