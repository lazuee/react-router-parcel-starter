"use client";

import { Link } from "react-router";

export const GotoNonExistingPage: React.FC = () => {
  return (
    <Link
      className="group flex h-12 items-center gap-3 rounded-xl border border-zinc-300 px-4 text-sm leading-normal text-zinc-700 hover:underline dark:border-zinc-700 dark:text-zinc-300"
      to="/non-existing-page"
    >
      Goto non-existing page
    </Link>
  );
};
