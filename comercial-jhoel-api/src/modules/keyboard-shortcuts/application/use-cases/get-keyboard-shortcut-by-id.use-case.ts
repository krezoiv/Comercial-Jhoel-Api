import { Inject, Injectable } from '@nestjs/common';
import { KEYBOARD_SHORTCUT_REPOSITORY } from '../../domain/repositories/keyboard-shortcut.repository';
import type { KeyboardShortcutRepository } from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutNotFoundError } from '../../domain/errors/keyboard-shortcut-not-found.error';
import { KeyboardShortcutOutput, toKeyboardShortcutOutput } from '../dtos/keyboard-shortcut-output';

@Injectable()
export class GetKeyboardShortcutByIdUseCase {
  constructor(
    @Inject(KEYBOARD_SHORTCUT_REPOSITORY)
    private readonly keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {}

  async execute(id: string): Promise<KeyboardShortcutOutput> {
    const shortcut = await this.keyboardShortcutRepository.findById(id);
    if (!shortcut) {
      throw new KeyboardShortcutNotFoundError(id);
    }
    return toKeyboardShortcutOutput(shortcut);
  }
}
