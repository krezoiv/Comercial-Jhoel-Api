import { KeyboardShortcut } from '../../domain/entities/keyboard-shortcut.entity';
import { KeyboardShortcutOrmEntity } from './keyboard-shortcut.orm-entity';

export class KeyboardShortcutMapper {
  static toDomain(orm: KeyboardShortcutOrmEntity): KeyboardShortcut {
    return KeyboardShortcut.create({
      id: orm.id,
      label: orm.label,
      key: orm.key,
      altKey: orm.altKey,
      ctrlKey: orm.ctrlKey,
      shiftKey: orm.shiftKey,
      metaKey: orm.metaKey,
      route: orm.route,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
