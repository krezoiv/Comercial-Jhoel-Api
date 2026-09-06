import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateKeyboardShortcutUseCase } from '../../application/use-cases/create-keyboard-shortcut.use-case';
import { ListKeyboardShortcutsUseCase } from '../../application/use-cases/list-keyboard-shortcuts.use-case';
import { GetKeyboardShortcutByIdUseCase } from '../../application/use-cases/get-keyboard-shortcut-by-id.use-case';
import { UpdateKeyboardShortcutUseCase } from '../../application/use-cases/update-keyboard-shortcut.use-case';
import { DeactivateKeyboardShortcutUseCase } from '../../application/use-cases/deactivate-keyboard-shortcut.use-case';
import { CreateKeyboardShortcutRequestDto } from '../dtos/create-keyboard-shortcut.request.dto';
import { UpdateKeyboardShortcutRequestDto } from '../dtos/update-keyboard-shortcut.request.dto';
import { ListKeyboardShortcutsQueryDto } from '../dtos/list-keyboard-shortcuts.query.dto';
import { KeyboardShortcutResponseDto } from '../dtos/keyboard-shortcut.response.dto';

/**
 * "Sistema → Atajos de Teclado". CRUD is admin-only (create/update/
 * deactivate), same policy as every other Sistema catalog — but `GET` stays
 * open to any authenticated role, because the frontend's own
 * `KeyboardShortcutsService` must be able to fetch and use every active
 * shortcut regardless of who's logged in, not just admins who can manage
 * them (identical reasoning to `TransactionTypesController`'s own read/
 * write split).
 */
@UseGuards(JwtAuthGuard)
@Controller('keyboard-shortcuts')
export class KeyboardShortcutsController {
  constructor(
    private readonly createKeyboardShortcutUseCase: CreateKeyboardShortcutUseCase,
    private readonly listKeyboardShortcutsUseCase: ListKeyboardShortcutsUseCase,
    private readonly getKeyboardShortcutByIdUseCase: GetKeyboardShortcutByIdUseCase,
    private readonly updateKeyboardShortcutUseCase: UpdateKeyboardShortcutUseCase,
    private readonly deactivateKeyboardShortcutUseCase: DeactivateKeyboardShortcutUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateKeyboardShortcutRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<KeyboardShortcutResponseDto> {
    return this.createKeyboardShortcutUseCase.execute({
      label: dto.label,
      key: dto.key,
      altKey: dto.altKey ?? false,
      ctrlKey: dto.ctrlKey ?? false,
      shiftKey: dto.shiftKey ?? false,
      metaKey: dto.metaKey ?? false,
      route: dto.route,
      createdBy: userId,
    });
  }

  @Get()
  findAll(@Query() query: ListKeyboardShortcutsQueryDto): Promise<KeyboardShortcutResponseDto[]> {
    return this.listKeyboardShortcutsUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<KeyboardShortcutResponseDto> {
    return this.getKeyboardShortcutByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateKeyboardShortcutRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<KeyboardShortcutResponseDto> {
    return this.updateKeyboardShortcutUseCase.execute(id, {
      ...dto,
      updatedBy: userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateKeyboardShortcutUseCase.execute(id);
  }
}
