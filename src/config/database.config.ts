import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_PORT ?? '5432', 10),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
}));
