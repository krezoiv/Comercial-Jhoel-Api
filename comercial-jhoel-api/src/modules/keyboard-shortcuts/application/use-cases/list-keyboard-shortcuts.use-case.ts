import { Inject, Injectable } from '@nestjs/common';
import { KEYBOARD_SHORTCUT_REPOSITORY } from '../../domain/repositories/keyboard-shortcut.repository';
import type { KeyboardShortcutRepository } from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutOutput, toKeyboardShortcutOutput } from '../dtos/keyboard-shortcut-output';

export interface ListKeyboardShortcutsInput {
  includeInactive?: boolean;
}

/** Read by every authenticated role (see the controller) — `KeyboardShortcutsService` needs the full active list regardless of who's logged in, not just admins. */
@Injectable()
export class ListKeyboardShortcutsUseCase {
  constructor(
    @Inject(KEYBOARD_SHORTCUT_REPOSITORY)
    private readonly keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {}

  async execute(input: ListKeyboardShortcutsInput = {}): Promise<KeyboardShortcutOutput[]> {
    const shortcuts = await this.keyboardShortcutRepository.findAll({
      activeOnly: !input.includeInactive,
    });
    return shortcuts.map(toKeyboardShortcutOutput);
  }
}
