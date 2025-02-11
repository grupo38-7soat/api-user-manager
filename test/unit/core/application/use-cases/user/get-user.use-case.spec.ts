import { GetUserUseCase } from '@core/application/use-cases'
import { User } from '@core/domain/entities'
import { IUserRepository } from '@core/domain/repositories'

describe('GetUserUseCase', () => {
  let userRepositoryMock: jest.Mocked<IUserRepository>
  let sut: GetUserUseCase

  beforeAll(() => {
    userRepositoryMock = { saveUser: jest.fn(), findUserByParam: jest.fn() }
    sut = new GetUserUseCase(userRepositoryMock)
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

  describe('execute method', () => {
    it('should throws if id is empty', async () => {
      await expect(sut.execute({ id: '' })).rejects.toThrow(
        'O id deve ser informado',
      )
      expect(userRepositoryMock.findUserByParam).not.toHaveBeenCalled()
    })

    it('should throws if not found a user', async () => {
      const id = 'some_info'
      userRepositoryMock.findUserByParam.mockResolvedValueOnce(null)
      await expect(sut.execute({ id })).rejects.toThrow(
        'Usuário não encontrado',
      )
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledTimes(1)
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledWith('id', id)
    })

    it('should reuturn a valid user', async () => {
      const id = 'some_info'
      const user = new User(
        '1990-01-01',
        'valid@email.com',
        'Test User',
        'some_info',
        'uuid-123',
        new Date(),
        new Date(),
      )
      userRepositoryMock.findUserByParam.mockResolvedValueOnce(user)
      const output = await sut.execute({ id })
      expect(output).toBeDefined()
      expect(output).toHaveProperty('id')
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledTimes(1)
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledWith('id', id)
    })
  })
})
