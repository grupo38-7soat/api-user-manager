import { IUserRepository } from '@core/domain/repositories'
import { IPasswordEncryptService } from '@core/application/cryptography'
import { CreateUserUseCase } from '@core/application/use-cases'

describe('CreateUserUseCase', () => {
  let userRepositoryMock: jest.Mocked<IUserRepository>
  let passwordEncryptServiceMock: jest.Mocked<IPasswordEncryptService>
  let sut: CreateUserUseCase

  beforeAll(() => {
    userRepositoryMock = { saveUser: jest.fn(), findUserByParam: jest.fn() }
    passwordEncryptServiceMock = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    }
    sut = new CreateUserUseCase(userRepositoryMock, passwordEncryptServiceMock)
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
      {
        birthdate: '',
        name: 'some_info',
        email: 'some_info@email.com',
        password: 'some_info',
      },
      {
        birthdate: '1990-01-01',
        name: '',
        email: 'some_info@email.com',
        password: 'some_info',
      },
      {
        birthdate: '1990-01-01',
        name: 'some_info',
        email: '',
        password: 'some_info',
      },
      {
        birthdate: '1990-01-01',
        name: 'some_info',
        email: 'some_info@email.com',
        password: '',
      },
    ])(
      'should throws if any required field is empty',
      async ({ birthdate, name, email, password }) => {
        await expect(
          sut.execute({ birthdate, name, email, password }),
        ).rejects.toThrow('Todos campos obrigatórios devem ser informados')
        expect(
          passwordEncryptServiceMock.comparePassword,
        ).not.toHaveBeenCalled()
        expect(userRepositoryMock.findUserByParam).not.toHaveBeenCalled()
      },
    )

    it('should create a user and return a valid data', async () => {
      passwordEncryptServiceMock.hashPassword.mockResolvedValueOnce(
        'some_encrypted_info',
      )
      userRepositoryMock.saveUser.mockResolvedValueOnce({
        id: 'some_info',
        createdAt: new Date(),
      })
      const input = {
        birthdate: '1990-01-01',
        name: 'some_info',
        email: 'some_info@email.com',
        password: 'some_info',
      }
      const output = await sut.execute(input)
      expect(output).toBeDefined()
      expect(output).toHaveProperty('id')
      expect(output).toHaveProperty('createdAt')
      expect(passwordEncryptServiceMock.hashPassword).toHaveBeenCalledTimes(1)
      expect(passwordEncryptServiceMock.hashPassword).toHaveBeenCalledWith(
        input.password,
      )
      expect(userRepositoryMock.saveUser).toHaveBeenCalledTimes(1)
    })
  })
})
