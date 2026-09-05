import { MarkAlertReadUseCase } from './mark-alert-read.use-case';
import { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';

describe('MarkAlertReadUseCase', () => {
  it('delegates to the repository with the caller and the given key', async () => {
    const repository = {
      markRead: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AlertReadMarkRepository>;
    const useCase = new MarkAlertReadUseCase(repository);

    await useCase.execute({ userId: 'user-1', key: 'purchase:purchase-1' });

    expect(repository.markRead).toHaveBeenCalledWith(
      'user-1',
      'purchase:purchase-1',
    );
  });
});
