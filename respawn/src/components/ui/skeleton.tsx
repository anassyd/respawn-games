import { cn } from "@/lib/utils";
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-white/[0.04]", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
