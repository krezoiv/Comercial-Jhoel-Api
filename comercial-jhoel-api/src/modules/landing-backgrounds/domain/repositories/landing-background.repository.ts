import { LandingSectionKey } from '../constants/landing-section-key';
import { BackgroundPosition, BackgroundSize, DepthEffect, MovementMode, OverlayLevel, ParallaxIntensity } from '../constants/visual-config';
import { LandingBackground } from '../entities/landing-background.entity';

export const LANDING_BACKGROUND_REPOSITORY = Symbol('LANDING_BACKGROUND_REPOSITORY');

export interface LandingBackgroundVisualConfig {
  opacity?: number;
  overlay?: OverlayLevel;
  position?: BackgroundPosition;
  size?: BackgroundSize;
  depthEffect?: DepthEffect;
  parallax?: ParallaxIntensity;
  movement?: MovementMode;
}

export interface CreateLandingBackgroundData extends LandingBackgroundVisualConfig {
  name: string;
  sectionKey: LandingSectionKey;
  createdBy: string;
}

export interface UpdateLandingBackgroundData extends LandingBackgroundVisualConfig {
  name?: string;
  sectionKey?: LandingSectionKey;
  updatedBy: string;
}

export interface ListLandingBackgroundsOptions {
  includeInactive?: boolean;
}

export interface LandingBackgroundImageBytes {
  data: Buffer;
  mimeType: string;
}

export interface LandingBackgroundRepository {
  findAll(options?: ListLandingBackgroundsOptions): Promise<LandingBackground[]>;
  findById(id: string): Promise<LandingBackground | null>;
  /** The one currently-active background for a section, if any — the pre-check behind the "esta sección ya tiene un fondo activo" rule (the real guarantee is the partial unique index `UQ_landing_backgrounds_section_active`, this is the friendly fast-path). */
  findActiveBySectionKey(sectionKey: LandingSectionKey): Promise<LandingBackground | null>;
  /** Público — solo activos, con imagen o sin ella (una sección sin imagen subida simplemente no debería estar activa, pero esto no lo asume). */
  findPublished(): Promise<LandingBackground[]>;
  create(data: CreateLandingBackgroundData): Promise<LandingBackground>;
  update(id: string, data: UpdateLandingBackgroundData): Promise<LandingBackground>;
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>;
  removeImage(id: string, updatedBy: string): Promise<void>;
  getImage(id: string): Promise<LandingBackgroundImageBytes | null>;
}
