export class UserResponseDto {
  id: string;
  username: string;
  phone: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  items: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}

/** Response shape for POST /users/register — kept minimal, matches the pre-existing self-signup contract. */
export class RegisterUserResponseDto {
  id: string;
  username: string;
  phone: string;
  role: string;
  createdAt: Date;
}
