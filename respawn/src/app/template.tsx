"use client";

import { motion } from "framer-motion";

/** Runs on every navigation: the page rises in while the starfield warps.
 *  (Only opacity/transform — a lingering CSS filter would break position:fixed overlays.) */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
