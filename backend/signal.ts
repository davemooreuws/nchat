import signal from "./resources/signal";
import { Connection, Message, connectionsdb, messagesdb } from "./resources/db";
import clerk from "@clerk/clerk-sdk-node";
import type { faas } from "@nitric/sdk";
import { generate } from "short-uuid";

const authMiddleware: faas.WebsocketMiddleware = async (ctx, next) => {
  const { access_token } = ctx.req.query;

  try {
    if (!access_token) {
      throw new Error("no access_token query param");
    }

    await clerk.verifyToken(access_token![0]);

    return next(ctx);
  } catch (e) {
    console.log(`error verifiying user, closing socket connection`, e);
    try {
      await signal.close(ctx.req.connectionId);
    } catch (e) {
      console.log("error closing connection", e);
    }
  }
};

export const broadcast = async (data: Message | Message[]) => {
  // send to all connections
  const connectionStream = connectionsdb.query().stream();

  for await (const chunk of connectionStream) {
    // @ts-ignore
    const content = chunk.content as Connection;
    try {
      // Send message to a connection
      console.log(`sending message to ${content.connectionId}`);
      await signal.send(content.connectionId, data);
      console.log(`successfull sent ${content.connectionId}`);
    } catch (e: any) {
      if (e.message.startsWith("13 INTERNAL: could not get connection")) {
        console.log(
          `could not find connection ${content.connectionId}, removing...`
        );
        await connectionsdb.doc(content.connectionId).delete();
      }

      console.log(`error sending message to ${content.connectionId}`, e);
    }
  }
};

signal.on("connect", authMiddleware, async (ctx) => {
  console.log(`connecting ${ctx.req.connectionId}`);
  try {
    await connectionsdb.doc(ctx.req.connectionId).set({
      // store any metadata related to the connection here
      connectionId: ctx.req.connectionId,
    });
  } catch (e) {
    console.log(e);
  }

  return ctx;
});

signal.on("disconnect", async (ctx) => {
  console.log(`disconnecting ${ctx.req.connectionId}`);
  try {
    await connectionsdb.doc(ctx.req.connectionId).delete();
  } catch (e) {
    console.log(e);
  }
});

signal.on("message", async (ctx) => {
  try {
    const data = ctx.req.json() as Message;

    const message = {
      ...data,
      createdAt: new Date().getTime(),
    };

    // save to db
    const id = generate();
    await messagesdb.doc(id).set(message);

    await broadcast(message);

    return ctx;
  } catch (e) {
    console.log("error in message callback", e);
  }
});
