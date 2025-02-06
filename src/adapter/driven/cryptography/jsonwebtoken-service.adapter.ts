import { sign, verify } from 'jsonwebtoken'
import { ITokenService } from '@core/application/cryptography'

export class JsonWebTokenServiceAdapter implements ITokenService {
  private readonly secretKey: string

  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  generateToken(payload: object, expiresIn: string = '1h'): string {
    return sign(payload, this.secretKey, { expiresIn })
  }

  verifyToken<T>(token: string): T | null {
    try {
      return verify(token, this.secretKey) as T
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
