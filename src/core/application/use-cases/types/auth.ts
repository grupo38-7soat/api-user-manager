export type AuthenticationInput = {
  email: string
  password: string
}

export type AuthenticationOutput = {
  token: string
}

export interface IAuthenticationUseCase {
  execute(input: AuthenticationInput): Promise<AuthenticationOutput>
}
