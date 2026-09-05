import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

export class CreatePresentationRequestDto {
  @IsUUID()
  presentationTypeId: string;

  @IsInt()
  @Min(1)
  conversionFactor: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  publicPrice: number;
}
