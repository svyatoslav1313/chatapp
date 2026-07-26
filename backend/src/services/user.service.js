import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User.js";

const normalize = ({ id, name, nickname, email }) => {
  return {
    id,
    name,
    nickname,
    email,
  };
};

const findById = (userId) => {
  return User.findOne({ where: { id: userId } });
};

const findByEmail = (email) => {
  return User.findOne({ where: { email: email } });
};

const registration = async (name, nickname, email, password) => {
  const activationToken = uuidv4();

  await User.create({ name, nickname, email, password, activationToken });
};

export const userService = {
  normalize,
  findById,
  findByEmail,
  registration,
};
