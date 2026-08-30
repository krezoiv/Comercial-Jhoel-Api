export class RoleResponseDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  usersCount: number;
  createdAt: Date;
  updatedAt: Date;
}
