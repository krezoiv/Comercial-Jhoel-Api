import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { LANDING_SECTION_KEYS } from '../../domain/constants/landing-section-key';
import type { LandingSectionKey } from '../../domain/constants/landing-section-key';
import {
  BACKGROUND_POSITIONS,
  BACKGROUND_SIZES,
  DEPTH_EFFECTS,
  MOVEMENT_MODES,
  OVERLAY_LEVELS,
  PARALLAX_INTENSITIES,
} from '../../domain/constants/visual-config';
import type {
  BackgroundPosition,
  BackgroundSize,
  DepthEffect,
  MovementMode,
  OverlayLevel,
  ParallaxIntensity,
} from '../../domain/constants/visual-config';

export class CreateLandingBackgroundRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150)
  name: string;

  @IsIn(LANDING_SECTION_KEYS, { message: 'La sección seleccionada no existe.' })
  sectionKey: LandingSectionKey;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  opacity?: number;

  @IsOptional()
  @IsIn(OVERLAY_LEVELS)
  overlay?: OverlayLevel;

  @IsOptional()
  @IsIn(BACKGROUND_POSITIONS)
  position?: BackgroundPosition;

  @IsOptional()
  @IsIn(BACKGROUND_SIZES)
  size?: BackgroundSize;

  @IsOptional()
  @IsIn(DEPTH_EFFECTS)
  depthEffect?: DepthEffect;

  @IsOptional()
  @IsIn(PARALLAX_INTENSITIES)
  parallax?: ParallaxIntensity;

  @IsOptional()
  @IsIn(MOVEMENT_MODES)
  movement?: MovementMode;
}
