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

const findByNickname = (nickname) => {
  return User.findOne({ where: { nickname } });
};

const registration = async (name, nickname, email, password) => {
  const activationToken = uuidv4();

  await User.create({ name, nickname, email, password, activationToken });
};

const changeName = async (userId, newName) => {
  const [_, updatedUser] = await User.update(
    { name: newName },
    { where: { id: userId }, returning: true, plain: true },
  );

  return updatedUser;
};

const changeNickname = async (userId, newNickname) => {
  const [_, updatedUser] = await User.update(
    { nickname: newNickname },
    { where: { id: userId }, returning: true, plain: true },
  );

  return updatedUser;
};

const changeEmail = async (userId, newEmail) => {
  const [_, updatedUser] = await User.update(
    { email: newEmail },
    { where: { id: userId }, returning: true, plain: true },
  );

  return updatedUser;
};

const changePassword = async (userId, newPassword) => {
  await User.update({ password: newPassword }, { where: { id: userId } });
};

export const userService = {
  normalize,
  findById,
  findByEmail,
  findByNickname,
  registration,
  changeName,
  changeNickname,
  changeEmail,
  changePassword,
};
