import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { HealthController } from '@adapter/driver/api/controllers'
import { HttpStatus } from '@adapter/driver/api/types/http-server'

describe('HealthController', () => {
  let sut: HealthController
  let requestMock: Partial<ExpressRequest>
  let responseMock: jest.Mocked<ExpressResponse>

  beforeAll(() => {
    requestMock = {}
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<ExpressResponse>
    sut = new HealthController()
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

  describe('check method', () => {
    it('should authenticate a user and return success response', async () => {
      await sut.check(requestMock as ExpressRequest, responseMock)
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK)
    })
  })
})
