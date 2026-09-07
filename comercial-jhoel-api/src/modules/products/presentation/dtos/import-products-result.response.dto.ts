export class ImportProductsSkippedRowDto {
  row: number;
  name: string;
  reason: string;
}

export class ImportProductsResultResponseDto {
  totalRows: number;
  created: number;
  createdNames: string[];
  skipped: ImportProductsSkippedRowDto[];
  /** The product itself was created — only its optional extra presentation (Caja, Paquete, ...) failed. */
  presentationWarnings: ImportProductsSkippedRowDto[];
}
