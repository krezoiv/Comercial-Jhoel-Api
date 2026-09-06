import { Inject, Injectable } from '@nestjs/common';
import { KEYBOARD_SHORTCUT_REPOSITORY } from '../../domain/repositories/keyboard-shortcut.repository';
import type { KeyboardShortcutRepository } from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutComboAlreadyExistsError } from '../../domain/errors/keyboard-shortcut-combo-already-exists.error';
import { InvalidShortcutModifierError } from '../../domain/errors/invalid-shortcut-modifier.error';
import { describeCombo } from './describe-combo';
import { KeyboardShortcutOutput, toKeyboardShortcutOutput } from '../dtos/keyboard-shortcut-output';

export interface CreateKeyboardShortcutInput {
  label: string;
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  route: string;
  createdBy: string;
}

@Injectable()
export class CreateKeyboardShortcutUseCase {
  constructor(
    @Inject(KEYBOARD_SHORTCUT_REPOSITORY)
    private readonly keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {}

  async execute(input: CreateKeyboardShortcutInput): Promise<KeyboardShortcutOutput> {
    if (!input.altKey && !input.ctrlKey && !input.metaKey) {
      throw new InvalidShortcutModifierError();
    }

    const label = input.label.trim().replace(/\s+/g, ' ');
    const combo = {
      key: input.key.trim(),
      altKey: input.altKey,
      ctrlKey: input.ctrlKey,
      shiftKey: input.shiftKey,
      metaKey: input.metaKey,
    };

    const existing = await this.keyboardShortcutRepository.findByActiveCombo(combo);
    if (existing) {
      throw new KeyboardShortcutComboAlreadyExistsError(describeCombo(combo));
    }

    const shortcut = await this.keyboardShortcutRepository.create({
      label,
      ...combo,
      route: input.route.trim(),
      createdBy: input.createdBy,
    });
    return toKeyboardShortcutOutput(shortcut);
  }
}
