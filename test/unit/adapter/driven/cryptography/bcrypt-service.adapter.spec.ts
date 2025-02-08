import { hash, compare } from 'bcrypt'
import { BcryptEncryptionServiceAdapter } from '@adapter/driven/cryptography'

jest.mock('bcrypt', () => ({
  hash: jest.fn(async password => `hashed-${password}`),
  compare: jest.fn(
    async (password, hashedPassword) =>
      password === hashedPassword.replace('hashed-', ''),
  ),
}))

describe('BcryptEncryptionServiceAdapter', () => {
  let sut: BcryptEncryptionServiceAdapter

  beforeEach(() => {
    sut = new BcryptEncryptionServiceAdapter()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const password = 'mySecretPassword'
      const hashedPassword = await sut.hashPassword(password)
      expect(hashedPassword).toBe(`hashed-${password}`)
      expect(hash).toHaveBeenCalledWith(password, 10)
    })
  })

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      const password = 'mySecretPassword'
      const hashedPassword = `hashed-${password}`
      const isMatch = await sut.comparePassword(password, hashedPassword)
      expect(isMatch).toBe(true)
      expect(compare).toHaveBeenCalledWith(password, hashedPassword)
    })

    it('should return false if passwords do not match', async () => {
      const password = 'wrongPassword'
      const hashedPassword = 'hashed-mySecretPassword'
      const isMatch = await sut.comparePassword(password, hashedPassword)
      expect(isMatch).toBe(false)
      expect(compare).toHaveBeenCalledWith(password, hashedPassword)
    })
  })
})
