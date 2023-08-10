import api from "./resources/api";
import { messagesdb } from "./resources/db";
import signal from "./resources/signal";

api.get("/ws-address", async (ctx) => {
  try {
    const url = await signal.url();

    ctx.res.body = url;
    ctx.res.headers["Content-Type"] = ["text/plain"];

    return ctx;
  } catch (e) {
    console.log("Error retrieving websocket url", e);

    ctx.res.status = 500;
    ctx.res.body = "Error retrieving messages";

    return ctx;
  }
});

api.get("/messages", async (ctx) => {
  try {
    const messages = await messagesdb.query().limit(100).fetch();

    const sortedMessages = messages.documents
      .sort((a, b) => {
        if (a.content.createdAt > b.content.createdAt) {
          return 1;
        }

        return -1;
      })
      .map((doc) => ({ id: doc.id, ...doc.content }));

    return ctx.res.json(sortedMessages);
  } catch (e) {
    console.log("Error retrieving messages", e);

    ctx.res.status = 500;
    ctx.res.json({ message: "Error retrieving messages" });

    return ctx;
  }
});
