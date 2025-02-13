import { DomainException, ExceptionCause } from '@core/domain/base'
import { GetUserInput, GetUserOutput, IGetUserUseCase } from '../types/user'
import { IUserRepository } from '@core/domain/repositories'
import {
  formatDateWithoutTime,
  formatDateWithTimezone,
} from '@core/application/helpers'

export class GetUserUseCase implements IGetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ id }: GetUserInput): Promise<GetUserOutput> {
    if (!id) {
      throw new DomainException(
        'O id deve ser informado',
        ExceptionCause.MISSING_DATA,
      )
    }
    const user = await this.userRepository.findUserByParam('id', id)
    if (!user) {
      throw new DomainException(
        'Usuário não encontrado',
        ExceptionCause.NOTFOUND_EXCEPTION,
      )
    }
    const currentUser = user.toJson()
    return {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      birthdate: formatDateWithoutTime(currentUser.birthdate),
      createdAt: formatDateWithTimezone(currentUser.createdAt),
      updatedAt: formatDateWithTimezone(currentUser.updatedAt),
    }
  }
}
