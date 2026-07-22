import jwt from "jsonwebtoken";

const signAccessToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_KEY, {
    expiresIn: "900s",
  });

  return token;
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return null;
  }
};

const signRefreshToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });

  return token;
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  } catch (error) {
    return null;
  }
};

export const jwtService = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
