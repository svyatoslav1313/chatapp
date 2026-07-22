import { Token } from "../models/Token.js";

const save = async (userId, newToken) => {
  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    await Token.create({ userId, refreshToken: newToken });

    return;
  }

  token.refreshToken = newToken;

  await token.save();
};

const getByToken = (refreshToken) => {
  return Token.findOne({ where: { refreshToken } });
};

const remove = (userId) => {
  return Token.update({ refreshToken: null }, { where: { userId } });
};

export const tokenService = {
  save,
  getByToken,
  remove,
};
