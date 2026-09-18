import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";

type ModalContextProps = {
  closeModal: boolean;
  setCloseModal: Dispatch<SetStateAction<boolean>>;
};

// undefined por defecto (en vez de no-ops silenciosos) para poder
// detectar en tiempo de ejecución si alguien usa el hook fuera del Provider.
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [closeModal, setCloseModal] = useState<boolean>(true);

  return (
    <ModalContext.Provider value={{ closeModal, setCloseModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal(): ModalContextProps {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal debe usarse dentro de un ModalProvider");
  }
  return ctx;
}
