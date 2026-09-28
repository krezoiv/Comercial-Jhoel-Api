import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { catchError, of } from 'rxjs';

import { ContactService } from '../../../../core/services/contact.service';
import { LandingQuickAccessStore, QuickAccessCatalogKey } from '../../../../core/services/landing-quick-access.store';
import { NotificationsModalService } from '../../../../core/services/notifications-modal.service';
import { IconComponent } from '../../../../shared/ui';

interface DockItem {
  id: string;
  label: string;
  ariaLabel: string;
  icon: string;
  /** Ancla existente a la que lleva (y que marca el estado activo). */
  sectionId: string | null;
  thumbnailUrl: string | null;
  /** Enlace externo (WhatsApp) — se abre con el `wa.me` que ya arma `ContactService`. */
  href: string | null;
  action: 'scroll' | 'notifications' | 'link';
  tone: 'default' | 'whatsapp';
  /** Divisor visual antes de este acceso (separa catálogos de acciones). */
  dividerBefore: boolean;
}

const CATALOG_ITEMS: ReadonlyArray<{ key: QuickAccessCatalogKey; label: string; ariaLabel: string; icon: string }> = [
  { key: 'telefonos', label: 'Catálogo de Teléfonos', ariaLabel: 'Ver catálogo de teléfonos', icon: 'smartphone' },
  { key: 'libreria', label: 'Catálogo de Librería', ariaLabel: 'Ver catálogo de librería', icon: 'book-open' },
  { key: 'variedades', label: 'Accesorios y Variedades', ariaLabel: 'Ver accesorios y variedades', icon: 'shopping-bag' },
  { key: 'bancos', label: 'Bancos', ariaLabel: 'Ver bancos', icon: 'bank' },
];

/** Por debajo de este ancho el dock se convierte en una barra flotante inferior. */
const DOCK_DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Dock flotante de acceso rápido de la landing — SOLO navegación: no
 * duplica catálogos, cards, WhatsApp ni Notificaciones.
 *
 * - Catálogos: miniaturas publicadas por las propias secciones en
 *   `LandingQuickAccessStore` (las mismas URLs que ya muestran sus cards;
 *   cero peticiones propias). Un catálogo sin contenido no existe en la
 *   página, así que tampoco aparece aquí.
 * - Notificaciones: abre el mismo `NotificationsModalComponent` del Navbar
 *   vía `NotificationsModalService`; la lógica de Web Push no se toca.
 * - WhatsApp: el mismo enlace `wa.me` de `ContactService` que usan Hero y
 *   Contacto; si la empresa no configuró WhatsApp, el acceso lleva a la
 *   sección Contacto.
 *
 * Estado activo con `IntersectionObserver` (una línea a media pantalla),
 * nunca con cálculos por evento de scroll.
 */
@Component({
  selector: 'app-quick-access-dock',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent],
  templateUrl: './quick-access-dock.component.html',
  styleUrl: './quick-access-dock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAccessDockComponent {
  /** `false` mientras la pantalla de carga inicial cubre la landing — la entrada del dock espera a que termine. */
  readonly ready = input(true);

  private readonly store = inject(LandingQuickAccessStore);
  private readonly notificationsModal = inject(NotificationsModalService);
  private readonly contactService = inject(ContactService);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private readonly whatsappHref = signal<string | null>(null);
  private readonly brokenThumbnails = signal<ReadonlySet<string>>(new Set());

  /** Id de la sección bajo la línea media del viewport (o `null`). */
  readonly activeSection = signal<string | null>(null);
  readonly nearFooter = signal(false);
  /** Móvil/tablet: el dock se esconde mientras el Hero domina la pantalla y al desplazarse hacia abajo. */
  private readonly heroInView = signal(true);
  private readonly scrollingDown = signal(false);
  readonly isDesktop = signal(this.matches(DOCK_DESKTOP_QUERY));

  readonly hidden = computed(() => !this.isDesktop() && (this.heroInView() || this.scrollingDown() || this.nearFooter()));

  readonly items = computed<DockItem[]>(() => {
    const catalogs = this.store.catalogs();
    const broken = this.brokenThumbnails();
    const items: DockItem[] = CATALOG_ITEMS.filter(({ key }) => catalogs[key].available).map(({ key, label, ariaLabel, icon }) => {
      const url = catalogs[key].thumbnailUrl;
      return {
        id: key,
        label,
        ariaLabel,
        icon,
        sectionId: key,
        thumbnailUrl: url && !broken.has(key) ? url : null,
        href: null,
        action: 'scroll',
        tone: 'default',
        dividerBefore: false,
      };
    });

    items.push({
      id: 'notificaciones',
      label: 'Notificaciones',
      ariaLabel: 'Activar notificaciones',
      icon: 'bell',
      sectionId: null,
      thumbnailUrl: null,
      href: null,
      action: 'notifications',
      tone: 'default',
      dividerBefore: items.length > 0,
    });

    const whatsapp = this.whatsappHref();
    items.push(
      whatsapp
        ? {
            id: 'whatsapp',
            label: 'WhatsApp',
            ariaLabel: 'Contactar por WhatsApp',
            icon: 'whatsapp',
            sectionId: 'contacto',
            thumbnailUrl: null,
            href: whatsapp,
            action: 'link',
            tone: 'whatsapp',
            dividerBefore: false,
          }
        : {
            id: 'contacto',
            label: 'Contacto',
            ariaLabel: 'Ir a la sección de contacto',
            icon: 'mail',
            sectionId: 'contacto',
            thumbnailUrl: null,
            href: null,
            action: 'scroll',
            tone: 'default',
            dividerBefore: false,
          },
    );
    return items;
  });

  private sectionObserver?: IntersectionObserver;
  private readonly observedSections = new Set<string>();
  private readonly intersecting = new Set<string>();
  private lastScrollY = 0;
  private scrollRaf: number | null = null;

  constructor() {
    this.contactService
      .getContactInfo()
      .pipe(catchError(() => of(null)))
      .subscribe((info) => {
        const whatsapp = info?.channels.find((channel) => channel.id === 'whatsapp');
        this.whatsappHref.set(whatsapp?.href ?? null);
      });

    afterNextRender(() => this.setUpObservers());

    // Las secciones de catálogo se montan al llegar sus datos — cada vez que
    // el store cambia, se observan las anclas que ya existan en el DOM.
    effect(() => {
      this.store.catalogs();
      untracked(() => requestAnimationFrame(() => this.observeSections()));
    });

    this.destroyRef.onDestroy(() => {
      this.sectionObserver?.disconnect();
      window.removeEventListener('scroll', this.onScroll);
      if (this.scrollRaf !== null) {
        cancelAnimationFrame(this.scrollRaf);
      }
    });
  }

  activate(item: DockItem): void {
    if (item.action === 'notifications') {
      this.notificationsModal.open();
      return;
    }
    if (item.sectionId) {
      const reducedMotion = this.matches('(prefers-reduced-motion: reduce)');
      document.getElementById(item.sectionId)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  onThumbnailError(id: string): void {
    this.brokenThumbnails.update((current) => new Set(current).add(id));
  }

  // ---- Observadores ------------------------------------------------------------

  private setUpObservers(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.heroInView.set(false);
      return;
    }

    this.zone.runOutsideAngular(() => {
      // Línea horizontal a ~45% del alto de la pantalla: la sección que la
      // cruza es la "actual".
      this.sectionObserver = new IntersectionObserver((entries) => this.onSectionEntries(entries), {
        rootMargin: '-45% 0px -54% 0px',
      });
      this.observeSections();

      const hero = document.getElementById('inicio');
      if (hero) {
        new IntersectionObserver(
          ([entry]) => this.setOutside(this.heroInView, entry.isIntersecting && entry.intersectionRatio > 0.35),
          { threshold: [0, 0.35, 0.6] },
        ).observe(hero);
      } else {
        this.setOutside(this.heroInView, false);
      }

      const footer = document.querySelector('app-footer');
      if (footer) {
        new IntersectionObserver(([entry]) => this.setOutside(this.nearFooter, entry.isIntersecting), {
          rootMargin: '0px 0px -12% 0px',
        }).observe(footer);
      }

      window.addEventListener('scroll', this.onScroll, { passive: true });
      const desktopQuery = window.matchMedia(DOCK_DESKTOP_QUERY);
      desktopQuery.addEventListener('change', (event) => this.setOutside(this.isDesktop, event.matches));
    });
  }

  private observeSections(): void {
    if (!this.sectionObserver) {
      return;
    }
    const ids = ['contacto', ...CATALOG_ITEMS.map((item) => item.key)];
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element && !this.observedSections.has(id)) {
        this.observedSections.add(id);
        this.sectionObserver.observe(element);
      }
    }
  }

  private onSectionEntries(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.intersecting.add(entry.target.id);
      } else {
        this.intersecting.delete(entry.target.id);
      }
    }
    // `#bancos` vive DENTRO de `#agentes-bancarios`; si coinciden varias,
    // gana la última en orden de página.
    const order = ['telefonos', 'libreria', 'variedades', 'bancos', 'contacto'];
    const active = [...order].reverse().find((id) => this.intersecting.has(id)) ?? null;
    this.setOutside(this.activeSection, active);
  }

  /** Solo móvil/tablet: esconder al bajar, mostrar al subir (menos contenido tapado). Un listener pasivo, agrupado en rAF. */
  private readonly onScroll = (): void => {
    if (this.scrollRaf !== null || this.isDesktop()) {
      return;
    }
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = null;
      const y = window.scrollY;
      const delta = y - this.lastScrollY;
      if (Math.abs(delta) > 12) {
        this.setOutside(this.scrollingDown, delta > 0);
        this.lastScrollY = y;
      }
    });
  };

  /** Escribe un signal desde fuera de la zona, entrando a ella solo si el valor cambia. */
  private setOutside<T>(target: { (): T; set(value: T): void }, value: T): void {
    if (target() !== value) {
      this.zone.run(() => target.set(value));
    }
  }

  private matches(query: string): boolean {
    return typeof window !== 'undefined' && window.matchMedia(query).matches;
  }
}
