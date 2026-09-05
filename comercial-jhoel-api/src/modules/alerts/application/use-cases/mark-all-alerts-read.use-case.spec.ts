import { MarkAllAlertsReadUseCase } from './mark-all-alerts-read.use-case';
import { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';
import { GetAlertsUseCase } from './get-alerts.use-case';

describe('MarkAllAlertsReadUseCase', () => {
  it('marks every key from the currently active alert set as read for the caller', async () => {
    const readMarkRepository = {
      markAllRead: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AlertReadMarkRepository>;
    const getAlertsUseCase = {
      execute: jest.fn().mockResolvedValue({
        count: 2,
        total: 2,
        items: [
          { key: 'purchase:1' },
          { key: 'inventory:product-1:location-1' },
        ],
      }),
    } as unknown as jest.Mocked<GetAlertsUseCase>;

    const useCase = new MarkAllAlertsReadUseCase(
      readMarkRepository,
      getAlertsUseCase,
    );

    await useCase.execute({ userId: 'user-1', isAdmin: false });

    expect(getAlertsUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      isAdmin: false,
    });
    expect(readMarkRepository.markAllRead).toHaveBeenCalledWith('user-1', [
      'purchase:1',
      'inventory:product-1:location-1',
    ]);
  });

  it('marks nothing when there are no active alerts', async () => {
    const readMarkRepository = {
      markAllRead: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AlertReadMarkRepository>;
    const getAlertsUseCase = {
      execute: jest.fn().mockResolvedValue({ count: 0, total: 0, items: [] }),
    } as unknown as jest.Mocked<GetAlertsUseCase>;

    const useCase = new MarkAllAlertsReadUseCase(
      readMarkRepository,
      getAlertsUseCase,
    );

    await useCase.execute({ userId: 'user-1', isAdmin: false });

    expect(readMarkRepository.markAllRead).toHaveBeenCalledWith('user-1', []);
  });
});
