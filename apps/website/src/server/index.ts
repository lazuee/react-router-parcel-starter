import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import reactRouterRequestHandler from "virtual:react-router/request-handler";

const app = new Hono();
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

app.get("/.well-known/appspecific/com.chrome.devtools.json", (ctx) => {
  return ctx.notFound();
});

app.use("*", (ctx) => {
  return reactRouterRequestHandler(ctx.req.raw);
});

serve({ ...app, port: 3000 });
console.log("Server listening on port 3000 (http://localhost:3000)");

export default app;
