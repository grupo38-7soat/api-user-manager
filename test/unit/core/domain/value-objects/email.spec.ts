import { DomainException } from '@core/domain/base'
import { Email } from '@core/domain/value-objects'

describe('Email', () => {
  let emailInstance: Email

  beforeEach(() => {
    emailInstance = new Email()
  })

  it('should set a valid email', () => {
    const validEmail = 'test@example.com'
    emailInstance.validateEmail(validEmail)
    expect(emailInstance.getEmail()).toEqual(validEmail)
  })

  it('should throw an exception for an invalid email format', () => {
    expect(() => emailInstance.validateEmail('invalid-email')).toThrow(
      DomainException,
    )
    expect(() => emailInstance.validateEmail('test@.com')).toThrow(
      DomainException,
    )
    expect(() => emailInstance.validateEmail('@example.com')).toThrow(
      DomainException,
    )
    expect(() => emailInstance.validateEmail('test@example')).toThrow(
      DomainException,
    )
  })
})
