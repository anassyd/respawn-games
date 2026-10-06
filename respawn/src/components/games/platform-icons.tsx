import { Apple, Gamepad2, Globe, Monitor, Smartphone } from "lucide-react";
import type { Named } from "@/lib/types";

const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  pc: Monitor, playstation: Gamepad2, xbox: Gamepad2, nintendo: Gamepad2, mac: Apple, ios: Smartphone, android: Smartphone, web: Globe, linux: Monitor,
};

export function PlatformIcons({ platforms, max = 5 }: { platforms?: { platform: Named }[]; max?: number }) {
  if (!platforms?.length) return null;
  return (
    <div className="flex items-center gap-1.5 text-dim">
      {platforms.slice(0, max).map(({ platform }) => {
        const Icon = ICON[platform.slug] ?? Gamepad2;
        return (
          <span key={platform.id} title={platform.name} className="flex items-center">
            <Icon className="h-3.5 w-3.5" />
            <span className="sr-only">{platform.name}</span>
          </span>
        );
      })}
    </div>
  );
}
