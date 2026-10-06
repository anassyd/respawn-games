import { KeyRound } from "lucide-react";

/** Shown when the RAWG key is missing from .env.local. */
export function SetupNotice() {
  return (
    <div className="glass hud mx-auto max-w-xl rounded-2xl p-8 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-solar/15 text-solar"><KeyRound className="h-6 w-6" /></span>
      <h2 className="mt-4 text-xl font-bold">RAWG key needed</h2>
      <p className="mt-2 text-sm text-dim">
        Create a free key at{" "}
        <a className="text-ion underline-offset-4 hover:underline" href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">rawg.io/apidocs</a>
        , add it to <Code>.env.local</Code> as <Code>RAWG_API_KEY</Code>, then restart{" "}
        <code className="font-mono text-xs">npm run dev</code>.
      </p>
    </div>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">{children}</code>
);
