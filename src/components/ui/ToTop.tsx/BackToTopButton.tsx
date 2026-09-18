import { useScrollThreshold } from "../../hooks/ControlDisplay/useScrollThreshold";
import { FaArrowUpFromBracket } from "react-icons/fa6";
type BackToTopButtonProps = {
  threshold?: number;
  /**
   * El elemento que realmente scrollea. Pásalo cuando el scroll
   * ocurre dentro de un contenedor propio (ej. un div con
   * overflow-auto), no en la página completa.
   * Si se omite, se usa window (scroll de toda la página).
   */
  container?: HTMLElement | null;
  className?: string;
};

export function BackToTopButton({
  threshold = 500,
  container = null,
  className = "fixed bottom-6 right-1/2 z-60 bg-gray-200 hover:bg-blue-900 text-gray-300 hover:text-white p-1 rounded-full shadow-lg transition-colors ",
}: BackToTopButtonProps) {
  // Este componente SOLO se re-renderiza cuando cruza el umbral,
  // no en cada pixel de scroll.
  const isVisible = useScrollThreshold(threshold, container);

  if (!isVisible) return null;

  const scrollToTop = () => {
    const target = container ?? window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={className}
    >
      <FaArrowUpFromBracket  className="text-gray-900 w-4 h-4 animate-pulse" />
    </button>
  );
}
