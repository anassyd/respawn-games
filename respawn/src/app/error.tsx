"use client";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="label">Signal lost</p>
        <h1 className="mt-3 text-4xl font-bold">Couldn&apos;t reach the game servers</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-dim">{error.message.includes("401") ? "The RAWG API key looks invalid. Check .env.local." : "Check your connection and API keys, then try again."}</p>
        <Button className="mt-6" onClick={reset}>Retry</Button>
      </div>
    </div>
  );
}
