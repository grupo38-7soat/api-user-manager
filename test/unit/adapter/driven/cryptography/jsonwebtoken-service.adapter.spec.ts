import { sign, verify } from 'jsonwebtoken'
import { JsonWebTokenServiceAdapter } from '@adapter/driven/cryptography'

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(
    (_payload, _secretKey, options) => `mockedToken.${options.expiresIn}`,
  ),
  verify: jest.fn(token => {
    if (token.startsWith('validToken')) {
      return { userId: '123' }
    }
    throw new Error('Invalid token')
  }),
}))

describe('JsonWebTokenServiceAdapter', () => {
  let sut: JsonWebTokenServiceAdapter
  const secretKey = 'testSecretKey'

  beforeEach(() => {
    sut = new JsonWebTokenServiceAdapter(secretKey)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateToken', () => {
    it('should generate a JWT token with default expiration', () => {
      const payload = { userId: '123' }
      const token = sut.generateToken(payload)
      expect(token).toBe('mockedToken.1h')
      expect(sign).toHaveBeenCalledWith(payload, secretKey, { expiresIn: '1h' })
    })

    it('should generate a JWT token with custom expiration', () => {
      const payload = { userId: '123' }
      const token = sut.generateToken(payload, '2h')
      expect(token).toBe('mockedToken.2h')
      expect(sign).toHaveBeenCalledWith(payload, secretKey, { expiresIn: '2h' })
    })
  })

  describe('verifyToken', () => {
    it('should return decoded payload when token is valid', () => {
      const token = 'validToken.1h'
      const result = sut.verifyToken(token)
      expect(result).toEqual({ userId: '123' })
      expect(verify).toHaveBeenCalledWith(token, secretKey)
    })

    it('should return null when token is invalid', () => {
      const token = 'invalidToken.1h'
      const result = sut.verifyToken(token)
      expect(result).toBeNull()
      expect(verify).toHaveBeenCalledWith(token, secretKey)
    })
  })
})
