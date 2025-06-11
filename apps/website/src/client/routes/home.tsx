import { pull } from "@ryanflorence/async-provider";

import { stringContext } from "../context";
import { type Route } from "./+types/home";

import { sayHello } from "./home.actions";
import { PendingButton } from "./home.client";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  return {
    message: pull(stringContext),
    name: name || "Unknown",
  };
}

export function ServerComponent({ loaderData }: Route.ComponentProps) {
  return (
    <main className="container my-8 px-8 mx-auto">
      <article className="paper prose max-w-none">
        <h1>Home</h1>
        <p>This is the home page.</p>
        <h2>loaderData</h2>
        <pre>
          <code>{JSON.stringify(loaderData)}</code>
        </pre>
        <h2>Server Action</h2>
        <form
          className="no-prose grid gap-6"
          action={sayHello.bind(null, loaderData.name)}
        >
          <div className="grid gap-1">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              className="input"
              id="name"
              type="text"
              name="name"
              placeholder={loaderData.name}
            />
          </div>
          <div>
            <PendingButton />
          </div>
        </form>
      </article>
    </main>
  );
}
