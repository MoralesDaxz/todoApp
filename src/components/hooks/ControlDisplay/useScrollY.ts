import { useSyncExternalStore } from "react";


let cachedScrollY = typeof window !== "undefined" ? window.scrollY : 0;
let ticking = false;
const listeners = new Set<() => void>();

function handleScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    cachedScrollY = window.scrollY;
    ticking = false;
    listeners.forEach((listener) => listener());
  });
}

function subscribe(callback: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", handleScroll);
    }
  };
}

function getSnapshot() {
  return cachedScrollY;
}

function getServerSnapshot() {
  return 0;
}

export function useScrollY(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
