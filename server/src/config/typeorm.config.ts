import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {


    useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return typeOrmConfig
    },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
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
    migrationsRun: true,
    poolSize: 1,
};
