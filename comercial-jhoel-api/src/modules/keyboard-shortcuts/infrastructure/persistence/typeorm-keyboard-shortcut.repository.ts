import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { KeyboardShortcut } from '../../domain/entities/keyboard-shortcut.entity';
import {
  CreateKeyboardShortcutData,
  FindKeyboardShortcutsOptions,
  KeyboardShortcutCombo,
  KeyboardShortcutRepository,
  UpdateKeyboardShortcutData,
} from '../../domain/repositories/keyboard-shortcut.repository';
import { KeyboardShortcutComboAlreadyExistsError } from '../../domain/errors/keyboard-shortcut-combo-already-exists.error';
import { InvalidShortcutModifierError } from '../../domain/errors/invalid-shortcut-modifier.error';
import { KeyboardShortcutOrmEntity } from './keyboard-shortcut.orm-entity';
import { KeyboardShortcutMapper } from './keyboard-shortcut.mapper';

@Injectable()
export class TypeOrmKeyboardShortcutRepository implements KeyboardShortcutRepository {
  constructor(
    @InjectRepository(KeyboardShortcutOrmEntity)
    private readonly repository: Repository<KeyboardShortcutOrmEntity>,
  ) {}

  async findAll(options: FindKeyboardShortcutsOptions): Promise<KeyboardShortcut[]> {
    const orms = await this.repository.find({
      where: options.activeOnly ? { isActive: true } : {},
      order: { label: 'ASC' },
    });
    return orms.map((orm) => KeyboardShortcutMapper.toDomain(orm));
  }

  async findById(id: string): Promise<KeyboardShortcut | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? KeyboardShortcutMapper.toDomain(orm) : null;
  }

  async findByActiveCombo(combo: KeyboardShortcutCombo): Promise<KeyboardShortcut | null> {
    const orm = await this.repository
      .createQueryBuilder('shortcut')
      .where('LOWER(shortcut.key) = LOWER(:key)', { key: combo.key })
      .andWhere('shortcut.altKey = :altKey', { altKey: combo.altKey })
      .andWhere('shortcut.ctrlKey = :ctrlKey', { ctrlKey: combo.ctrlKey })
      .andWhere('shortcut.shiftKey = :shiftKey', { shiftKey: combo.shiftKey })
      .andWhere('shortcut.metaKey = :metaKey', { metaKey: combo.metaKey })
      .andWhere('shortcut.isActive = true')
      .getOne();
    return orm ? KeyboardShortcutMapper.toDomain(orm) : null;
  }

  async create(data: CreateKeyboardShortcutData): Promise<KeyboardShortcut> {
    const orm = this.repository.create({
      label: data.label,
      key: data.key,
      altKey: data.altKey,
      ctrlKey: data.ctrlKey,
      shiftKey: data.shiftKey,
      metaKey: data.metaKey,
      route: data.route,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({ where: { id: saved.id } });
      return KeyboardShortcutMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateConstraintViolation(error);
    }
  }

  async update(id: string, data: UpdateKeyboardShortcutData): Promise<KeyboardShortcut> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateConstraintViolation(error);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return KeyboardShortcutMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Safety net for the create/update race the use case's own pre-check can't close — same reasoning as `TypeOrmTransactionTypeRepository.translateUniqueViolation`. */
  private translateConstraintViolation(error: unknown): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (error.driverError as { constraint?: string } | undefined)?.constraint;
      if (constraint === 'UQ_keyboard_shortcuts_combo_active') {
        return new KeyboardShortcutComboAlreadyExistsError('esta combinación de teclas');
      }
      if (constraint === 'CHK_keyboard_shortcuts_requires_modifier') {
        return new InvalidShortcutModifierError();
      }
    }
    return error;
  }
}
