import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFuction,
} from 'express'
import { HttpMethod, IRouteProps } from './types/http-server'

export const healthRoutes: IRouteProps[] = [
  {
    resource: '/health',
    method: HttpMethod.GET,
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'check',
  },
]

export const authenticationRoutes: IRouteProps[] = [
  {
    resource: '/autenticacao',
    method: HttpMethod.POST,
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'authenticate',
  },
]

export const userRoutes: IRouteProps[] = [
  {
    resource: '/usuarios/:id',
    method: HttpMethod.GET,
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'getUser',
  },
  {
    resource: '/usuarios',
    method: HttpMethod.POST,
    middleware: (
      _request: ExpressRequest,
      _response: ExpressResponse,
      next: ExpressNextFuction,
    ) => next(),
    handler: 'createUser',
  },
]
