import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'username solo puede contener letras, números, puntos, guiones y guiones bajos',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'phone debe contener entre 7 y 15 dígitos, con un + inicial opcional',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72) // bcrypt ignora silenciosamente los bytes que excedan 72
  password: string;
}
