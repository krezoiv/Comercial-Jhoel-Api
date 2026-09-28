import { Injectable, signal } from '@angular/core';

/** Catálogos de la landing con acceso en el dock (ids = anclas existentes). */
export type QuickAccessCatalogKey = 'telefonos' | 'libreria' | 'variedades' | 'bancos';

export interface QuickAccessCatalogState {
  /** `true` solo si la sección tiene contenido publicado y por lo tanto existe en la página. */
  available: boolean;
  /** Miniatura: la MISMA URL de imagen que ya usa la card del catálogo (nunca una imagen nueva). */
  thumbnailUrl: string | null;
}

/**
 * Puente entre las secciones de catálogo y el dock de acceso rápido: cada
 * sección publica aquí, al cargar sus datos, si tiene contenido y la URL de
 * una imagen que ella misma ya muestra. Así el dock no hace ninguna
 * petición HTTP propia ni duplica datos — solo lee lo que la sección ya tenía.
 */
@Injectable({ providedIn: 'root' })
export class LandingQuickAccessStore {
  readonly catalogs = signal<Record<QuickAccessCatalogKey, QuickAccessCatalogState>>({
    telefonos: { available: false, thumbnailUrl: null },
    libreria: { available: false, thumbnailUrl: null },
    variedades: { available: false, thumbnailUrl: null },
    bancos: { available: false, thumbnailUrl: null },
  });

  publish(key: QuickAccessCatalogKey, state: QuickAccessCatalogState): void {
    this.catalogs.update((current) => ({ ...current, [key]: state }));
  }
}
