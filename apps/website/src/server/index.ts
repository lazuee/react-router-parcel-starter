import { versions } from "node:process";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";

import reactRouterRequestHandler from "virtual:react-router/request-handler";
import * as env from "@/env.server";

const app = new Hono();
if (!env.IS_VERCEL) {
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

declare module "react-router" {
  export interface AppLoadContext {
    readonly env: typeof env;
    readonly isBun: boolean;
  }
}

app.use("*", (ctx) => {
  return reactRouterRequestHandler({
    isBun: !!versions.bun,
    env: structuredClone(env),
  })(ctx.req.raw);
});

const createServer = () => {
  if (!env.IS_VERCEL) {
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
