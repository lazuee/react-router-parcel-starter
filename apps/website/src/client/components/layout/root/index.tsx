import React from "react";
import { Links, Meta, ScrollRestoration } from "react-router";
import { LoadingNavigation } from "./loading-navigation";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LoadingNavigation />
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
};
