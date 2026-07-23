import { Sequelize } from "sequelize";

const isLocal =
  process.env.DB_HOST === "localhost" || process.env.DB_HOST === "127.0.0.1";

export const client = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: "postgres",
  logging: false,
  // Если локально — SSL не нужен, если на Render/Neon — включаем SSL
  dialectOptions: isLocal
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
});
