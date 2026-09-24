/**
 * The real, existing section ids the public Angular landing renders
 * (`sectionId` on `<app-section>` in each `features/landing/sections/*`
 * component, plus `inicio` for the Hero, which sets its own `id` directly
 * since it isn't built on `<app-section>`). This is the ONE place this
 * list is defined on the backend — `CreateLandingBackgroundRequestDto`/
 * `UpdateLandingBackgroundRequestDto` validate against it via `@IsIn(...)`,
 * so a section key that doesn't correspond to a real place in the landing
 * is rejected before ever reaching the database.
 *
 * Adding a new landing section later means adding one entry here (and the
 * matching one in the frontend's own `LANDING_SECTION_OPTIONS`,
 * `core/data/landing-section-options.data.ts`) — never touching any other
 * file in this module.
 */
export const LANDING_SECTION_KEYS = [
  'inicio',
  'servicios',
  'telefonos',
  'libreria',
  'variedades',
  'agentes-bancarios',
  'noticias',
  'quienes-somos',
  'contacto',
] as const;

export type LandingSectionKey = (typeof LANDING_SECTION_KEYS)[number];
