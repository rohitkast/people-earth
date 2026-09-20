import { useEffect, useRef } from "react";
import { makeProjection, landPath } from "./projection.js";

const OCEAN = "#070b10";
const LAND = "#15202b";
const STROKE = "rgba(232, 213, 163, 0.14)";
const DOT = "243, 226, 184";

export default function MapStage({ countries, atlas, yearIndex, yearFrac = 0 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef({
    projection: null,
    landD: "",
    projected: [],
    particles: [],
    width: 0,
    height: 0,
    yearIndex: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const ctx = canvas.getContext("2d", { alpha: false });
    const state = stateRef.current;
    let raf = 0;

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(240, Math.floor(rect.height));
      if (width === state.width && height === state.height && state.projection) {
        return;
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.width = width;
      state.height = height;
      state.projection = makeProjection(width, height, countries);
      state.landD = landPath(state.projection, countries);
      state.projected = atlas.countries.map((c) => {
        const pts = [];
        for (let i = 0; i < c.lon.length; i++) {
          const p = state.projection([c.lon[i], c.lat[i]]);
          if (p) pts.push(p);
        }
        return pts;
      });
      rebuildParticles(state, atlas, state.yearIndex, state.yearFrac || 0);
    };

    const draw = () => {
      const { width, height, landD, particles } = state;
      ctx.fillStyle = OCEAN;
      ctx.fillRect(0, 0, width, height);

      if (landD) {
        const path = new Path2D(landD);
        ctx.fillStyle = LAND;
        ctx.fill(path);
        ctx.imageSmoothingEnabled = true;
        ctx.strokeStyle = STROKE;
        ctx.lineWidth = 0.75;
        ctx.stroke(path);
      }

      ctx.fillStyle = `rgb(${DOT})`;
      for (const p of particles) {
        if (p.alpha < 0.02) continue;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      let moving = false;
      for (const p of particles) {
        const next = p.alpha + (p.target - p.alpha) * 0.06;
        if (Math.abs(next - p.alpha) > 0.004) moving = true;
        p.alpha = next;
      }
      if (moving) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    layout();
    raf = requestAnimationFrame(draw);

    const onResizeKick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResizeKick);

    state.kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResizeKick);
      cancelAnimationFrame(raf);
    };
  }, [atlas, countries]);

  useEffect(() => {
    const state = stateRef.current;
    state.yearIndex = yearIndex;
    state.yearFrac = yearFrac;
    if (!state.projected.length) return;
    rebuildParticles(state, atlas, yearIndex, yearFrac);
    if (state.kick) state.kick();
  }, [atlas, yearIndex, yearFrac]);

  return (
    <div className="stage" ref={wrapRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function rebuildParticles(state, atlas, yearIndex, yearFrac = 0) {
  const last = atlas.years.length - 1;
  const i0 = yearIndex;
  const i1 = Math.min(yearIndex + 1, last);
  const next = [];
  atlas.countries.forEach((c, ci) => {
    const k0 = c.counts[i0] || 0;
    const k1 = c.counts[i1] || k0;
    const k = Math.round(k0 + (k1 - k0) * yearFrac);
    const pts = state.projected[ci] || [];
    const n = Math.min(k, pts.length);
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i];
      next.push({
        x,
        y,
        r: 1.25,
        alpha: 0,
        target: 1,
        key: `${c.code}:${i}`,
      });
    }
  });

  const prev = new Map(state.particles.map((p) => [p.key, p]));
  for (const p of next) {
    const old = prev.get(p.key);
    if (old) {
      p.alpha = old.alpha;
    }
  }
  state.particles = next;
}
