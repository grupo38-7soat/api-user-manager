import {
  IPasswordEncryptService,
  ITokenService,
} from '@core/application/cryptography'
import { AuthenticationUseCase } from '@core/application/use-cases'
import { User } from '@core/domain/entities'
import { IUserRepository } from '@core/domain/repositories'

describe('AuthenticationUseCase', () => {
  let userRepositoryMock: jest.Mocked<IUserRepository>
  let passwordEncryptServiceMock: jest.Mocked<IPasswordEncryptService>
  let tokenServiceMock: jest.Mocked<ITokenService>
  let sut: AuthenticationUseCase

  beforeAll(() => {
    userRepositoryMock = { saveUser: jest.fn(), findUserByParam: jest.fn() }
    passwordEncryptServiceMock = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    }
    tokenServiceMock = { generateToken: jest.fn(), verifyToken: jest.fn() }
    sut = new AuthenticationUseCase(
      userRepositoryMock,
      passwordEncryptServiceMock,
      tokenServiceMock,
    )
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
    it.each([
      { email: '', password: 'some_info' },
      { email: 'some_info', password: '' },
    ])(
      'should throws if any required field is empty',
      async ({ email, password }) => {
        await expect(sut.execute({ email, password })).rejects.toThrow(
          'Todos campos obrigatórios devem ser informados',
        )
        expect(userRepositoryMock.findUserByParam).not.toHaveBeenCalled()
        expect(
          passwordEncryptServiceMock.comparePassword,
        ).not.toHaveBeenCalled()
        expect(tokenServiceMock.generateToken).not.toHaveBeenCalled()
      },
    )

    it('should throws if not found a user', async () => {
      userRepositoryMock.findUserByParam.mockResolvedValueOnce(null)
      const input = { email: 'invalid@email.com', password: 'some_info' }
      await expect(sut.execute(input)).rejects.toThrow(
        'E-mail ou senha inválido',
      )
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledTimes(1)
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledWith(
        'email',
        input.email,
      )
      expect(passwordEncryptServiceMock.comparePassword).not.toHaveBeenCalled()
      expect(tokenServiceMock.generateToken).not.toHaveBeenCalled()
    })

    it('should throws if password informed is invalid', async () => {
      const user = new User(
        '1990-01-01',
        'valid@email.com',
        'Test User',
        'some_info',
        'uuid-123',
      )
      userRepositoryMock.findUserByParam.mockResolvedValueOnce(user)
      passwordEncryptServiceMock.comparePassword.mockResolvedValueOnce(false)
      const input = { email: 'valid@email.com', password: 'some_info' }
      await expect(sut.execute(input)).rejects.toThrow(
        'E-mail ou senha inválido',
      )
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledTimes(1)
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledWith(
        'email',
        input.email,
      )
      expect(passwordEncryptServiceMock.comparePassword).toHaveBeenCalledTimes(
        1,
      )
      expect(passwordEncryptServiceMock.comparePassword).toHaveBeenCalledWith(
        input.password,
        user.getPassword(),
      )
      expect(tokenServiceMock.generateToken).not.toHaveBeenCalled()
    })

    it('should generate a valid token if email and password are both valid', async () => {
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
      passwordEncryptServiceMock.comparePassword.mockResolvedValueOnce(true)
      const input = { email: 'valid@email.com', password: 'some_info' }
      const output = await sut.execute(input)
      expect(output).toBeDefined()
      expect(output).toHaveProperty('token')
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledTimes(1)
      expect(userRepositoryMock.findUserByParam).toHaveBeenCalledWith(
        'email',
        input.email,
      )
      expect(passwordEncryptServiceMock.comparePassword).toHaveBeenCalledTimes(
        1,
      )
      expect(passwordEncryptServiceMock.comparePassword).toHaveBeenCalledWith(
        input.password,
        user.getPassword(),
      )
      expect(tokenServiceMock.generateToken).toHaveBeenCalledTimes(1)
    })
  })
})
