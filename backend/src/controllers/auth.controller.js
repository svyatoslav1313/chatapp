import bcrypt from "bcrypt";
import { userService } from "../services/user.service.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import { ApiError } from "../exceptions/api.error.js";
import { jwtService } from "../services/jwt.service.js";
import { tokenService } from "../services/token.service.js";

const registration = async (req, res) => {
  const { name, nickname, email, password } = req.body;

  const errors = {
    name: !name ? "Name is required" : null,
    nickname: !nickname ? "Nickname is required" : null,
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.name || errors.email || errors.password) {
    throw ApiError.badRequest("Bad request", errors);
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  await userService.registration(name, nickname, email, hashedPassword);

  res.send({ message: "Your account has been created successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest("Invalid email or password");
  }

  await generateTokens(res, user);
};

const generateTokens = async (res, user) => {
  const normalizedUser = userService.normalize(user);

  const accessToken = jwtService.signAccessToken(normalizedUser);
  const refreshToken = jwtService.signRefreshToken(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userData = jwtService.verifyRefreshToken(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized();
  }

  const user = await userService.findById(userData.id);

  await generateTokens(res, user);
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = await jwtService.verifyRefreshToken(refreshToken);

  if (!user || !refreshToken) {
    throw ApiError.unauthorized();
  }

  await tokenService.remove(user.id);

  res.sendStatus(204);
};

export const authController = {
  registration,
  login,
  refresh,
  logout,
};
