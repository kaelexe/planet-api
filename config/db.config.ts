import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName: string = process.env.DB_NAME || "localdb";
const dbUser: string = process.env.DB_USER || "root";
const dbPassword: string = process.env.DB_PASSWORD || "password";
const dbHost: string = process.env.DB_HOST || "localhost";
const dbDialect =
  (process.env.DB_DIALECT as
    | "mysql"
    | "postgres"
    | "sqlite"
    | "mariadb"
    | "mssql") || "mysql";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: false,
});

export default sequelize;
