import express, { Express, Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from './config/swagger/swagger.json'
import { IHttpServer } from './types/http-server'
import {
  IUserController,
  IHealthController,
  IAuthController,
} from './controllers/types/controllers'
import { userRoutes, healthRoutes, authenticationRoutes } from './routes'

export class ExpressHttpServerAdapter implements IHttpServer {
  app: Express
  router: Router

  constructor(
    private readonly healthController: IHealthController,
    private readonly authController: IAuthController,
    private readonly userController: IUserController,
  ) {
    this.app = express()
    this.app.use(express.json())
    this.router = express.Router()
    this.configRoutes()
    this.configDocumentation()
  }

  private configRoutes(): void {
    this.configHealthRoutes()
    this.configAuthRoutes()
    this.configUserRoutes()
    this.app.use(this.router)
  }

  private configHealthRoutes(): void {
    healthRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.healthController[route.handler].bind(this.healthController),
      )
    })
  }

  private configAuthRoutes(): void {
    authenticationRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.authController[route.handler].bind(this.authController),
      )
    })
  }

  private configUserRoutes(): void {
    userRoutes.forEach(route => {
      console.log(
        `[HttpServer] Rota ${route.method.toUpperCase()} ${route.resource}`,
      )
      this.router[route.method](
        route.resource,
        route.middleware,
        this.userController[route.handler].bind(this.userController),
      )
    })
  }

  private configDocumentation(): void {
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  }

  run(port: number): void {
    this.app.listen(port, () => {
      console.log(`[HttpServer] Servidor rodando na porta ${port}`)
    })
  }
}
