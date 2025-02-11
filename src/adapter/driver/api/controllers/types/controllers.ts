import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface IHealthController {
  check(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

export interface IUserController {
  createUser(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
  getUser(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}

export interface IAuthController {
  authenticate(
    request: ExpressRequest,
    response: ExpressResponse,
  ): Promise<ExpressResponse>
}
