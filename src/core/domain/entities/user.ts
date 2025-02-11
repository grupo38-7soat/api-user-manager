import { randomUUID } from 'crypto'
import { DomainException, ExceptionCause } from '../base'
import { Birthdate, Email } from '../value-objects'

export type SerializedUser = {
  id: string
  birthdate: Date
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export class User {
  private id: string
  private birthdate: Birthdate
  private name: string
  private email: Email
  private password: string
  private createdAt: Date
  private updatedAt: Date

  constructor(
    birthdate: string,
    email: string,
    name: string,
    password: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.setId(id)
    this.setBirthdate(birthdate)
    this.setPassword(password)
    this.setName(name)
    this.setEmail(email)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
  }

  private setId(id: string): void {
    this.id = id ?? randomUUID()
  }

  public getId(): string {
    return this.id
  }

  private setBirthdate(value: string): void {
    const birthdate = new Birthdate()
    birthdate.validateBirthdate(value)
    this.birthdate = birthdate
  }

  public getBirthdate(): Date {
    return this.birthdate.getBirthdate()
  }

  private setEmail(value: string): void {
    const email = new Email()
    email.validateEmail(value)
    this.email = email
  }

  public getEmail(): string {
    return this.email.getEmail()
  }

  private setName(value: string): void {
    const min = 5
    if (value.length < min) {
      throw new DomainException(
        `O nome deve ter no mínimo ${min} caracteres`,
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.name = value
  }

  public getName(): string {
    return this.name
  }

  private setPassword(password: string): void {
    this.password = password
  }

  public getPassword(): string {
    return this.password
  }

  private setCreatedAt(value: Date): void {
    if (value) {
      this.createdAt = value
    }
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  private setUpdatedAt(value: Date): void {
    if (value) {
      this.updatedAt = value
    }
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public toJson(): SerializedUser {
    return {
      id: this.id,
      birthdate: this.birthdate.getBirthdate(),
      name: this.name,
      email: this.email.getEmail(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
