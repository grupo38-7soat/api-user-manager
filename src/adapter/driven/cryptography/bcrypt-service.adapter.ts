import { hash, compare } from 'bcrypt'
import { IPasswordEncryptService } from '@core/application/cryptography'

export class BcryptEncryptionServiceAdapter implements IPasswordEncryptService {
  private readonly saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }
}
