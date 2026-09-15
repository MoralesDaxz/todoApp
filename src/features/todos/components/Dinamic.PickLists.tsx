import type { Dispatch, SetStateAction } from "react";
import { TbListDetailsFilled } from "react-icons/tb";
import { HiUsers } from "react-icons/hi2";
import { useLists } from "../hooks/useLists";
import { useAuth } from "../../../context/AuthContext";
interface Props {
  setPickList: Dispatch<SetStateAction<"myLists" | "sharedLists">>;
  pickList: "myLists" | "sharedLists";
}

export const PickLists = ({ setPickList, pickList }: Props) => {
  const stylePickList =
    "w-full relative rounded-md text-[1rem] py-4 transition-colors duration-300 ease-in cursor-pointer text-gray-300 hover:text-white hover:font-medium outline-none flex items-center justify-center gap-3";
  const { user } = useAuth();
  const { lists } = useLists();

  const listsMap = {
    myLists: [...lists].filter((list) => list.owner_id === user?.id),
    sharedLists: [...lists].filter((list) => list.owner_id !== user?.id),
  };

  return (
    <>
      <div className="bg-gray-950  gap-2 rounded-md  my-2 flex text-center p-2">
        <button
          onClick={() => setPickList("myLists")}
          className={`${stylePickList} + ${pickList === "myLists" ? "bg-[#1163c2] text-white font-medium shadow-md" : "bg-gray-700 text-gray-200 hover:text-white"}`}
        >
          <div className="w-5 h-5 flex items-center">
            <TbListDetailsFilled />
          </div>
          <p>Mis listas</p>
          <span className="absolute top-1 right-1 text-xs font-medium">
            {listsMap.myLists.length}
          </span>
        </button>
        <button
          onClick={() => setPickList("sharedLists")}
          className={`${stylePickList} +  ${pickList === "sharedLists" ? "bg-[#1163c2] text-white font-medium shadow-md" : "bg-gray-700 text-gray-200 hover:text-white"}`}
        >
          <p>Compartidas conmigo</p>
          <div className="w-5 h-5 flex items-center">
            <HiUsers />
          </div>

          <span className="absolute top-1 right-1 text-xs font-medium">
            {listsMap.sharedLists.length}
          </span>
        </button>
      </div>
    </>
  );
};
