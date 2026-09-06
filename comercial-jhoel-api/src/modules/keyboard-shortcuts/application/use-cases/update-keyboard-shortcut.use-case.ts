import { Inject, Injectable } from '@nestjs/common';
import { KEYBOARD_SHORTCUT_REPOSITORY } from '../../domain/repositories/keyboard-shortcut.repository';
import type { KeyboardShortcutRepository } from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutNotFoundError } from '../../domain/errors/keyboard-shortcut-not-found.error';
import { KeyboardShortcutComboAlreadyExistsError } from '../../domain/errors/keyboard-shortcut-combo-already-exists.error';
import { InvalidShortcutModifierError } from '../../domain/errors/invalid-shortcut-modifier.error';
import { describeCombo } from './describe-combo';
import { KeyboardShortcutOutput, toKeyboardShortcutOutput } from '../dtos/keyboard-shortcut-output';

export interface UpdateKeyboardShortcutInput {
  label?: string;
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  route?: string;
  isActive?: boolean;
  updatedBy: string;
}

@Injectable()
export class UpdateKeyboardShortcutUseCase {
  constructor(
    @Inject(KEYBOARD_SHORTCUT_REPOSITORY)
    private readonly keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {}

  async execute(id: string, input: UpdateKeyboardShortcutInput): Promise<KeyboardShortcutOutput> {
    const shortcut = await this.keyboardShortcutRepository.findById(id);
    if (!shortcut) {
      throw new KeyboardShortcutNotFoundError(id);
    }

    const combo = {
      key: input.key?.trim() ?? shortcut.key,
      altKey: input.altKey ?? shortcut.altKey,
      ctrlKey: input.ctrlKey ?? shortcut.ctrlKey,
      shiftKey: input.shiftKey ?? shortcut.shiftKey,
      metaKey: input.metaKey ?? shortcut.metaKey,
    };
    if (!combo.altKey && !combo.ctrlKey && !combo.metaKey) {
      throw new InvalidShortcutModifierError();
    }

    const comboChanged =
      combo.key.toLowerCase() !== shortcut.key.toLowerCase() ||
      combo.altKey !== shortcut.altKey ||
      combo.ctrlKey !== shortcut.ctrlKey ||
      combo.shiftKey !== shortcut.shiftKey ||
      combo.metaKey !== shortcut.metaKey;

    if (comboChanged) {
      const existing = await this.keyboardShortcutRepository.findByActiveCombo(combo);
      if (existing && existing.id !== id) {
        throw new KeyboardShortcutComboAlreadyExistsError(describeCombo(combo));
      }
    }

    const label = input.label?.trim().replace(/\s+/g, ' ');

    const updated = await this.keyboardShortcutRepository.update(id, {
      ...(label ? { label } : {}),
      ...(input.key !== undefined ? { key: combo.key } : {}),
      ...(input.altKey !== undefined ? { altKey: input.altKey } : {}),
      ...(input.ctrlKey !== undefined ? { ctrlKey: input.ctrlKey } : {}),
      ...(input.shiftKey !== undefined ? { shiftKey: input.shiftKey } : {}),
      ...(input.metaKey !== undefined ? { metaKey: input.metaKey } : {}),
      ...(input.route ? { route: input.route.trim() } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      updatedBy: input.updatedBy,
    });

    return toKeyboardShortcutOutput(updated);
  }
}
