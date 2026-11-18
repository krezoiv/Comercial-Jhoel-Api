import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Product, Quotation, QuotationSalePreview } from '../../../core/models';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { QuotationsService } from '../../../core/services/quotations.service';
import { CreateQuotationTabComponent } from './components/create-quotation-tab/create-quotation-tab.component';
import { QuotationSaleModalComponent } from './components/quotation-sale-modal/quotation-sale-modal.component';

const quotation = { id: 'q1', quotationNumber: 'COT-000001', clientName: 'María López', customerPhone: '5555-1234', status: 'ACEPTADA', total: 95 } as Quotation;

function preview(available: number): QuotationSalePreview {
  return {
    quotation,
    lines: [{ productId: 'p1', productName: 'Cuaderno', quantity: 4, unitPrice: 25, total: 95, available, isActive: true, sufficient: available >= 4 }],
    canConfirm: available >= 4,
  };
}

describe('Cotizaciones — cliente manual y Confirmar venta', () => {
  let service: QuotationsService;
  let confirmSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(QuotationsService);
    confirmSpy = spyOn(TestBed.inject(ConfirmDialogService), 'confirm').and.returnValue(Promise.resolve(true));
  });

  it('creates the quotation with the typed-in customer and warns that inventory is not touched', async () => {
    const create = spyOn(service, 'createQuotation').and.returnValue(of(quotation));
    spyOn(service, 'exportQuotationPdf').and.returnValue(of(new Blob()));
    const tab = TestBed.createComponent(CreateQuotationTabComponent).componentInstance;
    tab.onProductSelected({ id: 'p1', name: 'Cuaderno', sku: null, publicPrice: 25 } as Product);

    tab.customerName.set('María López');
    tab.customerPhone.set('12');
    await tab.saveQuotation();
    expect(create).not.toHaveBeenCalled(); // invalid phone

    tab.customerPhone.set('5555-1234');
    tab.studentName.set('Ana');
    tab.grade.set('Primero Básico');
    await tab.saveQuotation();
    expect(confirmSpy.calls.mostRecent().args[0].message).toContain('NO descuenta inventario');
    const input = create.calls.mostRecent().args[0];
    expect(input).toEqual(
      jasmine.objectContaining({ customerName: 'María López', customerPhone: '5555-1234', studentName: 'Ana', grade: 'Primero Básico', asDraft: false }),
    );
    expect('clientId' in input).toBeFalse();
  });

  it('"Confirmar venta" is blocked without Vitrina stock and sends one request when it is enough', () => {
    const getPreview = spyOn(service, 'getSalePreview').and.returnValue(of(preview(3)));
    const confirmSale = spyOn(service, 'confirmSale').and.returnValue(of({ saleId: 's1', quotation: { ...quotation, status: 'VENDIDA' } }));
    const fixture = TestBed.createComponent(QuotationSaleModalComponent);
    const modal = fixture.componentInstance;
    fixture.componentRef.setInput('quotationId', 'q1');
    modal.ngOnChanges();
    fixture.detectChanges();
    expect(modal.missingNames()).toBe('Cuaderno');
    modal.confirm();
    expect(confirmSale).not.toHaveBeenCalled();

    getPreview.and.returnValue(of(preview(10)));
    modal.ngOnChanges();
    const sold: string[] = [];
    modal.sold.subscribe((id) => sold.push(id));
    modal.confirm();
    expect(confirmSale).toHaveBeenCalledTimes(1);
    expect(sold).toEqual(['s1']);
    expect(modal.units()).toBe(4);
  });
});
