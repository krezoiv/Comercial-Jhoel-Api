import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PublicNewsType } from '../../../../core/models';
import { PublicNewsSubscriptionService } from '../../../../core/services/public-news-subscription.service';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';

/**
 * "Recibe nuestras noticias por WhatsApp" — sección pública de la landing.
 * Las clasificaciones (checkboxes) vienen siempre del backend
 * (`GET /public-news-subscriptions/types`), nunca hardcodeadas — si se
 * agrega un tipo nuevo desde el admin, aparece aquí automáticamente sin
 * tocar este componente. La opción "Todas las noticias" es la etiqueta
 * amigable del tipo marcado `isWildcard` en el backend — el visitante
 * nunca ve el término técnico "wildcard"/"comercial".
 */
@Component({
  selector: 'app-news-subscription',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RevealOnScrollDirective,
    SectionComponent,
    SectionHeadingComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './news-subscription.component.html',
  styleUrl: './news-subscription.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSubscriptionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly publicNewsSubscriptionService = inject(PublicNewsSubscriptionService);

  readonly types = signal<PublicNewsType[]>([]);
  readonly loading = signal(true);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly manageUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    name: [''],
    consent: [false, [Validators.requiredTrue]],
  });

  readonly selectedTypeIds = signal<Set<string>>(new Set());

  constructor() {
    this.publicNewsSubscriptionService.getActiveTypes().subscribe({
      next: (types) => {
        this.types.set(types);
        // "Todas las noticias" (wildcard) viene pre-marcada, igual que el mockup pedido.
        this.selectedTypeIds.set(new Set(types.filter((t) => t.isWildcard).map((t) => t.id)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isChecked(typeId: string): boolean {
    return this.selectedTypeIds().has(typeId);
  }

  toggleType(typeId: string): void {
    this.selectedTypeIds.update((current) => {
      const next = new Set(current);
      if (next.has(typeId)) {
        next.delete(typeId);
      } else {
        next.add(typeId);
      }
      return next;
    });
  }

  typeLabel(type: PublicNewsType): string {
    return type.isWildcard ? 'Todas las noticias' : type.name;
  }

  submit(): void {
    this.errorMessage.set(null);

    const typeIds = [...this.selectedTypeIds()];
    if (typeIds.length === 0) {
      this.errorMessage.set('Selecciona al menos un tipo de noticias que deseas recibir.');
      return;
    }
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.publicNewsSubscriptionService
      .subscribe({
        whatsappNumber: raw.whatsappNumber.trim(),
        name: raw.name.trim() || undefined,
        typeIds,
        consent: raw.consent,
      })
      .subscribe({
        next: (subscription) => {
          this.isSubmitting.set(false);
          this.submitted.set(true);
          this.manageUrl.set(`/noticias/preferencias/${subscription.manageToken}`);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo completar la suscripción. Inténtalo de nuevo.'));
        },
      });
  }
}
