import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import {
  ICreateUserUseCase,
  IGetUserUseCase,
} from '@core/application/use-cases'
import { HttpResponseHelper } from '../helpers'
import { IUserController } from './types/controllers'

export class UserController implements IUserController {
  constructor(
    private readonly createUserUseCase: ICreateUserUseCase,
    private readonly getUserUseCase: IGetUserUseCase,
  ) {}

  async createUser(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const userData = await this.createUserUseCase.execute({
        birthdate: request?.body?.birthdate,
        email: request?.body?.email,
        name: request?.body?.name,
        password: request?.body?.password,
      })
      return HttpResponseHelper.onSucess(response, { data: userData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }

  async getUser(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const userData = await this.getUserUseCase.execute({
        id: request?.params?.id,
      })
      return HttpResponseHelper.onSucess(response, { data: userData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
