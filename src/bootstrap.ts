import { globalEnvs } from '@config/envs/global'
import {
  AuthenticationUseCase,
  CreateUserUseCase,
  GetUserUseCase,
} from '@core/application/use-cases'
import {
  AuthController,
  HealthController,
  UserController,
} from '@adapter/driver/api/controllers'
import { ExpressHttpServerAdapter } from '@adapter/driver/api/express-server.adapter'
import { IHttpServer } from '@adapter/driver/api/types/http-server'
import { UserRepository } from '@adapter/driven/database/repositories'
import { PostgresConnectionAdapter } from '@adapter/driven/database/postgres-connection.adapter'
import {
  BcryptEncryptionServiceAdapter,
  JsonWebTokenServiceAdapter,
} from '@adapter/driven/cryptography'

const postgresConnectionAdapter = new PostgresConnectionAdapter()
const bcryptEncryptionServiceAdapter = new BcryptEncryptionServiceAdapter()
const jsonWebTokenServiceAdapter = new JsonWebTokenServiceAdapter(
  globalEnvs.cryptography.jwtSecret,
)
// repositories
const userRepository = new UserRepository(postgresConnectionAdapter)
// use-cases
const authenticationUseCase = new AuthenticationUseCase(
  userRepository,
  bcryptEncryptionServiceAdapter,
  jsonWebTokenServiceAdapter,
)
const createUserUseCase = new CreateUserUseCase(
  userRepository,
  bcryptEncryptionServiceAdapter,
)
const getUserUseCase = new GetUserUseCase(userRepository)
// controllers
const healthController = new HealthController()
const authController = new AuthController(authenticationUseCase)
const userController = new UserController(createUserUseCase, getUserUseCase)
const httpServer: IHttpServer = new ExpressHttpServerAdapter(
  healthController,
  authController,
  userController,
)
httpServer.run(globalEnvs.api.serverPort)
