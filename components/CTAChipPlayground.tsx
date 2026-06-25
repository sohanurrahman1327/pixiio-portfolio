"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const DRAG_HISTORY_MS = 80;
const MAX_THROW_SPEED = 22;

export const serviceChips = [
  { id: 1, label: "Pay As You Go", accent: "#5b5fef" },
  { id: 2, label: "Ecommerce Dev", accent: "#d62976", hideBelowMd: true },
  { id: 3, label: "Figma To Webflow", accent: "#3a8a6d" },
  { id: 4, label: "Web Animation", accent: "#8b5cf6" },
  { id: 5, label: "Migration", accent: "#6b7cff" },
  { id: 6, label: "Motion Design", accent: "#4292b5" },
  { id: 7, label: "White Label", accent: "#e84393" },
  { id: 8, label: "Webflow Development", accent: "#20a884", hideBelowMd: true },
  { id: 9, label: "Integration", accent: "#7c3aed" },
  { id: 10, label: "WordPress To Webflow", accent: "#4f8ef7", hideBelowMd: true },
  { id: 11, label: "UI/UX Design", accent: "#5b7cfa" },
  { id: 12, label: "SaaS", accent: "#ec4899" },
  { id: 13, label: "Webflow Library", accent: "#9b5de5" },
  { id: 14, label: "Landing Pages", accent: "#2eb88a" },
  { id: 15, label: "Branding", accent: "#f472b6", hideBelowMd: true },
  { id: 16, label: "SEO", accent: "#38bdf8" },
  { id: 17, label: "Next.js", accent: "#6366f1", hideBelowMd: true },
  { id: 18, label: "App Development", accent: "#14b8a6" },
] as const;

type ServiceChip = (typeof serviceChips)[number];

function getActiveChips(): ServiceChip[] {
  if (typeof window === "undefined") return [...serviceChips];
  const isMobile = window.innerWidth < 768;
  return serviceChips.filter((chip) => !("hideBelowMd" in chip && chip.hideBelowMd && isMobile));
}

/** Vertical padding inside each pill */
const CHIP_PY = 10;
/** Horizontal padding — double the vertical */
const CHIP_PX = CHIP_PY * 2;
/** Section edge inset for walls — 0 so chips bounce flush with section bounds */
const CHIP_EDGE = 0;

type ChipDims = { w: number; h: number };

function measureChips(
  chipEls: Map<number, HTMLDivElement>
): Map<number, ChipDims> {
  const dims = new Map<number, ChipDims>();
  chipEls.forEach((el, id) => {
    const { width, height } = el.getBoundingClientRect();
    const w = Math.ceil(width);
    const h = Math.ceil(height);
    dims.set(id, { w, h });
    el.dataset.w = String(w);
    el.dataset.h = String(h);
  });
  return dims;
}

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

export default function CTAChipPlayground({ sectionRef }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const chipElsRef = useRef(new Map<number, HTMLDivElement>());
  const bodiesRef = useRef(new Map<number, Matter.Body>());
  const wallsRef = useRef<Matter.Body[]>([]);
  const spawnTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const current = sectionRef.current;
    const layer = layerRef.current;
    if (!current || !layer) return;
    const sectionEl: HTMLElement = current;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: reducedMotion ? 0 : 1.4, scale: 0.001 },
    });
    engine.positionIterations = 12;
    engine.velocityIterations = 10;
    engine.enableSleeping = true;

    const WALL = 80;
    const SIDE_BOUNCE = 0.38;
    const TOP_BOUNCE = 0.32;
    const BOTTOM_BOUNCE = 0.22;

    function bodyHalfWidth(body: Matter.Body) {
      const chipId = (body as Matter.Body & { chipId?: number }).chipId;
      if (chipId) {
        const dim = chipDims.get(chipId);
        if (dim) return dim.w / 2;
      }
      return (body.bounds.max.x - body.bounds.min.x) / 2;
    }

    function bodyHalfHeight(body: Matter.Body) {
      const chipId = (body as Matter.Body & { chipId?: number }).chipId;
      if (chipId) {
        const dim = chipDims.get(chipId);
        if (dim) return dim.h / 2;
      }
      return (body.bounds.max.y - body.bounds.min.y) / 2;
    }

    /** Rotated chip footprint — keeps pills inside edges when tilted */
    function bodyExtents(body: Matter.Body) {
      const hw = bodyHalfWidth(body);
      const hh = bodyHalfHeight(body);
      const c = Math.abs(Math.cos(body.angle));
      const s = Math.abs(Math.sin(body.angle));
      return { ex: hw * c + hh * s, ey: hw * s + hh * c };
    }

    function clampBodyBounds(
      body: Matter.Body,
      sectionW: number,
      sectionH: number,
      bounce = false
    ) {
      const { ex, ey } = bodyExtents(body);
      const minX = CHIP_EDGE + ex;
      const maxX = sectionW - CHIP_EDGE - ex;
      const minY = CHIP_EDGE + ey;
      const maxY = sectionH - CHIP_EDGE - ey;
      let { x, y } = body.position;
      let moved = false;

      if (x < minX) {
        x = minX;
        if (bounce) body.velocity.x = Math.abs(body.velocity.x) * SIDE_BOUNCE;
        moved = true;
      } else if (x > maxX) {
        x = maxX;
        if (bounce) body.velocity.x = -Math.abs(body.velocity.x) * SIDE_BOUNCE;
        moved = true;
      }

      if (y < minY) {
        if (body === draggedBody || (bounce && body.velocity.y < 0)) {
          y = minY;
          if (bounce && body.velocity.y < 0) {
            body.velocity.y = Math.abs(body.velocity.y) * TOP_BOUNCE;
          }
          moved = true;
        }
      } else if (y > maxY) {
        y = maxY;
        if (bounce) body.velocity.y = -Math.abs(body.velocity.y) * BOTTOM_BOUNCE;
        moved = true;
      }

      if (moved) Matter.Body.setPosition(body, { x, y });
      return moved;
    }

    function buildWalls(w: number, h: number) {
      wallsRef.current.forEach((wall) =>
        Matter.Composite.remove(engine.world, wall)
      );
      const leftWallX = CHIP_EDGE - WALL / 2;
      const rightWallX = w - CHIP_EDGE + WALL / 2;
      const bottomWallY = h - CHIP_EDGE + WALL / 2;
      const walls = [
        Matter.Bodies.rectangle(w / 2, bottomWallY, w + WALL * 2, WALL, {
          isStatic: true,
          friction: 0.85,
          restitution: BOTTOM_BOUNCE,
        }),
        Matter.Bodies.rectangle(leftWallX, h / 2, WALL, h * 3, {
          isStatic: true,
          friction: 0.6,
          restitution: SIDE_BOUNCE,
        }),
        Matter.Bodies.rectangle(rightWallX, h / 2, WALL, h * 3, {
          isStatic: true,
          friction: 0.6,
          restitution: SIDE_BOUNCE,
        }),
      ];
      wallsRef.current = walls;
      Matter.Composite.add(engine.world, walls);
    }

    let chipDims = measureChips(chipElsRef.current);
    const activeChips = getActiveChips();

    function spawnChip(
      chip: (typeof serviceChips)[number],
      index: number
    ) {
      const dim = chipDims.get(chip.id);
      if (!dim) return;
      const { w, h } = dim;
      const sw = sectionEl.clientWidth;
      const x =
        w / 2 +
        CHIP_EDGE +
        Math.random() * Math.max(sw - w - CHIP_EDGE * 2, 48);
      const y = -(h + 60 + Math.random() * 160 + (index % 4) * 36);

      const body = Matter.Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.26,
        friction: 0.52,
        frictionStatic: 0.72,
        frictionAir: 0.014,
        density: 0.0022,
      });
      (body as Matter.Body & { chipId: number }).chipId = chip.id;
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.12);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
      bodiesRef.current.set(chip.id, body);
      Matter.Composite.add(engine.world, body);
    }

    function layoutStaticPile() {
      const h = sectionEl.clientHeight;
      const sw = sectionEl.clientWidth;
      let xCursor = CHIP_EDGE;
      let row = 0;
      let rowMaxH = 0;

      activeChips.forEach((chip, i) => {
        const dim = chipDims.get(chip.id);
        if (!dim) return;
        const { w, h: chipH } = dim;
        if (xCursor + w > sw - CHIP_EDGE) {
          xCursor = CHIP_EDGE;
          row += 1;
          rowMaxH = 0;
        }
        rowMaxH = Math.max(rowMaxH, chipH);
        const body = bodiesRef.current.get(chip.id);
        if (!body) return;

        const y = h - chipH / 2 - row * (rowMaxH + 4);
        Matter.Body.setPosition(body, { x: xCursor + w / 2, y });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.06);
        xCursor += w + 8;

        if (i === activeChips.length - 1) void rowMaxH;
      });
    }

    buildWalls(sectionEl.clientWidth, sectionEl.clientHeight);

    let draggedBody: Matter.Body | null = null;
    let dragOffset = { x: 0, y: 0 };
    let activePointerId: number | null = null;
    const pointerHistory: { x: number; y: number; t: number }[] = [];

    function pointerPos(clientX: number, clientY: number) {
      const rect = sectionEl.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    function findBodyAtPoint(x: number, y: number) {
      const bodies = [...bodiesRef.current.values()];
      const hit = Matter.Query.point(bodies, { x, y });
      if (hit.length) return hit[0];
      const region = Matter.Query.region(bodies, {
        min: { x: x - 18, y: y - 18 },
        max: { x: x + 18, y: y + 18 },
      });
      return region[0];
    }

    function bringChipToFront(body: Matter.Body) {
      const chipId = (body as Matter.Body & { chipId?: number }).chipId;
      if (!chipId) return;
      const el = chipElsRef.current.get(chipId);
      if (el?.parentElement) el.parentElement.appendChild(el);
    }

    function recordPointerSample(x: number, y: number) {
      const now = performance.now();
      pointerHistory.push({ x, y, t: now });
      while (
        pointerHistory.length > 1 &&
        now - pointerHistory[0].t > DRAG_HISTORY_MS
      ) {
        pointerHistory.shift();
      }
    }

    function releaseVelocity() {
      if (pointerHistory.length < 2) return { x: 0, y: 0 };
      const first = pointerHistory[0];
      const last = pointerHistory[pointerHistory.length - 1];
      const dt = last.t - first.t;
      if (dt <= 0) return { x: 0, y: 0 };
      const scale = 1000 / dt;
      const vx = Math.max(-MAX_THROW_SPEED, Math.min(MAX_THROW_SPEED, (last.x - first.x) * scale * 0.06));
      const vy = Math.max(-MAX_THROW_SPEED, Math.min(MAX_THROW_SPEED, (last.y - first.y) * scale * 0.06));
      return { x: vx, y: vy };
    }

    function setDraggedPosition(clientX: number, clientY: number) {
      if (!draggedBody) return;
      const pos = pointerPos(clientX, clientY);
      Matter.Body.setPosition(draggedBody, {
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y,
      });
      clampBodyBounds(
        draggedBody,
        sectionEl.clientWidth,
        sectionEl.clientHeight
      );
      recordPointerSample(clientX, clientY);
    }

    function startDrag(clientX: number, clientY: number, pointerId: number) {
      const pos = pointerPos(clientX, clientY);
      const body = findBodyAtPoint(pos.x, pos.y);
      if (!body) return false;

      draggedBody = body;
      activePointerId = pointerId;
      dragOffset = { x: pos.x - body.position.x, y: pos.y - body.position.y };
      pointerHistory.length = 0;
      recordPointerSample(clientX, clientY);

      Matter.Sleeping.set(body, false);
      Matter.Body.setStatic(body, true);
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      bringChipToFront(body);
      setDraggedPosition(clientX, clientY);

      window.addEventListener("pointermove", onWindowPointerMove, {
        passive: false,
      });
      window.addEventListener("pointerup", onWindowPointerUp);
      window.addEventListener("pointercancel", onWindowPointerUp);
      return true;
    }

    function endDrag() {
      if (!draggedBody) return;

      const body = draggedBody;
      const velocity = releaseVelocity();

      Matter.Body.setStatic(body, false);
      clampBodyBounds(body, sectionEl.clientWidth, sectionEl.clientHeight);
      Matter.Body.setVelocity(body, velocity);
      if (Math.abs(velocity.x) + Math.abs(velocity.y) > 0.4) {
        Matter.Body.setAngularVelocity(
          body,
          (Math.random() - 0.5) * 0.04 + velocity.x * 0.008
        );
      }

      draggedBody = null;
      activePointerId = null;
      pointerHistory.length = 0;

      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    }

    function onWindowPointerMove(e: PointerEvent) {
      if (!draggedBody || e.pointerId !== activePointerId) return;

      const events =
        e.getCoalescedEvents?.().length ? e.getCoalescedEvents() : [e];
      for (const ev of events) {
        setDraggedPosition(ev.clientX, ev.clientY);
      }
      e.preventDefault();
    }

    function onWindowPointerUp(e: PointerEvent) {
      if (!draggedBody || e.pointerId !== activePointerId) return;
      endDrag();
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const chip = (e.target as HTMLElement).closest("[data-chip]");
      if (!chip) return;
      if (startDrag(e.clientX, e.clientY, e.pointerId)) {
        chip.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    };

    layer.addEventListener("pointerdown", onPointerDown);

    // Keep chips inside section on all four sides
    Matter.Events.on(engine, "beforeUpdate", () => {
      const sectionW = sectionEl.clientWidth;
      const sectionH = sectionEl.clientHeight;
      bodiesRef.current.forEach((body) => {
        if (body.isStatic && body !== draggedBody) return;
        clampBodyBounds(
          body,
          sectionW,
          sectionH,
          body !== draggedBody
        );
      });
    });

    if (reducedMotion) {
      activeChips.forEach((chip, i) => spawnChip(chip, i));
      layoutStaticPile();
    } else {
      activeChips.forEach((chip, i) => {
        const delay = 280 + i * 115 + Math.random() * 90;
        const timer = setTimeout(() => spawnChip(chip, i), delay);
        spawnTimersRef.current.push(timer);
      });
    }

    let lastFrame = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - lastFrame, 32);
      lastFrame = now;
      Matter.Engine.update(engine, delta);
      bodiesRef.current.forEach((body, id) => {
        const el = chipElsRef.current.get(id);
        if (!el) return;
        const w = Number(el.dataset.w);
        const h = Number(el.dataset.h);
        el.style.opacity = "1";
        el.style.transform = `translate3d(${body.position.x - w / 2}px,${body.position.y - h / 2}px,0) rotate(${body.angle}rad)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      chipDims = measureChips(chipElsRef.current);
      buildWalls(sectionEl.clientWidth, sectionEl.clientHeight);
      if (reducedMotion) layoutStaticPile();
    });
    ro.observe(sectionEl);

    const onSpawned = () => window.dispatchEvent(new Event("lenis:resize"));
    const spawnDoneTimer = reducedMotion
      ? window.setTimeout(onSpawned, 0)
      : window.setTimeout(onSpawned, 280 + activeChips.length * 115 + 200);

    return () => {
      cancelAnimationFrame(rafRef.current);
      spawnTimersRef.current.forEach(clearTimeout);
      spawnTimersRef.current = [];
      window.clearTimeout(spawnDoneTimer);
      ro.disconnect();
      layer.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      Matter.Events.off(engine, "beforeUpdate");
      Matter.Engine.clear(engine);
      wallsRef.current = [];
      bodiesRef.current.clear();
    };
  }, [sectionRef]);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 z-20 pointer-events-none"
      aria-hidden="false"
    >
      {serviceChips.map((chip) => (
          <div
            key={chip.id}
            data-chip
            ref={(el) => {
              if (el) chipElsRef.current.set(chip.id, el);
              else chipElsRef.current.delete(chip.id);
            }}
            className={`cta-chip absolute top-0 left-0 opacity-0 pointer-events-auto cursor-grab active:cursor-grabbing select-none touch-none will-change-transform rounded-full font-bold text-sm md:text-base tracking-wide whitespace-nowrap inline-flex items-center justify-center${"hideBelowMd" in chip && chip.hideBelowMd ? " max-md:hidden" : ""}`}
            style={{
              boxSizing: "border-box",
              padding: `${CHIP_PY}px ${CHIP_PX}px`,
              touchAction: "none",
              ["--chip-accent" as string]: chip.accent,
            }}
          >
            {chip.label}
          </div>
      ))}
    </div>
  );
}
