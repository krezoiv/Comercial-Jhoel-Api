import { LandingSectionKey } from '../constants/landing-section-key';
import {
  BackgroundPosition,
  BackgroundSize,
  DepthEffect,
  MovementMode,
  OverlayLevel,
  ParallaxIntensity,
} from '../constants/visual-config';

export interface LandingBackgroundProps {
  id: string;
  name: string;
  sectionKey: LandingSectionKey;
  opacity: number;
  overlay: OverlayLevel;
  position: BackgroundPosition;
  size: BackgroundSize;
  depthEffect: DepthEffect;
  parallax: ParallaxIntensity;
  movement: MovementMode;
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
 * A watermark-style depth layer assigned to one landing section — never a
 * catalog item, never a product/phone/news/bank image (see this module's
 * own doc comment for why it deliberately never touches those tables).
 * Same "editorial content, no FK to another business entity" shape as
 * `CatalogBank`/`NewsArticle` — this just carries visual-configuration
 * fields on top instead of description/additionalInfo.
 */
export class LandingBackground {
  private constructor(private readonly props: LandingBackgroundProps) {}

  static create(props: LandingBackgroundProps): LandingBackground {
    return new LandingBackground(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get sectionKey(): LandingSectionKey {
    return this.props.sectionKey;
  }

  get opacity(): number {
    return this.props.opacity;
  }

  get overlay(): OverlayLevel {
    return this.props.overlay;
  }

  get position(): BackgroundPosition {
    return this.props.position;
  }

  get size(): BackgroundSize {
    return this.props.size;
  }

  get depthEffect(): DepthEffect {
    return this.props.depthEffect;
  }

  get parallax(): ParallaxIntensity {
    return this.props.parallax;
  }

  get movement(): MovementMode {
    return this.props.movement;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get hasImage(): boolean {
    return this.props.hasImage;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
