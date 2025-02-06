import {
  AuthenticationInput,
  AuthenticationOutput,
  IAuthenticationUseCase,
} from '../types/auth'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  async execute(input: AuthenticationInput): Promise<AuthenticationOutput> {
    console.log('🚀 ~ AuthenticationUseCase ~ execute ~ input:', input)
    throw new Error('Method not implemented.')
  }
}
