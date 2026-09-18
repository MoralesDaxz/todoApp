import { useCallback, useSyncExternalStore } from "react";

type ScrollTarget = HTMLElement | Window;

function getScrollTop(target: ScrollTarget): number {
  // window no tiene scrollTop, tiene scrollY
  return target instanceof Window ? target.scrollY : target.scrollTop;
}

/**
 * Hook especializado: en vez de exponer el scrollY crudo (lo que
 * provocaría un re-render en cada pixel), expone un booleano derivado.
 *
 * React (vía Object.is) solo dispara re-render cuando ese booleano
 * cambia, es decir, justo al cruzar el umbral. El listener de scroll
 * sigue corriendo en cada evento, pero eso es barato: solo lee
 * scrollTop/scrollY y compara, no toca el DOM ni el árbol de React.
 *
 * @param threshold cuántos px de scroll deben pasar para que sea `true`
 * @param target elemento que realmente scrollea. Si es `null`/omitido,
 *   usa `window` (caso de página completa sin contenedor con overflow).
 *   Si tienes un `<div className="overflow-auto">`, pásale ese elemento
 *   (normalmente vía un ref/state, ver ejemplo).
 *
 * @example
 * // Página completa
 * const showBackToTop = useScrollThreshold(400);
 *
 * @example
 * // Contenedor propio con overflow-auto
 * const [container, setContainer] = useState<HTMLDivElement | null>(null);
 * const showBackToTop = useScrollThreshold(400, container);
 * return <div ref={setContainer} className="overflow-auto max-h-dvh">...</div>;
 */
export function useScrollThreshold(
  threshold: number,
  target?: HTMLElement | null
): boolean {
  // En SSR "window" no existe: caemos a un target inerte.
  const scrollTarget: ScrollTarget | null =
    target ?? (typeof window !== "undefined" ? window : null);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!scrollTarget) return () => {};
      scrollTarget.addEventListener("scroll", callback, { passive: true });
      return () =>
        scrollTarget.removeEventListener("scroll", callback);
    },
    [scrollTarget]
  );

  const getSnapshot = useCallback(() => {
    if (!scrollTarget) return false;
    return getScrollTop(scrollTarget) > threshold;
  }, [scrollTarget, threshold]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
