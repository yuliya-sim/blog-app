import { DataSourceOptions, DataSource } from 'typeorm';
require('dotenv').config();

const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['**/*.entity{.ts,.js}'],
    migrationsTableName: 'migration',
    migrations: ['src/migration/*.ts'],
    synchronize: false,
};
const AppDataSource = new DataSource(options);

