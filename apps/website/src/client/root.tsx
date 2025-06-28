import "./styles/global.css";

import { type PropsWithChildren } from "react";

import { Outlet } from "react-router";
import { type Route } from "./+types/root";
import { Layout as ErrorLayout } from "./components/layout/error";
import { Layout as RootLayout } from "./components/layout/root";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <RootLayout>{children}</RootLayout>;
};

export const ServerComponent: React.FC<Route.ComponentProps> = () => {
  return <Outlet />;
};

export const ErrorBoundary: React.FC<Route.ErrorBoundaryProps> = () => {
  return <ErrorLayout />;
};
