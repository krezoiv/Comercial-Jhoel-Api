export class AuthUserResponseDto {
  id: string;
  username: string;
  phone: string;
  role: string;
}

export class LoginResponseDto {
  accessToken: string;
  user: AuthUserResponseDto;
}
