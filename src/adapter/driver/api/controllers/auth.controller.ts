import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { IAuthenticationUseCase } from '@core/application/use-cases'
import { HttpResponseHelper } from '../helpers'
import { IAuthController } from './types/controllers'

export class AuthController implements IAuthController {
  constructor(private readonly authenticationUseCase: IAuthenticationUseCase) {}

  async authenticate(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse> {
    try {
      const authData = await this.authenticationUseCase.execute({
        email: request?.body?.email,
        password: request?.body?.password,
      })
      return HttpResponseHelper.onSucess(response, { data: authData })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
