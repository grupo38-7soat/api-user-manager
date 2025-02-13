import { DomainException, ExceptionCause } from '../base'

export class Birthdate {
  private birthdate: Date

  constructor() {}

  getBirthdate(): Date {
    return this.birthdate
  }

  validateBirthdate(value: string): void {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    if (!dateRegex.test(value)) {
      throw new DomainException(
        'Data de nascimento inválida',
        ExceptionCause.INVALID_DATA,
      )
    }
    const [year, month, day] = value.split('-').map(Number)
    const birthdate = new Date(year, month - 1, day)
    if (
      birthdate.getFullYear() !== year ||
      birthdate.getMonth() !== month - 1 ||
      birthdate.getDate() !== day
    ) {
      throw new DomainException(
        'Data de nascimento inválida',
        ExceptionCause.INVALID_DATA,
      )
    }
    const currentYear = new Date().getFullYear()
    if (Math.abs(currentYear - year) < 18) {
      throw new DomainException(
        'Menores de idade não podem se cadastrar',
        ExceptionCause.INVALID_DATA,
      )
    }
    this.birthdate = birthdate
  }
}
