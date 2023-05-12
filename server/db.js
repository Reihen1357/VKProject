import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.REACT_APP_DB_NAME,
  process.env.REACT_APP_DB_USER,
  process.env.REACT_APP_DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);
