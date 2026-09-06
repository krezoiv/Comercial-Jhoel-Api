import { Inject, Injectable } from '@nestjs/common';
import { KEYBOARD_SHORTCUT_REPOSITORY } from '../../domain/repositories/keyboard-shortcut.repository';
import type { KeyboardShortcutRepository } from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutNotFoundError } from '../../domain/errors/keyboard-shortcut-not-found.error';

/** Soft delete only — same convention as every other Sistema catalog. */
@Injectable()
export class DeactivateKeyboardShortcutUseCase {
  constructor(
    @Inject(KEYBOARD_SHORTCUT_REPOSITORY)
    private readonly keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const shortcut = await this.keyboardShortcutRepository.findById(id);
    if (!shortcut) {
      throw new KeyboardShortcutNotFoundError(id);
    }
    await this.keyboardShortcutRepository.deactivate(id);
  }
}
