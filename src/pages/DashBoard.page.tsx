import { useState } from "react";
import { PickLists } from "../features/todos/components/PickLists";
import { CreateOrJoinList } from "../features/todos/components/CreateOrJoinList";
import { Lists } from "../features/todos/components/Lists";
import LogUser from "../components/layout/userMenu/LogUser";

export const DashBoard = () => {
  const [pickList, setPickList] = useState<"myLists" | "sharedLists">(
    "myLists",
  );

  return (
    <section className="px-4">
      <LogUser />
      <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
      <CreateOrJoinList />
      <PickLists pickList={pickList} setPickList={setPickList} />
      <Lists pickList={pickList} />
    </section>
  );
};

export default DashBoard;
