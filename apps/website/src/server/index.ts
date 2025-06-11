import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import reactRouterRequestHandler from "virtual:react-router/request-handler";

const app = new Hono();
app.use(
  "/static/*",
  serveStatic({
    root: "public/",
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`);
    },
  }),
);
app.use(
  "/client/*",
  serveStatic({
    rewriteRequestPath: (path) => path.replace(/^\/client/, ""),
    root: "./dist/client",
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`);
    },
  }),
);

app.get("/.well-known/appspecific/com.chrome.devtools.json", (ctx) => {
  return ctx.notFound();
});

app.use("*", (ctx) => {
  return reactRouterRequestHandler(ctx.req.raw);
});

serve({ ...app, port: 3000 });
console.log("Server listening on port 3000 (http://localhost:3000)");

export default app;
