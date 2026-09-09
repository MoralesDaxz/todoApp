import type { Dispatch, SetStateAction } from "react";
import { TbListDetailsFilled } from "react-icons/tb";
import { HiUsers } from "react-icons/hi2";
interface Props {
  setPickList: Dispatch<SetStateAction<"myLists" | "sharedLists">>;
  pickList: "myLists" | "sharedLists";
}

export const PickLists = ({ setPickList, pickList }: Props) => {
  const stylePickList =
    "w-full rounded-md text-[1.1rem] py-4 transition-colors duration-300 ease-in cursor-pointer text-gray-300 hover:text-white hover:font-medium outline-none flex items-center justify-around";
  return (
    <>
      <div className="bg-gray-950  gap-2 rounded-md  my-2 flex text-center p-2">
        <p
          onClick={() => setPickList("myLists")}
          className={`${stylePickList} + ${pickList === "myLists" ? "bg-[#1163c2] text-white font-medium shadow-md" : "bg-gray-700 text-gray-200 hover:text-white"}`}
        >
          <span>Mis listas</span>

          <TbListDetailsFilled className="w-5 h-5" />
        </p>
        <p
          onClick={() => setPickList("sharedLists")}
          className={`${stylePickList} +  ${pickList === "sharedLists" ? "bg-[#1163c2] text-white font-medium shadow-md" : "bg-gray-700 text-gray-200 hover:text-white"}`}
        >
          <span>Compartidas</span>

          <HiUsers className="w-5 h-5" />
        </p>
      </div>
    </>
  );
};
