"use client";

import { isRouteErrorResponse, useRouteError } from "react-router";

export function parsedError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return { error, isRouteError: true };
  } else if (error instanceof Error) {
    return { error, isError: true };
  } else {
    return { error: error as Error, isUnknown: true };
  }
}
