/** Backs la capa de fondos en la landing pública — sin isActive/audit, solo lo que un visitante puede ver. */
export class PublicLandingBackgroundResponseDto {
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
