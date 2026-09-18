import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PublicNewsType, Subscription } from '../../core/models';
import { PublicNewsSubscriptionService } from '../../core/services/public-news-subscription.service';
import { extractErrorMessage } from '../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, SectionComponent } from '../../shared/ui';

/**
 * Autoservicio de preferencias (`/noticias/preferencias/:token`) — punto
 * 19/20 del pedido: el cliente puede modificar sus categorías o cancelar
 * por completo, sin usar su número de WhatsApp como autenticación (el
 * `manageToken` de la URL es el mecanismo real). No se elimina físicamente
 * nada al cancelar.
 */
@Component({
  selector: 'app-news-preferences-page',
  standalone: true,
  imports: [RouterLink, SectionComponent, ButtonComponent, IconComponent],
  templateUrl: './news-preferences-page.component.html',
  styleUrl: './news-preferences-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPreferencesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicNewsSubscriptionService = inject(PublicNewsSubscriptionService);

  private token = '';

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly subscription = signal<Subscription | null>(null);
  readonly availableTypes = signal<PublicNewsType[]>([]);
  readonly selectedTypeIds = signal<Set<string>>(new Set());

  readonly isSaving = signal(false);
  readonly isCancelling = signal(false);
  readonly cancelled = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  /**
   * `null` mientras carga/no existe/ya se canceló — así el `@if` primario
   * de la plantilla puede usar `as sub` sin ambigüedad (Angular solo
   * permite `as` en el bloque `@if` principal, nunca en un `@else if`).
   */
  readonly displayedSubscription = computed(() => (this.cancelled() ? null : this.subscription()));

  readonly hasChanges = computed(() => {
    const sub = this.subscription();
    if (!sub) {
      return false;
    }
    const current = new Set(sub.types.map((t) => t.id));
    const selected = this.selectedTypeIds();
    if (current.size !== selected.size) {
      return true;
    }
    for (const id of current) {
      if (!selected.has(id)) {
        return true;
      }
    }
    return false;
  });

  constructor() {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    forkJoin({
      subscription: this.publicNewsSubscriptionService.getByToken(this.token),
      types: this.publicNewsSubscriptionService.getActiveTypes(),
    }).subscribe({
      next: ({ subscription, types }) => {
        this.subscription.set(subscription);
        this.availableTypes.set(types);
        this.selectedTypeIds.set(new Set(subscription.types.map((t) => t.id)));
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
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

  save(): void {
    const typeIds = [...this.selectedTypeIds()];
    if (typeIds.length === 0) {
      this.errorMessage.set('Selecciona al menos un tipo de noticias que deseas recibir.');
      return;
    }
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSaving.set(true);
    this.publicNewsSubscriptionService.updatePreferences(this.token, typeIds).subscribe({
      next: (subscription) => {
        this.subscription.set(subscription);
        this.isSaving.set(false);
        this.successMessage.set('Tus preferencias se actualizaron correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudieron guardar los cambios. Inténtalo de nuevo.'));
      },
    });
  }

  cancelSubscription(): void {
    this.errorMessage.set(null);
    this.isCancelling.set(true);
    this.publicNewsSubscriptionService.unsubscribe(this.token).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.cancelled.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isCancelling.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo cancelar la suscripción. Inténtalo de nuevo.'));
      },
    });
  }
}
