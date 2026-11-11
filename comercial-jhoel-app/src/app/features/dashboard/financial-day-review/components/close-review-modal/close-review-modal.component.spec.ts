import { TestBed } from '@angular/core/testing';

import { CloseReviewSummary } from '../../../../../core/models';
import { CloseReviewModalComponent } from './close-review-modal.component';

function summary(pending: boolean): CloseReviewSummary {
  return {
    session: {
      id: 's1',
      reviewDate: '2026-10-15',
      openedByUsername: 'super',
    } as CloseReviewSummary['session'],
    totalCorrections: 2,
    byModule: { BANCOS: 1, CUENTAS_POR_COBRAR: 1 },
    banksModified: 1,
    cashCorrections: 0,
    receivableCorrections: 1,
    assetCorrections: 0,
    differenceBefore: 50,
    differenceAfter: pending ? 10 : 0,
    hasPendingDifferences: pending,
    pendingDifferences: [],
  };
}

describe('CloseReviewModalComponent (cierre de la revisión)', () => {
  let modal: CloseReviewModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CloseReviewModalComponent] });
    modal = TestBed.createComponent(
      CloseReviewModalComponent,
    ).componentInstance;
    modal.open = true;
  });

  it('closes directly when no differences remain', () => {
    modal.summary = summary(false);
    expect(modal.canConfirm).toBeTrue();
  });

  it('with pending differences requires the explicit acknowledgement', () => {
    const emitted: unknown[] = [];
    modal.confirmed.subscribe((e) => emitted.push(e));
    modal.summary = summary(true);
    expect(modal.canConfirm).toBeFalse();
    modal.onConfirm();
    expect(emitted.length).toBe(0);
    modal.acceptPending.set(true);
    modal.onConfirm();
    expect(emitted).toEqual([
      { observations: '', acceptPendingDifferences: true },
    ]);
  });
});
