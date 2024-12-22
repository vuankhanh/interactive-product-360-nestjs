export type UserRole = "admin" | "user";
export interface ITokenPayload {
  username: string,
  role: UserRole,
  iat: number,
  exp: number
}