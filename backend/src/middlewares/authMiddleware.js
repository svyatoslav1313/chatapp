import { ApiError } from "../exceptions/api.error.js";
import { jwtService } from "../services/jwt.service.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers["authorization"] || "";

  const [, token] = authorization.split(" ");

  if (!authorization || !token) {
    throw ApiError.unauthorized();

    return;
  }

  const userData = jwtService.verifyAccessToken(token);

  if (!userData) {
    throw ApiError.unauthorized();

    return;
  }

  req.user = userData;

  next();
};
