export class CashBoxMovementRecordResponseDto {
  id: string;
  amount: number;
  movementType: string;
  businessDate: string;
  concept: string;
  createdByUsername: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}
