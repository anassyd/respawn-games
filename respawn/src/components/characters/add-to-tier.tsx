"use client";
import { LayoutList } from "lucide-react";
import { toast } from "sonner";
import { useTierList } from "@/store/tierlist";
import { Button } from "@/components/ui/button";

export function AddCharacterToTier({ character }: { character: { id: number; name: string; image: string | null } }) {
  const add = useTierList((s) => s.add);
  return (
    <Button
      variant="outline"
      className="mt-4 w-full"
      onClick={() => toast(add({ id: `c-${character.id}`, kind: "character", name: character.name, image: character.image }) ? `${character.name} added to your tier list` : "Already on your tier list")}
    >
      <LayoutList /> Add to tier list
    </Button>
  );
}
