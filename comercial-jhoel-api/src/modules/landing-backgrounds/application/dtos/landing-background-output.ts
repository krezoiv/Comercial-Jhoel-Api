import { LandingBackground } from '../../domain/entities/landing-background.entity';

export interface LandingBackgroundOutput {
  id: string;
  name: string;
  sectionKey: string;
  opacity: number;
  overlay: string;
  position: string;
  size: string;
  depthEffect: string;
  parallax: string;
  movement: string;
  isActive: boolean;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Shape público — backs la capa de fondos de la landing. Sin audit; solo lo
 * necesario para renderizar la capa visual. `id`/`hasImage` (nunca una URL
 * ya armada) — el frontend construye `${BASE_URL}/images/${id}` él mismo,
 * exactamente el mismo convenio que ya usa `PublicCatalogBankResponseDto`/
 * `PublicCatalogBankService.getImageUrl()`.
 */
export interface PublicLandingBackgroundOutput {
  id: string;
  sectionKey: string;
  hasImage: boolean;
  opacity: number;
  overlay: string;
  position: string;
  size: string;
  depthEffect: string;
  parallax: string;
  movement: string;
}

export function toLandingBackgroundOutput(background: LandingBackground): LandingBackgroundOutput {
  return {
    id: background.id,
    name: background.name,
    sectionKey: background.sectionKey,
    opacity: background.opacity,
    overlay: background.overlay,
    position: background.position,
    size: background.size,
    depthEffect: background.depthEffect,
    parallax: background.parallax,
    movement: background.movement,
    isActive: background.isActive,
    hasImage: background.hasImage,
    createdAt: background.createdAt,
    updatedAt: background.updatedAt,
    createdBy: background.createdBy,
    createdByUsername: background.createdByUsername,
    updatedBy: background.updatedBy,
    updatedByUsername: background.updatedByUsername,
  };
}
