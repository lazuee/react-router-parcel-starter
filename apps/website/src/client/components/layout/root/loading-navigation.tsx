"use client";

import { useNavigation } from "react-router";

export const LoadingNavigation: React.FC = () => {
  const navigation = useNavigation();

  if (navigation.state === "idle") {
    return null;
  }

  return (
    <div className="h-1 w-full bg-zinc-50 overflow-hidden fixed top-0 left-0 z-50 opacity-50">
      <div className="animate-progress origin-[0%_50%] w-full h-full bg-red-500" />
    </div>
  );
};
