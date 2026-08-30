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
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeactivateUserUseCase } from '../../application/use-cases/deactivate-user.use-case';
import { GetUserPreferencesUseCase } from '../../application/use-cases/get-user-preferences.use-case';
import { UpdateUserThemeUseCase } from '../../application/use-cases/update-user-theme.use-case';
import { RegisterUserRequestDto } from '../dtos/register-user.request.dto';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { UpdateUserRequestDto } from '../dtos/update-user.request.dto';
import { UpdateThemeRequestDto } from '../dtos/update-theme.request.dto';
import { ListUsersQueryDto } from '../dtos/list-users.query.dto';
import {
  PaginatedUsersResponseDto,
  RegisterUserResponseDto,
  UserResponseDto,
} from '../dtos/user.response.dto';
import { UserPreferencesResponseDto } from '../dtos/user-preferences.response.dto';

/**
 * No class-level guard: `register` is intentionally public (self-registration),
 * while every admin route below opts in to `JwtAuthGuard` + `RolesGuard`
 * individually — same split `AuthController` uses for login vs change-password.
 */
@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly getUserPreferencesUseCase: GetUserPreferencesUseCase,
    private readonly updateUserThemeUseCase: UpdateUserThemeUseCase,
  ) {}

  /** Public self-registration — always assigns the USER role, never a caller-supplied one. */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
    return this.registerUserUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  /**
   * "Modo Claro / Modo Oscuro por usuario" — cualquier cuenta autenticada
   * (sin `@Roles`, a diferencia de las rutas de administración de abajo):
   * el tema es una preferencia personal, no una acción administrativa.
   * `userId` sale siempre de `@CurrentUser` (JWT), nunca de un parámetro
   * de ruta, así que no existe forma de leer/escribir la preferencia de
   * otra cuenta a través de este endpoint. Declaradas antes de `:id`
   * (mismo motivo de siempre en esta base de código: un segmento literal
   * debe registrarse antes que uno dinámico o Nest intentaría matchear
   * "me" como `:id` y fallaría `ParseUUIDPipe`).
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/preferences')
  getMyPreferences(
    @CurrentUser('userId') userId: string,
  ): Promise<UserPreferencesResponseDto> {
    return this.getUserPreferencesUseCase.execute(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/preferences/theme')
  updateMyTheme(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateThemeRequestDto,
  ): Promise<UserPreferencesResponseDto> {
    return this.updateUserThemeUseCase.execute(userId, dto.theme);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get()
  findAll(
    @Query() query: ListUsersQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.listUsersUseCase.execute(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRequestDto,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, dto, currentUserId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<void> {
    return this.deactivateUserUseCase.execute(id, currentUserId);
  }
}
