import 'dotenv/config';
import { DataSource } from 'typeorm';

const host = process.env.MONGO_DB_HOST;
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const database = process.env.MONGO_DB_DATABASE;

const mongoDataSource = new DataSource({
  name: 'mongo-run-and-drive',
  type: 'mongodb',
  url: `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  entities: [],
  synchronize: false,
});

export default mongoDataSource;
