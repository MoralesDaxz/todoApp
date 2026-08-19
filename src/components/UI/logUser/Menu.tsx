import "./menu.css";

type Props = {
  classMenu: string;
  setClassMenu: (value: string) => void;
};
export const Menu = ({ classMenu, setClassMenu }: Props) => {
  console.log("Renderizado de Menu");
  
  return (
    <div className="absolute left-2 top-3 z-50">
      <div
        className={classMenu}
        onClick={() => {
          setClassMenu(classMenu === "openMenu" ? "closeMenu" : "openMenu");
        }}
      >
        <div className="menuBar1"></div>
        <div className="menuBar2"></div>
        <div className="menuBar3"></div>
      </div>
    </div>
  );
};
