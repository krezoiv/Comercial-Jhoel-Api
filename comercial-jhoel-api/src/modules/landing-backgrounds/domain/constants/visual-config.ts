/**
 * The visual-configuration vocabulary an admin can choose for a landing
 * background — every one of these maps directly onto a small set of fixed
 * CSS values the frontend's existing 3D/parallax/tilt system already
 * knows how to render (`ParallaxLayerDirective`'s `speed`,
 * `TiltOnMouseDirective`'s `tiltMax`, an overlay opacity, etc.) — the admin
 * never types CSS, only picks from these.
 */
export const OVERLAY_LEVELS = ['none', 'subtle', 'medium', 'strong'] as const;
export type OverlayLevel = (typeof OVERLAY_LEVELS)[number];

export const BACKGROUND_POSITIONS = ['center', 'center-left', 'center-right', 'top', 'bottom'] as const;
export type BackgroundPosition = (typeof BACKGROUND_POSITIONS)[number];

export const BACKGROUND_SIZES = ['small', 'medium', 'large', 'cover'] as const;
export type BackgroundSize = (typeof BACKGROUND_SIZES)[number];

export const DEPTH_EFFECTS = ['none', 'subtle', 'medium', 'deep'] as const;
export type DepthEffect = (typeof DEPTH_EFFECTS)[number];

export const PARALLAX_INTENSITIES = ['off', 'subtle', 'medium'] as const;
export type ParallaxIntensity = (typeof PARALLAX_INTENSITIES)[number];

/**
 * `scroll`/`mouse` read from `parallax`/`depthEffect` respectively for
 * their actual intensity — this field only decides WHICH input sources
 * drive the layer's movement, never a second, competing intensity scale.
 */
export const MOVEMENT_MODES = ['static', 'floating', 'scroll', 'mouse', 'scroll_mouse'] as const;
export type MovementMode = (typeof MOVEMENT_MODES)[number];
