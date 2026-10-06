"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Soft ion-coloured light that trails the cursor on desktop. */
export function CursorGlow() {
  const x = useMotionValue(-400), y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 22 });
  const sy = useSpring(y, { stiffness: 120, damping: 22 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--ion)/0.09),transparent)]"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
