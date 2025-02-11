import { DomainException } from '@core/domain/base'
import { Birthdate } from '@core/domain/value-objects'

describe('Birthdate', () => {
  let birthdateInstance: Birthdate

  beforeEach(() => {
    birthdateInstance = new Birthdate()
  })

  it('should set a valid birthdate', () => {
    const validDate = '2000-05-20'
    birthdateInstance.validateBirthdate(validDate)
    expect(birthdateInstance.getBirthdate()).toEqual(new Date(2000, 4, 20))
  })

  it('should throw an exception for an invalid date format', () => {
    expect(() => birthdateInstance.validateBirthdate('20-05-2000')).toThrow(
      DomainException,
    )
    expect(() => birthdateInstance.validateBirthdate('2000/05/20')).toThrow(
      DomainException,
    )
    expect(() => birthdateInstance.validateBirthdate('invalid-date')).toThrow(
      DomainException,
    )
  })

  it('should throw an exception for a non-existent date', () => {
    expect(() => birthdateInstance.validateBirthdate('2023-02-30')).toThrow(
      DomainException,
    )
  })

  it('should throw an exception if the user is under 18', () => {
    const currentYear = new Date().getFullYear()
    const underageDate = `${currentYear - 17}-06-15`
    expect(() => birthdateInstance.validateBirthdate(underageDate)).toThrow(
      DomainException,
    )
  })
})
