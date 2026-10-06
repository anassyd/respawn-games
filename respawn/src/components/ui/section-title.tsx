import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/fx/reveal";

export function SectionTitle({ kicker, title, href, linkLabel = "View all" }: { kicker: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <Reveal className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="label flex items-center gap-2"><span className="h-px w-8 bg-ion" />{kicker}</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex items-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-ion">
          {linkLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
