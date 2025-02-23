import dotenv from 'dotenv'

dotenv.config({
  path: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
})

const apiEnvs = {
  serverPort: Number(process.env.SERVER_PORT) || 8082,
  stage: process.env.NODE_ENV,
}

const databaseEnvs = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}

const cryptographyEnvs = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
}

export const globalEnvs = {
  api: {
    ...apiEnvs,
  },
  database: {
    ...databaseEnvs,
  },
  cryptography: {
    ...cryptographyEnvs,
  },
}
