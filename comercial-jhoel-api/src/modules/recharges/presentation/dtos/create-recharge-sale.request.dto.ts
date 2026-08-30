import { IsDateString, IsNumber, IsUUID, Matches, Min } from 'class-validator';

export class CreateRechargeSaleRequestDto {
  @IsUUID()
  rechargeTypeId: string;

  // Same phone shape the Users module already validates against
  // (`RegisterUserRequestDto.phone`) — 7 to 15 digits, optional leading `+`.
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'numeroTelefono debe contener entre 7 y 15 dígitos, con un + inicial opcional',
  })
  phoneNumber: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  /** `yyyy-MM-dd` — the day this sale is credited to; the use case still rejects anything past `maxAllowedOperationDate()`. */
  @IsDateString()
  operationDate: string;
}
