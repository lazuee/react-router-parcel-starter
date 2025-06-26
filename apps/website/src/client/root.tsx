import "./styles/global.css";

import { Outlet } from "react-router";

import { Layout as ErrorLayout } from "./components/layout/error";
import { Layout as RootLayout } from "./components/layout/root";

export function ServerComponent() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}

export function ErrorBoundary() {
  return <ErrorLayout />;
}
