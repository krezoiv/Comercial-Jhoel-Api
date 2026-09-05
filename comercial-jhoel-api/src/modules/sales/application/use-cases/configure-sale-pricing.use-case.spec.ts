import { ConfigureSalePricingUseCase } from './configure-sale-pricing.use-case';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { SaleRepository } from '../../domain/repositories/sale.repository';
import { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { Client } from '../../../clients/domain/entities/client.entity';
import { Sale } from '../../domain/entities/sale.entity';

function buildClient(isActive = true): Client {
  return Client.create({
    id: 'client-1',
    name: 'Juan Pérez',
    isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

function buildSale(): Sale {
  return Sale.create({
    id: 'sale-1',
    userId: 'user-1',
    username: 'erick',
    saleDate: new Date(),
    total: 0,
    status: 'OPEN',
    clientId: 'client-1',
    clientName: 'Juan Pérez',
    priceList: 'WHOLESALE',
    draftKey: 'default',
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('ConfigureSalePricingUseCase', () => {
  let saleRepository: jest.Mocked<SaleRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: ConfigureSalePricingUseCase;

  beforeEach(() => {
    saleRepository = {
      configureOpenSale: jest.fn(),
    } as unknown as jest.Mocked<SaleRepository>;
    clientRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ClientRepository>;
    useCase = new ConfigureSalePricingUseCase(saleRepository, clientRepository);
  });

  it('rejects a clientId that does not resolve to any client', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        priceList: 'WHOLESALE',
        draftKey: 'draft-1',
      }),
    ).rejects.toThrow(InvalidClientError);
    expect(saleRepository.configureOpenSale).not.toHaveBeenCalled();
  });

  it('rejects a deactivated client', async () => {
    clientRepository.findById.mockResolvedValue(buildClient(false));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        priceList: 'WHOLESALE',
        draftKey: 'draft-1',
      }),
    ).rejects.toThrow(InvalidClientError);
    expect(saleRepository.configureOpenSale).not.toHaveBeenCalled();
  });

  it('never looks up a client when clientId is null', async () => {
    saleRepository.configureOpenSale.mockResolvedValue(buildSale());

    await useCase.execute({
      userId: 'user-1',
      clientId: null,
      priceList: 'PUBLIC',
      draftKey: 'draft-1',
    });

    expect(clientRepository.findById).not.toHaveBeenCalled();
  });

  it('configures the open sale once the client is valid', async () => {
    clientRepository.findById.mockResolvedValue(buildClient(true));
    saleRepository.configureOpenSale.mockResolvedValue(buildSale());

    const result = await useCase.execute({
      userId: 'user-1',
      clientId: 'client-1',
      priceList: 'WHOLESALE',
      draftKey: 'draft-1',
    });

    expect(saleRepository.configureOpenSale).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: 'client-1',
      priceList: 'WHOLESALE',
      draftKey: 'draft-1',
    });
    expect(result.priceList).toBe('WHOLESALE');
  });
});
