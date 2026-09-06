import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyboardShortcutOrmEntity } from './infrastructure/persistence/keyboard-shortcut.orm-entity';
import { TypeOrmKeyboardShortcutRepository } from './infrastructure/persistence/typeorm-keyboard-shortcut.repository';
import { KEYBOARD_SHORTCUT_REPOSITORY } from './domain/repositories/keyboard-shortcut.repository';
import { CreateKeyboardShortcutUseCase } from './application/use-cases/create-keyboard-shortcut.use-case';
import { ListKeyboardShortcutsUseCase } from './application/use-cases/list-keyboard-shortcuts.use-case';
import { GetKeyboardShortcutByIdUseCase } from './application/use-cases/get-keyboard-shortcut-by-id.use-case';
import { UpdateKeyboardShortcutUseCase } from './application/use-cases/update-keyboard-shortcut.use-case';
import { DeactivateKeyboardShortcutUseCase } from './application/use-cases/deactivate-keyboard-shortcut.use-case';
import { KeyboardShortcutsController } from './presentation/controllers/keyboard-shortcuts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KeyboardShortcutOrmEntity])],
  controllers: [KeyboardShortcutsController],
  providers: [
    {
      provide: KEYBOARD_SHORTCUT_REPOSITORY,
      useClass: TypeOrmKeyboardShortcutRepository,
    },
    CreateKeyboardShortcutUseCase,
    ListKeyboardShortcutsUseCase,
    GetKeyboardShortcutByIdUseCase,
    UpdateKeyboardShortcutUseCase,
    DeactivateKeyboardShortcutUseCase,
  ],
})
export class KeyboardShortcutsModule {}
