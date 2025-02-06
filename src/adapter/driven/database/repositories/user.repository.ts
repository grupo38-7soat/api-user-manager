import { User } from '@core/domain/entities'
import { IUserRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { formatDateWithoutTime } from '@core/application/helpers'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

type UserData = {
  id: string
  birthdate: Date
  email: string
  name: string
  password: string
  created_at: Date
  updated_at: Date
}

export class UserRepository implements IUserRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'public.user'
  }

  async saveUser(user: User): Promise<{ id: string; createdAt: Date }> {
    try {
      const currentDate = new Date()
      const [query, params] = [
        `
          INSERT INTO ${this.table} (id, birthdate, email, name, password, created_at, updated_at)
          VALUES ($1::uuid, $2::date, $3::text, $4::text, $5::text, $6::timestamp, $7::timestamp)
          RETURNING id
        `,
        [
          user.getId(),
          user.getBirthdate(),
          user.getEmail(),
          user.getName(),
          user.getPassword(),
          currentDate,
          currentDate,
        ],
      ]
      const result = await this.postgresConnectionAdapter.query<{ id: string }>(
        query,
        params,
      )
      return { id: result.rows[0]?.id, createdAt: currentDate }
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao salvar usuário',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findUserByParam(param: string, value: unknown): Promise<User> {
    try {
      const { rows } = await this.postgresConnectionAdapter.query<UserData>(
        `SELECT * FROM ${this.table} WHERE ${param} = $1 LIMIT 1`,
        [value],
      )
      if (!rows || !rows.length) return null
      return new User(
        formatDateWithoutTime(rows[0].birthdate),
        rows[0].email,
        rows[0].name,
        rows[0].password,
        rows[0].id,
        rows[0].created_at,
        rows[0].created_at,
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao consultar usuário',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }
}
