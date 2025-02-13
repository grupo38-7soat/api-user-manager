import { PostgresConnectionAdapter } from '@adapter/driven/database/postgres-connection.adapter'
import { UserRepository } from '@adapter/driven/database/repositories'
import { DomainException } from '@core/domain/base'
import { User } from '@core/domain/entities'
import { QueryResult } from 'pg'
jest.mock('@adapter/driven/database/postgres-connection.adapter')

describe('UserRepository', () => {
  let postgresConnectionAdapter: jest.Mocked<PostgresConnectionAdapter>
  let sut: UserRepository

  beforeAll(() => {
    postgresConnectionAdapter =
      new PostgresConnectionAdapter() as jest.Mocked<PostgresConnectionAdapter>
    sut = new UserRepository(postgresConnectionAdapter)
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

  describe('findUserByParam method', () => {
    it('should return a User when a matching record is found', async () => {
      const mockUserData = {
        id: 'uuid-123',
        birthdate: new Date(1990, 0, 1),
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
      }
      postgresConnectionAdapter.query.mockResolvedValueOnce({
        rows: [mockUserData],
      } as QueryResult)

      const result = await sut.findUserByParam('email', 'test@example.com')
      expect(result).toBeInstanceOf(User)
      expect(result.getEmail()).toBe(mockUserData.email)
    })

    it('should return null when no matching record is found', async () => {
      postgresConnectionAdapter.query.mockResolvedValueOnce({
        rows: [],
      } as QueryResult)
      const result = await sut.findUserByParam('email', 'notfound@example.com')
      expect(result).toBeNull()
    })

    it('should throw DomainException when findUserByParam fails', async () => {
      postgresConnectionAdapter.query.mockRejectedValueOnce(
        new Error('DB error'),
      )
      await expect(
        sut.findUserByParam('email', 'test@example.com'),
      ).rejects.toThrow(DomainException)
    })
  })

  describe('saveUser method', () => {
    const userMock = new User(
      '1990-01-01',
      'test@example.com',
      'Test User',
      'password123',
      'uuid-123',
    )

    it('should save a user and return id and createdAt', async () => {
      const mockDate = new Date()
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
      postgresConnectionAdapter.query.mockResolvedValueOnce({
        rows: [{ id: 'uuid-123' }],
      } as QueryResult)
      const result = await sut.saveUser(userMock)
      expect(result).toEqual({ id: 'uuid-123', createdAt: mockDate })
      expect(postgresConnectionAdapter.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.user'),
        expect.arrayContaining([
          'uuid-123',
          'test@example.com',
          'Test User',
          'password123',
          mockDate,
          mockDate,
        ]),
      )
    })

    it('should throw DomainException when saveUser fails', async () => {
      postgresConnectionAdapter.query.mockRejectedValueOnce(
        new Error('DB error'),
      )
      await expect(sut.saveUser(userMock)).rejects.toThrow(DomainException)
      expect(postgresConnectionAdapter.query).toHaveBeenCalled()
    })
  })
})
