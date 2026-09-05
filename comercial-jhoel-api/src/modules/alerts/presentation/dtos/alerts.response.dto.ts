import { AlertType, AlertPriority } from '../../domain/entities/alert.entity';

export class AlertResponseDto {
  key: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  amount: number | null;
  date: string | null;
  route: string;
  referenceId: string;
  isRead: boolean;
}

export class AlertsResponseDto {
  count: number;
  total: number;
  items: AlertResponseDto[];
}
