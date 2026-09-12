import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleSkuRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El SKU es obligatorio.');
  }
}
