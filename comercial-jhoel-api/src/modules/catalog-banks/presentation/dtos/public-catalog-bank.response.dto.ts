/** Backs "Bancos" en la landing — sin isActive/audit/orden, solo lo que un visitante puede ver. Nunca datos del módulo financiero "Bancos". */
export class PublicCatalogBankResponseDto {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  hasImage: boolean;
}
