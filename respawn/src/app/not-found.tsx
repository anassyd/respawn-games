import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-8xl font-bold text-ion text-glow">404</p>
        <h1 className="mt-2 text-3xl font-bold">Lost in space</h1>
        <p className="mt-2 text-dim">This sector is empty. The game or character may not exist.</p>
        <Button asChild className="mt-6"><Link href="/">Return to base</Link></Button>
      </div>
    </div>
  );
}
