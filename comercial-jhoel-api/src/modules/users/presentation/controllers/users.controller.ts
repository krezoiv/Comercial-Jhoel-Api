import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { UserResponseDto } from '../dtos/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }
}
