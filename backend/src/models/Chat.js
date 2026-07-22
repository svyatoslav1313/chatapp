import { DataTypes } from "sequelize";
import { client } from "../utils/db.js";
import { User } from "./User.js";
import { Message } from "./Message.js";

export const Chat = client.define("chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM("direct", "room"),
    allowNull: false,
    defaultValue: "direct",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
