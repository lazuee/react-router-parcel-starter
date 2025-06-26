import { env } from "node:process";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";

import reactRouterRequestHandler from "virtual:react-router/request-handler";

const isVercel = env.VERCEL === "1";
const app = new Hono();
if (!isVercel) {
  app.use(
    "/*",
    serveStatic({
      root: "public/",
    }),
  );
  app.use(
    "/client/*",
    serveStatic({
      rewriteRequestPath: (path) => path.replace(/^\/client/, ""),
      root: "./dist/client",
    }),
  );
}

app.get("/.well-known/appspecific/com.chrome.devtools.json", (ctx) => {
  return ctx.notFound();
});

app.use("*", (ctx) => {
  return reactRouterRequestHandler(ctx.req.raw);
});

const createServer = () => {
  if (!isVercel) {
    serve({ ...app, port: 3000 });
    console.log("Server listening on port 3000 (http://localhost:3000)");
  } else {
    const handler: ReturnType<typeof handle> = (req, res) => {
      return handle(app)(req, res);
    };
    return handler;
  }
};

export default createServer();
