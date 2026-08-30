import { IsNumber, Matches, Min } from 'class-validator';

export class UpdateRechargeSaleRequestDto {
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'numeroTelefono debe contener entre 7 y 15 dígitos, con un + inicial opcional',
  })
  phoneNumber: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
}
