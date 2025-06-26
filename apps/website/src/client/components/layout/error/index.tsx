"use client";

import React from "react";
import { Link } from "react-router";
import { parsedError } from "./report";

export const Layout: React.FC = () => {
  const parsed = parsedError();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="flex flex-col items-center px-4 text-center">
        {parsed.isRouteError ? (
          <>
            <h1 className="text-6xl font-bold text-red-500">
              {parsed.error.status}
            </h1>
            <p className="mb-4 mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">
              {parsed.error.data || parsed.error.statusText}
            </p>
          </>
        ) : parsed.isError ? (
          <>
            <h1 className="text-6xl font-bold text-red-500">Error</h1>
            <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">
              {parsed.error.message}
            </p>
            {parsed.error.stack && (
              <div className="mb-6 w-full max-w-2xl overflow-auto rounded border border-gray-300 bg-gray-100 p-4 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {parsed.error.stack.split("\n").map((line, i) => (
                  <p key={i}>
                    <span className="text-gray-400 dark:text-zinc-500">at</span>{" "}
                    {line.replace(/^at\s+/, "")}
                  </p>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold text-red-500">Error</h1>
            <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">
              Unknown Error
            </p>
          </>
        )}
        <Link
          className="mt-4 flex h-12 items-center justify-center gap-3 rounded-xl border border-zinc-300 px-4 text-sm text-zinc-700 hover:underline dark:border-zinc-700 dark:text-zinc-300"
          to="/"
          replace={true}
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
};
