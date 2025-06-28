"use client";

import React from "react";
import { Link } from "react-router";
import { parsedError } from "./report";

export const Layout: React.FC = () => {
  const parsed = parsedError();

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string[] | undefined;

  if (parsed.isRouteError) {
    const { status, statusText } = parsed.error;
    message = status === 404 ? "404" : "Error";
    details =
      status === 404
        ? "The requested page could not be found."
        : statusText || details;
  } else if (parsed.isError && parsed.error instanceof Error) {
    details = parsed.error.message;
    stack = parsed.error.stack?.split("\n").map((x) => x.trimStart());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="flex flex-col items-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500">{message}</h1>
          <p className="mb-4 mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">
            {details}
          </p>
        </div>
        {stack && (
          <div className="mb-6 w-full max-w-2xl rounded-xl border border-zinc-300 bg-zinc-50 p-6 text-sm font-mono leading-relaxed shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 overflow-x-auto">
            <p className="mb-4 text-red-500 font-semibold whitespace-normal">
              {stack[0]}
            </p>
            <div className="min-w-full space-y-1">
              {stack.slice(1).map((line, i) => {
                const a = line.startsWith("at ");
                const b = a ? line.slice(3) : line;

                return (
                  <p key={i} className="whitespace-nowrap">
                    {a && (
                      <span className="text-gray-400 dark:text-zinc-500">
                        at
                      </span>
                    )}{" "}
                    {b.length > 100 ? `${b.slice(0, 50)}...${b.slice(-30)}` : b}
                  </p>
                );
              })}
            </div>
          </div>
        )}
        <Link
          to="/"
          replace
          className="mt-4 flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-300 px-4 text-sm text-zinc-700 hover:underline dark:border-zinc-700 dark:text-zinc-300"
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
};
