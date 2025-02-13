import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { DomainException, ExceptionCause } from '@core/domain/base'
import {
  ICreateUserUseCase,
  IGetUserUseCase,
} from '@core/application/use-cases'
import { UserController } from '@adapter/driver/api/controllers'
import { HttpStatus } from '@adapter/driver/api/types/http-server'

describe('UserController', () => {
  let createUserUseCaseMock: jest.Mocked<ICreateUserUseCase>
  let getUserUseCaseMock: jest.Mocked<IGetUserUseCase>
  let sut: UserController
  let requestMock: Partial<ExpressRequest>
  let responseMock: jest.Mocked<ExpressResponse>
  const errorMessage = 'Some error'
  const errorCause = ExceptionCause.UNKNOWN_EXCEPTION

  beforeAll(() => {
    createUserUseCaseMock = { execute: jest.fn() }
    getUserUseCaseMock = { execute: jest.fn() }
    requestMock = {}
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<ExpressResponse>
    sut = new UserController(createUserUseCaseMock, getUserUseCaseMock)
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

  describe('createUser method', () => {
    const body = {
      email: 'some_info',
      password: 'some_info',
    }

    it('should create a user and return success response', async () => {
      createUserUseCaseMock.execute.mockResolvedValue({
        id: 'some_info',
        createdAt: 'some_info',
      })
      requestMock.body = body
      await sut.createUser(requestMock as ExpressRequest, responseMock)
      expect(createUserUseCaseMock.execute).toHaveBeenCalledWith(
        requestMock.body,
      )
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK)
    })

    it('should return error response if creation fails', async () => {
      createUserUseCaseMock.execute.mockRejectedValue(
        new DomainException(errorMessage, errorCause),
      )
      requestMock.body = body
      await sut.getUser(requestMock as ExpressRequest, responseMock)
      expect(responseMock.status).toHaveBeenCalled()
      expect(responseMock.json).toHaveBeenCalled()
    })
  })

  describe('getUser method', () => {
    const params = {
      id: 'some_info',
    }

    it('should get a user and return success response', async () => {
      getUserUseCaseMock.execute.mockResolvedValue({
        id: 'some_info',
        birthdate: 'some_info',
        email: 'some_info',
        name: 'some_info',
        createdAt: 'some_info',
        updatedAt: 'some_info',
      })
      requestMock.params = params
      await sut.getUser(requestMock as ExpressRequest, responseMock)
      expect(getUserUseCaseMock.execute).toHaveBeenCalledWith(
        requestMock.params,
      )
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK)
    })

    it('should return error response if search fails', async () => {
      getUserUseCaseMock.execute.mockRejectedValue(
        new DomainException(errorMessage, errorCause),
      )
      requestMock.params = params
      await sut.getUser(requestMock as ExpressRequest, responseMock)
      expect(responseMock.status).toHaveBeenCalled()
      expect(responseMock.json).toHaveBeenCalled()
    })
  })
})
