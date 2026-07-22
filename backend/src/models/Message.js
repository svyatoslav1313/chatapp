import { DataTypes } from "sequelize";
import { client } from "../utils/db.js";
import { Chat } from "./Chat.js";
import { User } from "./User.js";

export const Message = client.define(
  "message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["chatId"] }],
  },
);
