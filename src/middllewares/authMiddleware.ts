import { decode, verify } from "jsonwebtoken";
import { Context, Next } from "koa";
import { authConfig } from "../config/authConfig";

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
};

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authorizationHeader = ctx.header.authorization;

  if (!authorizationHeader) {
    ctx.user = {
      id: null,
    };

    return await next();
  }

  const [, token] = authorizationHeader.split(" ");

  try {
    const { secret } = authConfig.jwt;

    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    ctx.user = {
      id: sub,
    };

    return await next();
  } catch {
    ctx.user = {
      id: null,
    };

    return await next();
  }
};
