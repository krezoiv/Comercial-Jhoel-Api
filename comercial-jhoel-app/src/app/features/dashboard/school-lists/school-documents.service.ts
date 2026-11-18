import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { SchoolListService } from '../../../core/services/school-list.service';
import { NotificationService } from '../../../core/services/notification.service';
import { downloadBlob } from '../../../core/utils/download-blob';
import { extractBlobErrorMessage } from '../../../core/utils/extract-blob-error-message';
import { printBlob } from '../../../core/utils/print-blob';

/**
 * Downloads or prints the documents of Listas Escolares (quotation PDF and
 * payment receipts). Both are rebuilt by the backend from saved data only.
 */
@Injectable({ providedIn: 'root' })
export class SchoolDocumentsService {
  private readonly service = inject(SchoolListService);
  private readonly notifications = inject(NotificationService);

  /** Id of the document being generated (disables its button). */
  readonly busy = signal<string | null>(null);

  quotation(id: string, number: string, mode: 'download' | 'print'): void {
    this.run(id, this.service.quotationPdf(id), `${number}.pdf`, mode);
  }

  receipt(paymentId: string, receiptNumber: string, mode: 'download' | 'print' = 'download'): void {
    this.run(paymentId, this.service.receiptPdf(paymentId), `${receiptNumber}.pdf`, mode);
  }

  private run(
    key: string,
    request: ReturnType<SchoolListService['quotationPdf']>,
    filename: string,
    mode: 'download' | 'print',
  ): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(key);
    request.subscribe({
      next: (blob) => {
        this.busy.set(null);
        if (mode === 'print') {
          printBlob(blob);
        } else {
          downloadBlob(blob, filename);
        }
      },
      error: async (error: HttpErrorResponse) => {
        this.busy.set(null);
        this.notifications.error(await extractBlobErrorMessage(error, 'No se pudo generar el documento.'));
      },
    });
  }
}
