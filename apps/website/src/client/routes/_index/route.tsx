import * as env from "@/env.server";
import { type Route } from "./+types/route";

import { Page } from "./page";

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  return {
    name: name || "Unknown",
    env: structuredClone(env),
  };
};

export const ServerComponent: React.FC<Route.ComponentProps> = (props) => {
  return <Page {...props} />;
};
