import { DomainException, ExceptionCause } from '@core/domain/base'
import { User } from '@core/domain/entities'
import { IUserRepository } from '@core/domain/repositories'
import {
  formatDateWithTimezone,
  someEmptyField,
} from '@core/application/helpers'
import {
  CreateUserInput,
  CreateUserOutput,
  ICreateUserUseCase,
} from '../types/user'

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    birthdate,
    name,
    password,
    email,
  }: CreateUserInput): Promise<CreateUserOutput> {
    if (someEmptyField([birthdate, name, password, email])) {
      throw new DomainException(
        'Todos campos obrigatórios devem ser informados',
        ExceptionCause.MISSING_DATA,
      )
    }
    const { id, createdAt } = await this.userRepository.saveUser(
      new User(birthdate, email, name, password),
    )
    return {
      id,
      createdAt: formatDateWithTimezone(createdAt),
    }
  }
}
