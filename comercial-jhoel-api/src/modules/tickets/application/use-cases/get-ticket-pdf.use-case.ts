import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/repositories/ticket.repository';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketNotFoundError } from '../../domain/errors/ticket-not-found.error';
import { TicketAccessDeniedError } from '../../domain/errors/ticket-access-denied.error';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { buildTicketPdf } from '../../infrastructure/pdf/ticket-pdf.builder';

export interface GetTicketPdfInput {
  currentUserId: string;
  isAdmin: boolean;
}

/**
 * Reconstructs the ticket's receipt PDF purely from already-persisted data
 * — never re-runs `create_ticket`. Same ownership rule as
 * `GetTicketByIdUseCase`. A ticket has no draft concept (created in one
 * shot, like a purchase), so there's no draft-rejection branch.
 */
@Injectable()
export class GetTicketPdfUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(id: string, input: GetTicketPdfInput): Promise<Buffer> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    if (!input.isAdmin && ticket.userId !== input.currentUserId) {
      throw new TicketAccessDeniedError();
    }

    const company = await this.companySettingsRepository.get();

    return buildTicketPdf({
      company: {
        businessName: company.businessName,
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        logoBase64: company.logoBase64,
      },
      ticketNumber: ticket.ticketNumber,
      createdAt: ticket.createdAt,
      username: ticket.username,
      clientName: ticket.clientName,
      items: ticket.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        observation: item.observation,
      })),
      total: ticket.total,
    });
  }
}
