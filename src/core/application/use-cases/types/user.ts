export type CreateUserInput = {
  birthdate: string
  email: string
  name: string
  password: string
}

export type CreateUserOutput = {
  id: string
  createdAt: string
}

export interface ICreateUserUseCase {
  execute(input: CreateUserInput): Promise<CreateUserOutput>
}

export type GetUserInput = {
  id: string
}

export type GetUserOutput = {
  id: string
  birthdate: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface IGetUserUseCase {
  execute(input: GetUserInput): Promise<GetUserOutput>
}
