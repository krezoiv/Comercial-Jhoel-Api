/** Las secciones reales de la landing pública — mismos `sectionId` que ya usa cada `<app-section>` (y `inicio` para el Hero). Ver el backend `LANDING_SECTION_KEYS` — es la misma lista, nunca debe divergir. */
export const LANDING_SECTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'inicio', label: 'Inicio / Hero' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'telefonos', label: 'Teléfonos' },
  { value: 'libreria', label: 'Librería' },
  { value: 'variedades', label: 'Accesorios y Variedades' },
  { value: 'agentes-bancarios', label: 'Bancos / Agentes Bancarios' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'quienes-somos', label: 'Quiénes somos' },
  { value: 'contacto', label: 'Contacto' },
];

export type OverlayLevel = 'none' | 'subtle' | 'medium' | 'strong';
export type BackgroundPosition = 'center' | 'center-left' | 'center-right' | 'top' | 'bottom';
export type BackgroundSize = 'small' | 'medium' | 'large' | 'cover';
export type DepthEffect = 'none' | 'subtle' | 'medium' | 'deep';
export type ParallaxIntensity = 'off' | 'subtle' | 'medium';
export type MovementMode = 'static' | 'floating' | 'scroll' | 'mouse' | 'scroll_mouse';

export const OVERLAY_OPTIONS: { value: OverlayLevel; label: string }[] = [
  { value: 'none', label: 'Ninguno' },
  { value: 'subtle', label: 'Sutil' },
  { value: 'medium', label: 'Medio' },
  { value: 'strong', label: 'Fuerte' },
];

export const POSITION_OPTIONS: { value: BackgroundPosition; label: string }[] = [
  { value: 'center', label: 'Centro' },
  { value: 'center-left', label: 'Centro izquierda' },
  { value: 'center-right', label: 'Centro derecha' },
  { value: 'top', label: 'Arriba' },
  { value: 'bottom', label: 'Abajo' },
];

export const SIZE_OPTIONS: { value: BackgroundSize; label: string }[] = [
  { value: 'small', label: 'Pequeño' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
  { value: 'cover', label: 'Cubrir sección' },
];

export const DEPTH_EFFECT_OPTIONS: { value: DepthEffect; label: string }[] = [
  { value: 'none', label: 'Sin efecto' },
  { value: 'subtle', label: 'Sutil' },
  { value: 'medium', label: 'Medio' },
  { value: 'deep', label: 'Profundo' },
];

export const PARALLAX_OPTIONS: { value: ParallaxIntensity; label: string }[] = [
  { value: 'off', label: 'Desactivado' },
  { value: 'subtle', label: 'Sutil' },
  { value: 'medium', label: 'Medio' },
];

export const MOVEMENT_OPTIONS: { value: MovementMode; label: string }[] = [
  { value: 'static', label: 'Estático' },
  { value: 'floating', label: 'Floating' },
  { value: 'scroll', label: 'Parallax (scroll)' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'scroll_mouse', label: 'Mouse + Scroll' },
];

/** Ficha completa de administración. */
export interface LandingBackground {
  id: string;
  name: string;
  sectionKey: string;
  opacity: number;
  overlay: OverlayLevel;
  position: BackgroundPosition;
  size: BackgroundSize;
  depthEffect: DepthEffect;
  parallax: ParallaxIntensity;
  movement: MovementMode;
  isActive: boolean;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface LandingBackgroundVisualConfigInput {
  opacity?: number;
  overlay?: OverlayLevel;
  position?: BackgroundPosition;
  size?: BackgroundSize;
  depthEffect?: DepthEffect;
  parallax?: ParallaxIntensity;
  movement?: MovementMode;
}

export interface CreateLandingBackgroundInput extends LandingBackgroundVisualConfigInput {
  name: string;
  sectionKey: string;
}

export interface UpdateLandingBackgroundInput extends LandingBackgroundVisualConfigInput {
  name?: string;
  sectionKey?: string;
}

/** Shape público — backs la capa de fondos en la landing. Sin isActive/audit/nombre. */
export interface PublicLandingBackground {
  id: string;
  sectionKey: string;
  hasImage: boolean;
  opacity: number;
  overlay: OverlayLevel;
  position: BackgroundPosition;
  size: BackgroundSize;
  depthEffect: DepthEffect;
  parallax: ParallaxIntensity;
  movement: MovementMode;
}
