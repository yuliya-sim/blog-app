export default {
  host: process.env.POSTGRES_HOST,
  type: 'postgres',
  port: process.env.PG_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/entities/*.entity.ts'],
  synchronize: process.env.DB_SYNCRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  migrationsDir: [process.env.DB_MIGRATIONS_DIR],
};
