"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/** Big parallax backdrop at the top of the game page. */
export function GameBackdrop({ image }: { image: string | null }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 220]);
  const scale = useTransform(scrollY, [0, 700], [1.05, 1.2]);
  return (
    <div className="relative -mt-[72px] h-[78vh] overflow-hidden">
      {image && (
        <motion.img
          src={image}
          alt=""
          style={{ y, scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(0,0,0,.18)_3px)] opacity-40" />
    </div>
  );
}
