"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export const serviceChips = [
  { id: 1, label: "Pay as you Go", className: "bg-[#5b5fef] text-white ring-1 ring-white/20" },
  { id: 2, label: "eCOMMERCEDEV", className: "bg-[#7b83f7] text-white ring-1 ring-white/15", hideBelowMd: true },
  { id: 3, label: "Figma to Webflow", className: "bg-white/95 text-[#0f1a3d] ring-1 ring-white/40 dark:bg-white/10 dark:text-white dark:ring-white/20" },
  { id: 4, label: "Web Animation", className: "bg-[#a5b4fc] text-[#0f1a3d] ring-1 ring-white/10 dark:bg-primary/30 dark:text-white dark:ring-primary/30" },
  { id: 5, label: "Migration", className: "bg-[#6366f1] text-white ring-1 ring-white/15" },
  { id: 6, label: "Motion Design", className: "bg-surface-muted text-[#0f1a3d] ring-1 ring-[#5b5fef]/20 dark:bg-white/10 dark:text-white dark:ring-white/20" },
  { id: 7, label: "White Label", className: "bg-[#4a4ed9] text-white ring-1 ring-white/15" },
  { id: 8, label: "Webflow Development", className: "bg-[#c7d2fe] text-[#0f1a3d] ring-1 ring-white/10 dark:bg-primary/25 dark:text-white dark:ring-primary/25", hideBelowMd: true },
  { id: 9, label: "Integration", className: "bg-[#8b8ff2] text-white ring-1 ring-white/15" },
  { id: 10, label: "WordPress to Webflow", className: "bg-[#dde1ff] text-[#0f1a3d] ring-1 ring-[#5b5fef]/15 dark:bg-primary/20 dark:text-white dark:ring-primary/20", hideBelowMd: true },
  { id: 11, label: "UI/UX Design", className: "bg-[#9498f5] text-white ring-1 ring-white/15" },
  { id: 12, label: "SaaS", className: "bg-white/80 text-[#0f1a3d] ring-1 ring-white/30 dark:bg-white/10 dark:text-white dark:ring-white/20" },
  { id: 13, label: "Webflow Library", className: "bg-[#6d71f0] text-white ring-1 ring-white/15" },
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
/** Section edge inset (matches px-6) */
const CHIP_EDGE = 24;

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
    engine.positionIterations = 10;
    engine.velocityIterations = 10;

    const WALL = 80;

    function buildWalls(w: number, h: number) {
      wallsRef.current.forEach((wall) =>
        Matter.Composite.remove(engine.world, wall)
      );
      const walls = [
        Matter.Bodies.rectangle(w / 2, h + WALL / 2, w + WALL * 2, WALL, {
          isStatic: true,
          friction: 0.85,
          restitution: 0.22,
        }),
        Matter.Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 3, {
          isStatic: true,
          restitution: 0.35,
        }),
        Matter.Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 3, {
          isStatic: true,
          restitution: 0.35,
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

    // Detached mouse element — never bind Matter to the section so wheel/touch
    // scroll can pass through to Lenis on the full page.
    const mouse = Matter.Mouse.create(document.createElement("div"));
    const mouseHandlers = mouse as Matter.Mouse & {
      mousewheel: EventListener;
      mousemove: EventListener;
      mousedown: EventListener;
      mouseup: EventListener;
    };
    mouse.element.removeEventListener("wheel", mouseHandlers.mousewheel);
    mouse.element.removeEventListener("touchmove", mouseHandlers.mousemove);
    mouse.element.removeEventListener("touchstart", mouseHandlers.mousedown);
    mouse.element.removeEventListener("touchend", mouseHandlers.mouseup);
    mouse.element.removeEventListener("mousemove", mouseHandlers.mousemove);
    mouse.element.removeEventListener("mousedown", mouseHandlers.mousedown);
    mouse.element.removeEventListener("mouseup", mouseHandlers.mouseup);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.14,
        damping: 0.09,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    let draggedBody: Matter.Body | null = null;
    let dragOffset = { x: 0, y: 0 };

    function pointerPos(clientX: number, clientY: number) {
      const rect = sectionEl.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    function syncMousePosition(clientX: number, clientY: number) {
      const rect = sectionEl.getBoundingClientRect();
      const scaleX = sectionEl.clientWidth / rect.width || 1;
      const scaleY = sectionEl.clientHeight / rect.height || 1;
      mouse.absolute.x = (clientX - rect.left) * scaleX;
      mouse.absolute.y = (clientY - rect.top) * scaleY;
      mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
      mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
    }

    function findBodyAtPoint(x: number, y: number) {
      const bodies = [...bodiesRef.current.values()];
      const hit = Matter.Query.point(bodies, { x, y });
      if (hit.length) return hit[0];
      const region = Matter.Query.region(bodies, {
        min: { x: x - 14, y: y - 14 },
        max: { x: x + 14, y: y + 14 },
      });
      return region[0];
    }

    function bringChipToFront(body: Matter.Body) {
      const chipId = (body as Matter.Body & { chipId?: number }).chipId;
      if (!chipId) return;
      const el = chipElsRef.current.get(chipId);
      if (el?.parentElement) el.parentElement.appendChild(el);
    }

    function startDrag(clientX: number, clientY: number) {
      const pos = pointerPos(clientX, clientY);
      const body = findBodyAtPoint(pos.x, pos.y);
      if (!body) return false;
      draggedBody = body;
      dragOffset = { x: pos.x - body.position.x, y: pos.y - body.position.y };
      bringChipToFront(body);
      syncMousePosition(clientX, clientY);
      return true;
    }

    function moveDrag(clientX: number, clientY: number) {
      if (!draggedBody) return;
      const pos = pointerPos(clientX, clientY);
      Matter.Body.setPosition(draggedBody, {
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y,
      });
      Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(draggedBody, 0);
      syncMousePosition(clientX, clientY);
    }

    function endDrag() {
      draggedBody = null;
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const chip = (e.target as HTMLElement).closest("[data-chip]");
      if (!chip) return;
      if (startDrag(e.clientX, e.clientY)) {
        chip.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggedBody) return;
      moveDrag(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggedBody) return;
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      endDrag();
    };

    const onPointerCancel = () => endDrag();

    layer.addEventListener("pointerdown", onPointerDown);
    layer.addEventListener("pointermove", onPointerMove);
    layer.addEventListener("pointerup", onPointerUp);
    layer.addEventListener("pointercancel", onPointerCancel);

    Matter.Events.on(mouseConstraint, "startdrag", () => {
      const body = mouseConstraint.body as
        | (Matter.Body & { chipId?: number })
        | null;
      if (!body?.chipId) return;
      const el = chipElsRef.current.get(body.chipId);
      if (el?.parentElement) el.parentElement.appendChild(el);
    });

    // Soft ceiling — bounce back when flung upward, without blocking the initial drop-in
    Matter.Events.on(engine, "beforeUpdate", () => {
      const maxH = Math.max(
        ...[...chipDims.values()].map((d) => d.h),
        CHIP_PY * 2 + 16
      );
      const ceiling = maxH / 2 + CHIP_PY;
      bodiesRef.current.forEach((body) => {
        if (body.position.y < ceiling && body.velocity.y < 0) {
          Matter.Body.setPosition(body, {
            x: body.position.x,
            y: ceiling,
          });
          body.velocity.y *= -0.32;
        }
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

    const tick = () => {
      Matter.Engine.update(engine, 1000 / 60);
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
      layer.removeEventListener("pointermove", onPointerMove);
      layer.removeEventListener("pointerup", onPointerUp);
      layer.removeEventListener("pointercancel", onPointerCancel);
      Matter.Events.off(mouseConstraint, "startdrag");
      Matter.Composite.remove(engine.world, mouseConstraint);
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
            className={`absolute top-0 left-0 opacity-0 pointer-events-auto cursor-grab active:cursor-grabbing select-none will-change-transform rounded-full font-bold text-sm md:text-base tracking-wide whitespace-nowrap inline-flex items-center justify-center shadow-lg shadow-black/25 ${chip.className}${"hideBelowMd" in chip && chip.hideBelowMd ? " max-md:hidden" : ""}`}
            style={{
              boxSizing: "border-box",
              padding: `${CHIP_PY}px ${CHIP_PX}px`,
            }}
          >
            {chip.label}
          </div>
      ))}
    </div>
  );
}
