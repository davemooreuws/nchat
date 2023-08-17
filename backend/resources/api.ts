import clerk from "@clerk/clerk-sdk-node";
import { api, faas } from "@nitric/sdk";

const corsMiddleware: faas.HttpMiddleware = async (ctx, next) => {
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = ["GET", "OPTIONS"];

  return next(ctx);
};

const authMiddleware: faas.HttpMiddleware = async (ctx, next) => {
  try {
    if (ctx.req.method === "OPTIONS") {
      return ctx;
    }

    if (!ctx.req.headers["authorization"]) {
      throw new Error("missing authorization header");
    }

    const token = (ctx.req.headers["authorization"] as string).split(
      "Bearer "
    )[1];

    await clerk.verifyToken(token);

    return next(ctx);
  } catch (e) {
    ctx.res.status = 401;
    ctx.res.body = "not authorized";

    return ctx;
  }
};

export default api("nchat", {
  middleware: [corsMiddleware, authMiddleware],
});
