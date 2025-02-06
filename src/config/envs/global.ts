import dotenv from 'dotenv'

dotenv.config({
  path: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
})

const apiEnvs = {
  serverPort: Number(process.env.SERVER_PORT) || 8080,
  stage: process.env.NODE_ENV,
}

const databaseEnvs = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}

export const globalEnvs = {
  api: {
    ...apiEnvs,
  },
  database: {
    ...databaseEnvs,
  }
}
