export class ImportPurchaseSkippedRowDto {
  row: number;
  identifier: string;
  reason: string;
}

export class ImportPurchaseResultResponseDto {
  totalRows: number;
  productsAffected: number;
  purchasesCreated: number;
  transfersToVitrina: number;
  skipped: ImportPurchaseSkippedRowDto[];
  /** The row's purchase already succeeded — only its follow-up relocation to Vitrina failed. */
  transferWarnings: ImportPurchaseSkippedRowDto[];
}
