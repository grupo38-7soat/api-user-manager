import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { IAuthenticationUseCase } from '@core/application/use-cases'
import { AuthController } from '@adapter/driver/api/controllers'
import { HttpStatus } from '@adapter/driver/api/types/http-server'

describe('AuthController', () => {
  let authenticationUseCaseMock: jest.Mocked<IAuthenticationUseCase>
  let sut: AuthController
  let requestMock: Partial<ExpressRequest>
  let responseMock: jest.Mocked<ExpressResponse>
  const errorMessage = 'Some error'
  const errorCause = ExceptionCause.UNKNOWN_EXCEPTION

  beforeAll(() => {
    authenticationUseCaseMock = { execute: jest.fn() }
    requestMock = {}
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<ExpressResponse>
    sut = new AuthController(authenticationUseCaseMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('authenticate method', () => {
    const body = {
      email: 'some_info',
      password: 'some_info',
    }

    it('should authenticate a user and return success response', async () => {
      authenticationUseCaseMock.execute.mockResolvedValue({
        token: 'fake-jwt-token',
      })
      requestMock.body = body
      await sut.authenticate(requestMock as ExpressRequest, responseMock)
      expect(authenticationUseCaseMock.execute).toHaveBeenCalledWith(
        requestMock.body,
      )
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK)
    })

    it('should return error response if authentication fails', async () => {
      authenticationUseCaseMock.execute.mockRejectedValue(
        new DomainException(errorMessage, errorCause),
      )
      requestMock.body = body
      await sut.authenticate(requestMock as ExpressRequest, responseMock)
      expect(responseMock.status).toHaveBeenCalled()
      expect(responseMock.json).toHaveBeenCalled()
    })
  })
})
