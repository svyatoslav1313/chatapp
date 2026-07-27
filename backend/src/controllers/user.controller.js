import { ApiError } from "../exceptions/api.error.js";
import { userService } from "../services/user.service.js";
import { validateEmail, validatePassword } from "../utils/validation.js";
import bcrypt from "bcrypt";

const changeName = async (req, res) => {
  const { newName } = req.body;

  const userId = req.user.id;
  const user = await userService.findById(userId);

  if (!user) {
    throw ApiError.badRequest("No such user");
  }

  if (!newName) {
    throw ApiError.badRequest("The name cannot be empty");
  }

  if (user.name === newName) {
    throw ApiError.badRequest("You can't change the name to the same one");
  }

  const updatedUser = await userService.changeName(userId, newName);

  res.send(userService.normalize(updatedUser));
};

const changeNickname = async (req, res) => {
  const { newNickname } = req.body;

  const userId = req.user.id;
  const user = await userService.findById(userId);

  if (!user) {
    throw ApiError.badRequest("No such user");
  }

  if (!newNickname) {
    throw ApiError.badRequest("The nickname cannot be empty");
  }

  if (user.nickname === newNickname) {
    throw ApiError.badRequest("You can't change the nickname to the same one");
  }

  const updatedUser = await userService.changeNickname(userId, newNickname);

  res.send(userService.normalize(updatedUser));
};

const changeEmail = async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail) {
    throw ApiError.badRequest("Please enter your email address");
  }

  if (!password) {
    throw ApiError.badRequest("Please enter your password");
  }

  const userId = req.user.id;

  const user = await userService.findById(userId);

  if (!user) {
    throw ApiError.badRequest("No such user");
  }

  const checkEmail = await userService.findByEmail(newEmail);

  if (checkEmail) {
    throw ApiError.badRequest("An account with this email already exists");
  }

  const errors = {
    email: validateEmail(newEmail),
  };

  if (errors.email) {
    throw ApiError.badRequest(errors.email, errors);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest("Incorrect password. Try again.");
  }

  const updatedUser = await userService.changeEmail(userId, newEmail);

  res.send(userService.normalize(updatedUser));
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    throw ApiError.badRequest("Please enter your current password");
  }

  if (!newPassword) {
    throw ApiError.badRequest("Please enter your new password");
  }

  const userId = req.user.id;
  const user = await userService.findById(userId);

  if (!user) {
    throw ApiError.badRequest("No such user");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest("Incorrect password. Try again.");
  }

  const isNewPasswordValid = await bcrypt.compare(newPassword, user.password);

  if (isNewPasswordValid) {
    throw ApiError.badRequest(
      "New password must be different from your current password",
    );
  }

  const errors = {
    password: validatePassword(newPassword),
  };

  if (errors.password) {
    throw ApiError(errors.password, errors);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 5);

  await userService.changePassword(userId, hashedPassword);

  res.sendStatus(200);
};

export const userController = {
  changeName,
  changeNickname,
  changeEmail,
  changePassword,
};
