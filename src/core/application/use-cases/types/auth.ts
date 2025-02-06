export type AuthenticationInput = {}

export type AuthenticationOutput = {}

export interface IAuthenticationUseCase {
  execute(input: AuthenticationInput): Promise<AuthenticationOutput>
}
