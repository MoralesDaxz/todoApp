import { useSyncExternalStore } from "react";


function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

// Valor determinista para el render en servidor (evita mismatch de hidratación)
function getServerSnapshot() {
  return 0;
}


export function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
