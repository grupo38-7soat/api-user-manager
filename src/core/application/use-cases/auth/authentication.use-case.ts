import { DomainException, ExceptionCause } from '@core/domain/base'
import { IUserRepository } from '@core/domain/repositories'
import {
  IPasswordEncryptService,
  ITokenService,
} from '@core/application/cryptography'
import {
  formatDateWithoutTime,
  formatDateWithTimezone,
  someEmptyField,
} from '@core/application/helpers'
import {
  AuthenticationInput,
  AuthenticationOutput,
  IAuthenticationUseCase,
} from '../types/auth'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordEncrypt: IPasswordEncryptService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticationInput): Promise<AuthenticationOutput> {
    if (someEmptyField([email, password])) {
      throw new DomainException(
        'Todos campos obrigatórios devem ser informados',
        ExceptionCause.MISSING_DATA,
      )
    }
    const user = await this.userRepository.findUserByParam('email', email)
    if (!user) {
      throw new DomainException(
        'E-mail ou senha inválido',
        ExceptionCause.UNAUTHORIZED_ACCESS,
      )
    }
    const isValidPassword = await this.passwordEncrypt.comparePassword(
      password,
      user.getPassword(),
    )
    if (!isValidPassword) {
      throw new DomainException(
        'E-mail ou senha inválido',
        ExceptionCause.UNAUTHORIZED_ACCESS,
      )
    }
    const currentUser = user.toJson()
    return {
      token: this.tokenService.generateToken({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        birthdate: formatDateWithoutTime(currentUser.birthdate),
        createdAt: formatDateWithTimezone(currentUser.createdAt),
        updatedAt: formatDateWithTimezone(currentUser.updatedAt),
      }),
    }
  }
}
