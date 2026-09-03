import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class RegisterRechargeSimSaleRequestDto {
  @IsUUID()
  simTypeId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  operationDate: string;
}
