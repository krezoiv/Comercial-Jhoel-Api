export class ImportPurchaseSkippedRowDto {
  row: number;
  identifier: string;
  reason: string;
}

export class ImportPurchaseResultResponseDto {
  totalRows: number;
  productsAffected: number;
  purchasesCreated: number;
  skipped: ImportPurchaseSkippedRowDto[];
}
