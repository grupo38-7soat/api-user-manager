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
    console.log(
      '🚀 ~ AuthController ~ request:',
      request,
      this.authenticationUseCase,
    )
    try {
      return HttpResponseHelper.onSucess(response, { data: 'OK' })
    } catch (error) {
      return HttpResponseHelper.onError(response, { error })
    }
  }
}
