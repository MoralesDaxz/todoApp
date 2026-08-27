import type { Dispatch, SetStateAction } from "react";

interface Props {
  setPickList: Dispatch<SetStateAction<boolean>>;
  pickList: boolean;
}

export const PickLists = ({ setPickList, pickList }: Props) => {
  const stylePickList =
    "w-full rounded-md text-[1.1rem] p-3 transition-colors duration-300 ease-in cursor-pointer text-gray-300 hover:text-white hover:font-medium outline-none";
  return (
    <>
      <div className="bg-gray-950 border border-gray-700  rounded-md  my-2 flex text-center p-1">
        <button
          onClick={() => setPickList(true)}
          className={`${stylePickList} + ${pickList ? "bg-[#1163c2] font-medium" : null}`}
        >
          Mis listas
        </button>
        <button
          onClick={() => setPickList(false)}
          className={`${stylePickList} +  ${!pickList ? "bg-[#1163c2] font-medium" : null}`}
        >
          Compartidas
        </button>
      </div>
    </>
  );
};
