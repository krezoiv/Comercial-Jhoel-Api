import { CreateTicketUseCase } from './create-ticket.use-case';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { TicketEmptyError } from '../../domain/errors/ticket-empty.error';
import { InvalidTicketQuantityError } from '../../domain/errors/invalid-ticket-quantity.error';
import { InvalidTicketPriceError } from '../../domain/errors/invalid-ticket-price.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { Ticket } from '../../domain/entities/ticket.entity';
import { Client } from '../../../clients/domain/entities/client.entity';

function makeTicket(): Ticket {
  return Ticket.create({
    id: 'ticket-1',
    ticketNumber: 'T-000001',
    clientId: null,
    clientName: null,
    userId: 'user-1',
    username: 'cajero1',
    subtotal: 10,
    discount: 0,
    total: 10,
    isVoided: false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
}

function makeClient(isActive: boolean): Client {
  return Client.create({
    id: 'client-1',
    name: 'Cliente de Prueba',
    isActive,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
    createdBy: 'admin-1',
    createdByUsername: 'admin1',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('CreateTicketUseCase', () => {
  let ticketRepository: jest.Mocked<TicketRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: CreateTicketUseCase;

  beforeEach(() => {
    ticketRepository = {
      createTicket: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      voidTicket: jest.fn(),
    } as unknown as jest.Mocked<TicketRepository>;
    clientRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<ClientRepository>;
    useCase = new CreateTicketUseCase(ticketRepository, clientRepository);
  });

  it('throws TicketEmptyError when items is empty', async () => {
    await expect(
      useCase.execute({ userId: 'user-1', items: [] }),
    ).rejects.toThrow(TicketEmptyError);
    expect(ticketRepository.createTicket).not.toHaveBeenCalled();
  });

  it('throws InvalidTicketQuantityError for a non-positive quantity', async () => {
    await expect(
      useCase.execute({
        userId: 'user-1',
        items: [{ productId: 'product-1', quantity: 0 }],
      }),
    ).rejects.toThrow(InvalidTicketQuantityError);
    expect(ticketRepository.createTicket).not.toHaveBeenCalled();
  });

  it('throws InvalidClientError when the client does not exist', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'missing-client',
        items: [{ productId: 'product-1', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidClientError);
    expect(ticketRepository.createTicket).not.toHaveBeenCalled();
  });

  it('throws InvalidClientError when the client is inactive', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(false));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        items: [{ productId: 'product-1', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidClientError);
  });

  it('merges duplicate product lines by summing quantities', async () => {
    ticketRepository.createTicket.mockResolvedValue(makeTicket());

    await useCase.execute({
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 2 },
        { productId: 'product-1', quantity: 3 },
      ],
    });

    expect(ticketRepository.createTicket).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: null,
      items: [
        { productId: 'product-1', quantity: 5, observation: null, unitPrice: null },
      ],
    });
  });

  it('passes each item observation through to the repository', async () => {
    ticketRepository.createTicket.mockResolvedValue(makeTicket());

    await useCase.execute({
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 1, observation: 'Sin hielo' },
        { productId: 'product-2', quantity: 1 },
      ],
    });

    expect(ticketRepository.createTicket).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: null,
      items: [
        {
          productId: 'product-1',
          quantity: 1,
          observation: 'Sin hielo',
          unitPrice: null,
        },
        {
          productId: 'product-2',
          quantity: 1,
          observation: null,
          unitPrice: null,
        },
      ],
    });
  });

  it('trims a blank observation down to null', async () => {
    ticketRepository.createTicket.mockResolvedValue(makeTicket());

    await useCase.execute({
      userId: 'user-1',
      items: [{ productId: 'product-1', quantity: 1, observation: '   ' }],
    });

    expect(ticketRepository.createTicket).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: null,
      items: [
        { productId: 'product-1', quantity: 1, observation: null, unitPrice: null },
      ],
    });
  });

  it('passes a manual unitPrice override through to the repository without touching product data', async () => {
    ticketRepository.createTicket.mockResolvedValue(makeTicket());

    await useCase.execute({
      userId: 'user-1',
      items: [{ productId: 'product-1', quantity: 2, unitPrice: 5 }],
    });

    expect(ticketRepository.createTicket).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: null,
      items: [
        { productId: 'product-1', quantity: 2, observation: null, unitPrice: 5 },
      ],
    });
  });

  it('throws InvalidTicketPriceError for a negative unitPrice', async () => {
    await expect(
      useCase.execute({
        userId: 'user-1',
        items: [{ productId: 'product-1', quantity: 1, unitPrice: -1 }],
      }),
    ).rejects.toThrow(InvalidTicketPriceError);
    expect(ticketRepository.createTicket).not.toHaveBeenCalled();
  });
});
