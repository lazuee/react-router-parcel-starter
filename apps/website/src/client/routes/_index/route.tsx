import { type Route } from "./+types/route";
import { Page } from "./page";

export const loader = ({ request, context }: Route.LoaderArgs) => {
  const { env, isBun } = context;
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  return {
    name: name || "Unknown",
    isBun,
    env,
  };
};

export const ServerComponent: React.FC<Route.ComponentProps> = (props) => {
  return <Page {...props} />;
};
