export interface ITokenService {
  generateToken(payload: object, expiresIn?: string): string
  verifyToken<T>(token: string): T | null
}
