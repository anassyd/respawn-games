"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Full-screen animated starfield.
 * - 3 depth layers drift slowly and parallax with the mouse and scroll
 * - occasional shooting stars
 * - "warp jump" (stars stretch into streaks) every time the route changes
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warp = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    warp.current = 1; // trigger a warp burst on navigation
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    type Star = { x: number; y: number; z: number; r: number; tw: number; hue: number };
    let stars: Star[] = [];
    type Shot = { x: number; y: number; vx: number; vy: number; life: number };
    const shots: Shot[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.floor((w * h) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1, // depth: 0.1 far … 1 near
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? 286 : Math.random() < 0.3 ? 186 : 220,
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / w - 0.5) * 2;
      mouse.ty = (e.clientY / h - 0.5) * 2;
    };

    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      warp.current = Math.max(0, warp.current - 0.018);
      const wv = reduce ? 0 : warp.current;
      const scroll = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      for (const s of stars) {
        if (!reduce) {
          s.y += 0.04 * s.z; // slow drift
          if (s.y > h) s.y = 0;
        }
        const px = s.x + mouse.x * 18 * s.z;
        const py = ((s.y - scroll * 0.08 * s.z) % h + h) % h + mouse.y * 12 * s.z;
        const twinkle = 0.55 + Math.sin(t * 0.002 + s.tw) * 0.35;
        const alpha = Math.min(1, twinkle * (0.35 + s.z * 0.75));

        if (wv > 0.02) {
          // warp streaks radiate from the centre
          const dx = px - cx, dy = py - cy;
          const len = wv * 140 * s.z;
          const d = Math.hypot(dx, dy) || 1;
          ctx.strokeStyle = `hsla(${s.hue}, 100%, 85%, ${alpha})`;
          ctx.lineWidth = s.r;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + (dx / d) * len, py + (dy / d) * len);
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsla(${s.hue}, 100%, 88%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, s.r * (0.6 + s.z * 0.6), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduce && Math.random() < 0.006 && shots.length < 2) {
        shots.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 9 + Math.random() * 6, vy: 3 + Math.random() * 3, life: 1 });
      }
      for (let i = shots.length - 1; i >= 0; i--) {
        const sh = shots[i];
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        grad.addColorStop(0, `hsla(186, 100%, 90%, ${sh.life})`);
        grad.addColorStop(1, "hsla(186, 100%, 90%, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        ctx.stroke();
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
        if (sh.life <= 0 || sh.x > w + 200) shots.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* nebula haze */}
      <div className="absolute -left-[20%] top-[-10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,hsl(var(--plasma)/0.16),transparent)] blur-2xl" />
      <div className="absolute -right-[15%] top-[30%] h-[80vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,hsl(var(--ion)/0.11),transparent)] blur-2xl" />
      <div className="absolute bottom-[-20%] left-[20%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,hsl(230_90%_60%/0.10),transparent)] blur-2xl" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
