import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidQuotationDiscountError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Descuento inválido para el producto: ${productId}`);
  }
}
