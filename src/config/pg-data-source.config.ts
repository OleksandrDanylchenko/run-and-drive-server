import { resolve } from 'path';

import 'dotenv/config';
import { DataSource } from 'typeorm';

import { isProduction, rootCodeFolder } from '@utils/env-parser.helper';

const pgDataSource = new DataSource({
  ssl: isProduction,
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : null,
  },
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  port: parseInt(process.env.PG_DB_PORT, 10),
  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_DATABASE,
  entities: [resolve(rootCodeFolder, '**/*.entity.{ts,js}')],
  migrations: [resolve(rootCodeFolder, 'database/pg/migrations/*.{ts,js}')],
  synchronize: false,
});

export default pgDataSource;
