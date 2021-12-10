export interface AuthUser {
  userId: string;
  username: string;
  password: string;
  isTwoFactorEnable: boolean;
  twoFactorAuthSecret?: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
  isTwoFaAuthenticated: boolean;
  sub: number;
}
