export interface UserPayload {
  sub: string;
  email: string;
  fullName: string;
  iat?: number;
  exp?: number;
}
