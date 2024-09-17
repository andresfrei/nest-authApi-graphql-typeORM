export interface JwtPayload {
  authId: string;
  shopId: string;
  iat: number;
  exp: number;
}
