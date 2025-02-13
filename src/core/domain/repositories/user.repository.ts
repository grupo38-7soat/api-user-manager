import { User } from '../entities'

export interface IUserRepository {
  saveUser(user: User): Promise<{ id: string; createdAt: Date }>
  findUserByParam(param: string, value: unknown): Promise<User>
}
