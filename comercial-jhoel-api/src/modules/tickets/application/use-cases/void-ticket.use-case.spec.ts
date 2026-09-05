import { VoidTicketUseCase } from './void-ticket.use-case';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketNotFoundError } from '../../domain/errors/ticket-not-found.error';
import { TicketAlreadyVoidedError } from '../../domain/errors/ticket-already-voided.error';
import { Ticket } from '../../domain/entities/ticket.entity';

function makeTicket(isVoided: boolean): Ticket {
  return Ticket.create({
    id: 'ticket-1',
    ticketNumber: 'T-000001',
    clientId: null,
    clientName: null,
    userId: 'user-1',
    username: 'cajero1',
    subtotal: 100,
    discount: 0,
    total: 100,
    isVoided,
    voidedAt: isVoided ? new Date('2026-09-01T00:00:00Z') : null,
    voidedBy: isVoided ? 'admin-1' : null,
    voidedByUsername: isVoided ? 'admin1' : null,
    voidReason: isVoided ? 'Error de registro' : null,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
}

describe('VoidTicketUseCase', () => {
  let repository: jest.Mocked<TicketRepository>;
  let useCase: VoidTicketUseCase;

  beforeEach(() => {
    repository = {
      createTicket: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      voidTicket: jest.fn(),
    } as unknown as jest.Mocked<TicketRepository>;
    useCase = new VoidTicketUseCase(repository);
  });

  it('throws TicketNotFoundError when the ticket does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', voidedBy: 'admin-1', reason: 'x' }),
    ).rejects.toThrow(TicketNotFoundError);
    expect(repository.voidTicket).not.toHaveBeenCalled();
  });

  it('throws TicketAlreadyVoidedError when the ticket is already voided', async () => {
    repository.findById.mockResolvedValue(makeTicket(true));

    await expect(
      useCase.execute({
        id: 'ticket-1',
        voidedBy: 'admin-1',
        reason: 'x',
      }),
    ).rejects.toThrow(TicketAlreadyVoidedError);
    expect(repository.voidTicket).not.toHaveBeenCalled();
  });

  it('voids a non-voided ticket with the given reason', async () => {
    repository.findById.mockResolvedValue(makeTicket(false));
    repository.voidTicket.mockResolvedValue(makeTicket(true));

    const result = await useCase.execute({
      id: 'ticket-1',
      voidedBy: 'admin-1',
      reason: 'Error de registro',
    });

    expect(repository.voidTicket).toHaveBeenCalledWith(
      'ticket-1',
      'admin-1',
      'Error de registro',
    );
    expect(result.isVoided).toBe(true);
  });
});
